// Payment Priority Analytics
// Sorts upcoming payments by severity (due date, amount, type)

import { supabase } from '../supabase/client';
import type { MetricResult, RecurringPayment } from '../types/finance';

/**
 * Get prioritized list of upcoming payments
 * Prioritized by: due date (earlier = higher priority), amount (larger = higher), type (debt > bill > subscription)
 */
export async function getPaymentPriority(userId: string): Promise<MetricResult & { payments: RecurringPayment[] }> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all upcoming payments (due date >= today)
    const { data: payments, error } = await supabase
      .from('recurring_payments')
      .select('*')
      .eq('user_id', userId)
      .gte('due_date', today.toISOString().split('T')[0])
      .order('due_date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    if (!payments || payments.length === 0) {
      return {
        metric: 'payment_priority',
        value: [],
        risk: 'low',
        explanation: 'No upcoming payments found.',
        inputs: {
          payment_count: 0,
        },
        payments: [],
      };
    }

    // Sort by priority: due date (ascending), then by type priority, then by amount (descending)
    const sortedPayments = [...payments].sort((a, b) => {
      // First, sort by due date
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      if (dateA !== dateB) {
        return dateA - dateB;
      }

      // Then by type priority (debt > bill > subscription > other)
      const typePriority: Record<string, number> = {
        debt: 1,
        bill: 2,
        subscription: 3,
        other: 4,
      };
      const priorityA = typePriority[a.type] || 5;
      const priorityB = typePriority[b.type] || 5;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Finally by amount (larger = higher priority)
      return b.amount - a.amount;
    });

    // Calculate total upcoming payments
    const totalAmount = sortedPayments.reduce((sum, p) => sum + p.amount, 0);

    // Check for overdue payments (shouldn't happen with gte filter, but just in case)
    const overduePayments = payments.filter(p => new Date(p.due_date) < today);
    const risk = overduePayments.length > 0 ? 'critical' : totalAmount > 5000 ? 'high' : totalAmount > 2000 ? 'medium' : 'low';

    return {
      metric: 'payment_priority',
      value: sortedPayments.length,
      risk,
      explanation: `Found ${sortedPayments.length} upcoming payment(s) totaling $${totalAmount.toFixed(2)}. Payments are prioritized by due date, type (debt > bill > subscription), and amount.`,
      inputs: {
        payment_count: sortedPayments.length,
        total_amount: totalAmount,
        overdue_count: overduePayments.length,
      },
      payments: sortedPayments,
    };
  } catch (error) {
    throw new Error(`Failed to get payment priority: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
