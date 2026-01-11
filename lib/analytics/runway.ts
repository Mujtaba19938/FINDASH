// Runway Analytics
// Calculates balance / burn_rate in days

import { supabase } from '../supabase/client';
import type { MetricResult, BalanceTimeseries } from '../types/finance';
import { getBurnRate } from './burn-rate';

/**
 * Calculate financial runway (how many days until balance reaches zero)
 * Formula: current_balance / daily_burn_rate
 */
export async function getRunway(userId: string): Promise<MetricResult> {
  try {
    // Get most recent balance
    const { data: balanceData, error: balanceError } = await supabase
      .from('balance_timeseries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (balanceError || !balanceData) {
      // If no balance data, try to calculate from transactions
      const currentBalance = await calculateBalanceFromTransactions(userId);
      if (currentBalance === null) {
        return {
          metric: 'runway',
          value: 'N/A',
          risk: 'critical',
          explanation: 'No balance data found. Cannot calculate runway.',
          inputs: {
            balance: 0,
            burn_rate: 0,
          },
        };
      }
      return await calculateRunwayWithBalance(userId, currentBalance);
    }

    const currentBalance = balanceData.balance;
    return await calculateRunwayWithBalance(userId, currentBalance);
  } catch (error) {
    throw new Error(`Failed to calculate runway: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate runway given a balance
 */
async function calculateRunwayWithBalance(userId: string, balance: number): Promise<MetricResult> {
  const burnRateResult = await getBurnRate(userId);
  const monthlyBurnRate = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;

  if (monthlyBurnRate === 0) {
    return {
      metric: 'runway',
      value: 'Infinite',
      risk: 'low',
      explanation: 'No expenses found. Runway is effectively infinite.',
      inputs: {
        balance,
        monthly_burn_rate: 0,
      },
    };
  }

  const dailyBurnRate = monthlyBurnRate / 30;
  const runwayDays = balance / dailyBurnRate;

  // Determine risk level
  let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (runwayDays < 30) risk = 'critical';
  else if (runwayDays < 60) risk = 'high';
  else if (runwayDays < 90) risk = 'medium';

  const runwayFormatted = runwayDays >= 365 
    ? `${Math.round(runwayDays / 30)} months`
    : `${Math.round(runwayDays)} days`;

  return {
    metric: 'runway',
    value: runwayFormatted,
    risk,
    explanation: `Current balance of $${balance.toFixed(2)} provides ${runwayFormatted} of runway at the current burn rate of $${monthlyBurnRate.toFixed(2)}/month ($${dailyBurnRate.toFixed(2)}/day)`,
    inputs: {
      balance,
      monthly_burn_rate: monthlyBurnRate,
      daily_burn_rate: dailyBurnRate,
      runway_days: runwayDays,
    },
  };
}

/**
 * Calculate current balance from transactions if no balance_timeseries data exists
 */
async function calculateBalanceFromTransactions(userId: string): Promise<number | null> {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .order('timestamp', { ascending: true });

  if (error || !transactions || transactions.length === 0) {
    return null;
  }

  // Sum all transactions (negative amounts are expenses, positive are income)
  const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
  return balance;
}
