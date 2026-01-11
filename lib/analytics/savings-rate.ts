// Savings Rate Analytics
// Calculates (income - outcome) / income

import { supabase } from '../supabase/client';
import type { MetricResult, Income, Expense, Transaction } from '../types/finance';
import { getBurnRate } from './burn-rate';

/**
 * Calculate savings rate for a user
 * Formula: (income - outcome) / income * 100
 */
export async function getSavingsRate(userId: string): Promise<MetricResult> {
  try {
    // Get all incomes
    const { data: incomes, error: incomesError } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId);

    if (incomesError) {
      throw new Error(`Failed to fetch incomes: ${incomesError.message}`);
    }

    // Calculate monthly income total
    let monthlyIncomeTotal = 0;
    (incomes || []).forEach((income: Income) => {
      const monthlyAmount = convertToMonthly(income.amount, income.frequency);
      monthlyIncomeTotal += monthlyAmount;
    });

    // Get burn rate (monthly outcome)
    const burnRateResult = await getBurnRate(userId);
    const monthlyOutcome = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;

    if (monthlyIncomeTotal === 0) {
      return {
        metric: 'savings_rate',
        value: 0,
        risk: 'critical',
        explanation: 'No income data found. Cannot calculate savings rate.',
        inputs: {
          monthly_income: 0,
          monthly_outcome: monthlyOutcome,
        },
      };
    }

    const savings = monthlyIncomeTotal - monthlyOutcome;
    const savingsRate = (savings / monthlyIncomeTotal) * 100;

    // Determine risk level
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (savingsRate < 0) risk = 'critical';
    else if (savingsRate < 10) risk = 'high';
    else if (savingsRate < 20) risk = 'medium';

    return {
      metric: 'savings_rate',
      value: Math.round(savingsRate * 100) / 100,
      risk,
      explanation: `Savings rate is ${savingsRate.toFixed(2)}% (saving $${savings.toFixed(2)}/month from $${monthlyIncomeTotal.toFixed(2)}/month income)`,
      inputs: {
        monthly_income: monthlyIncomeTotal,
        monthly_outcome: monthlyOutcome,
        monthly_savings: savings,
      },
    };
  } catch (error) {
    throw new Error(`Failed to calculate savings rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert amount to monthly based on frequency
 */
function convertToMonthly(amount: number, frequency: string): number {
  switch (frequency) {
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
      return 0; // One-time income doesn't contribute to monthly total
    default:
      return amount;
  }
}
