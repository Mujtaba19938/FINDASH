// Burn Rate Analytics
// Calculates monthly outflow from expenses and transactions

import { supabase } from '../supabase/client';
import type { MetricResult, Expense, Transaction } from '../types/finance';

/**
 * Calculate monthly burn rate (outflow) for a user
 * Combines recurring expenses and transaction history
 */
export async function getBurnRate(userId: string): Promise<MetricResult> {
  try {
    // Get all expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId);

    if (expensesError) {
      throw new Error(`Failed to fetch expenses: ${expensesError.message}`);
    }

    // Get transactions from the last 3 months for averaging
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', threeMonthsAgo.toISOString())
      .lt('amount', 0); // Only expenses (negative amounts)

    if (transactionsError) {
      throw new Error(`Failed to fetch transactions: ${transactionsError.message}`);
    }

    // Calculate monthly expense total from recurring expenses
    let monthlyExpenseTotal = 0;
    (expenses || []).forEach((expense: Expense) => {
      const monthlyAmount = convertToMonthly(expense.amount, expense.recurrence);
      monthlyExpenseTotal += monthlyAmount;
    });

    // Calculate average monthly transaction spending
    let averageMonthlyTransactions = 0;
    if (transactions && transactions.length > 0) {
      const totalTransactionAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      // Average over 3 months
      averageMonthlyTransactions = totalTransactionAmount / 3;
    }

    const burnRate = monthlyExpenseTotal + averageMonthlyTransactions;

    // Determine risk level based on burn rate
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (burnRate > 10000) risk = 'high';
    else if (burnRate > 5000) risk = 'medium';

    return {
      metric: 'burn_rate',
      value: Math.round(burnRate * 100) / 100,
      risk,
      explanation: `Monthly burn rate is $${burnRate.toFixed(2)}, calculated from recurring expenses ($${monthlyExpenseTotal.toFixed(2)}/month) and average transaction spending ($${averageMonthlyTransactions.toFixed(2)}/month over the last 3 months)`,
      inputs: {
        expense_count: expenses?.length || 0,
        transaction_count: transactions?.length || 0,
        monthly_expenses: monthlyExpenseTotal,
        avg_monthly_transactions: averageMonthlyTransactions,
      },
    };
  } catch (error) {
    throw new Error(`Failed to calculate burn rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert amount to monthly based on recurrence
 */
function convertToMonthly(amount: number, recurrence: string): number {
  switch (recurrence) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4.33; // Average weeks per month
    case 'biweekly':
      return amount * 2.17; // Average biweekly periods per month
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    case 'one-time':
      return 0; // One-time expenses don't contribute to monthly burn rate
    default:
      return amount;
  }
}
