// Classification Analytics
// Classifies transactions/expenses as discretionary vs fixed

import { supabase } from '../supabase/client';
import type { MetricResult, Expense, Transaction } from '../types/finance';

interface ClassificationSummary {
  fixed: {
    count: number;
    total: number;
    percentage: number;
  };
  discretionary: {
    count: number;
    total: number;
    percentage: number;
  };
}

/**
 * Classify transactions and expenses as discretionary vs fixed
 */
export async function classifyDiscretionaryVsFixed(userId: string): Promise<MetricResult & { classification: ClassificationSummary }> {
  try {
    // Get expenses (already have is_fixed flag)
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId);

    if (expensesError) {
      throw new Error(`Failed to fetch expenses: ${expensesError.message}`);
    }

    // Get transactions from last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', threeMonthsAgo.toISOString())
      .lt('amount', 0); // Only expenses

    if (transactionsError) {
      throw new Error(`Failed to fetch transactions: ${transactionsError.message}`);
    }

    // Categories typically considered "fixed"
    const fixedCategories = [
      'rent', 'mortgage', 'utilities', 'insurance', 'subscription',
      'loan', 'debt', 'tax', 'phone', 'internet', 'electricity',
      'water', 'gas', 'health insurance', 'car payment'
    ];

    // Classify expenses
    let fixedExpenseTotal = 0;
    let discretionaryExpenseTotal = 0;
    let fixedExpenseCount = 0;
    let discretionaryExpenseCount = 0;

    (expenses || []).forEach((expense: Expense) => {
      const monthlyAmount = convertToMonthly(expense.amount, expense.recurrence);
      if (expense.is_fixed) {
        fixedExpenseTotal += monthlyAmount;
        fixedExpenseCount++;
      } else {
        discretionaryExpenseTotal += monthlyAmount;
        discretionaryExpenseCount++;
      }
    });

    // Classify transactions
    (transactions || []).forEach((t: Transaction) => {
      const amount = Math.abs(t.amount);
      const isFixed = fixedCategories.some(cat => 
        t.category.toLowerCase().includes(cat.toLowerCase())
      );

      if (isFixed) {
        fixedExpenseTotal += amount / 3; // Average over 3 months
        fixedExpenseCount++;
      } else {
        discretionaryExpenseTotal += amount / 3;
        discretionaryExpenseCount++;
      }
    });

    const total = fixedExpenseTotal + discretionaryExpenseTotal;
    const fixedPercentage = total > 0 ? (fixedExpenseTotal / total) * 100 : 0;
    const discretionaryPercentage = total > 0 ? (discretionaryExpenseTotal / total) * 100 : 0;

    // Determine risk (high fixed percentage = less flexibility)
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (fixedPercentage > 80) risk = 'high';
    else if (fixedPercentage > 60) risk = 'medium';

    const classification: ClassificationSummary = {
      fixed: {
        count: fixedExpenseCount,
        total: Math.round(fixedExpenseTotal * 100) / 100,
        percentage: Math.round(fixedPercentage * 100) / 100,
      },
      discretionary: {
        count: discretionaryExpenseCount,
        total: Math.round(discretionaryExpenseTotal * 100) / 100,
        percentage: Math.round(discretionaryPercentage * 100) / 100,
      },
    };

    return {
      metric: 'expense_classification',
      value: classification,
      risk,
      explanation: `Expenses classified as ${fixedPercentage.toFixed(1)}% fixed ($${fixedExpenseTotal.toFixed(2)}/month) and ${discretionaryPercentage.toFixed(1)}% discretionary ($${discretionaryExpenseTotal.toFixed(2)}/month)`,
      inputs: {
        expense_count: expenses?.length || 0,
        transaction_count: transactions?.length || 0,
        total_monthly: total,
      },
      classification,
    };
  } catch (error) {
    throw new Error(`Failed to classify expenses: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      return amount * 4.33;
    case 'biweekly':
      return amount * 2.17;
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    case 'one-time':
      return 0;
    default:
      return amount;
  }
}
