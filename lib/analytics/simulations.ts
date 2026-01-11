// Simulation Analytics
// What-if scenarios for purchases, income changes, expense changes

import type { MetricResult } from '../types/finance';
import { getRunway } from './runway';
import { getBurnRate } from './burn-rate';
import { getCashflowForecast } from './cashflow-forecast';
import { supabase } from '../supabase/client';
import type { Income, Expense } from '../types/finance';

/**
 * Simulate impact of a purchase on runway
 */
export async function simulatePurchase(userId: string, amount: number): Promise<MetricResult> {
  try {
    if (amount <= 0) {
      throw new Error('Purchase amount must be positive');
    }

    // Get current runway
    const currentRunwayResult = await getRunway(userId);
    const currentBalance = typeof currentRunwayResult.inputs.balance === 'number' 
      ? currentRunwayResult.inputs.balance 
      : 0;

    // Get current burn rate
    const burnRateResult = await getBurnRate(userId);
    const monthlyBurnRate = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;
    const dailyBurnRate = monthlyBurnRate / 30;

    // Calculate new balance after purchase
    const newBalance = currentBalance - amount;

    // Calculate new runway
    const newRunwayDays = dailyBurnRate > 0 ? newBalance / dailyBurnRate : Infinity;
    const currentRunwayDays = typeof currentRunwayResult.inputs.runway_days === 'number'
      ? currentRunwayResult.inputs.runway_days
      : Infinity;

    const runwayReduction = currentRunwayDays - newRunwayDays;
    const runwayReductionPercent = currentRunwayDays > 0 
      ? (runwayReduction / currentRunwayDays) * 100 
      : 0;

    // Determine risk
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (newBalance < 0) risk = 'critical';
    else if (runwayReductionPercent > 20) risk = 'high';
    else if (runwayReductionPercent > 10) risk = 'medium';

    return {
      metric: 'purchase_simulation',
      value: {
        purchase_amount: amount,
        new_balance: Math.round(newBalance * 100) / 100,
        new_runway_days: Math.round(newRunwayDays * 100) / 100,
        runway_reduction_days: Math.round(runwayReduction * 100) / 100,
        runway_reduction_percent: Math.round(runwayReductionPercent * 100) / 100,
      },
      risk,
      explanation: `Purchase of $${amount.toFixed(2)} would reduce runway by ${Math.round(runwayReduction)} days (${runwayReductionPercent.toFixed(1)}%), resulting in ${Math.round(newRunwayDays)} days remaining`,
      inputs: {
        current_balance: currentBalance,
        current_runway_days: currentRunwayDays,
        monthly_burn_rate: monthlyBurnRate,
        purchase_amount: amount,
      },
    };
  } catch (error) {
    throw new Error(`Failed to simulate purchase: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Simulate impact of income change (percentage)
 */
export async function simulateIncomeChange(userId: string, percent: number): Promise<MetricResult> {
  try {
    if (percent < -100) {
      throw new Error('Income change cannot be less than -100%');
    }

    // Get current income and burn rate
    const { data: incomes, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch incomes: ${error.message}`);
    }

    let currentMonthlyIncome = 0;
    (incomes || []).forEach((income: Income) => {
      currentMonthlyIncome += convertToMonthly(income.amount, income.frequency);
    });

    const burnRateResult = await getBurnRate(userId);
    const monthlyBurnRate = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;

    // Calculate new income
    const newMonthlyIncome = currentMonthlyIncome * (1 + percent / 100);
    const newNetCashflow = newMonthlyIncome - monthlyBurnRate;

    // Get current balance
    const runwayResult = await getRunway(userId);
    const currentBalance = typeof runwayResult.inputs.balance === 'number'
      ? runwayResult.inputs.balance
      : 0;

    // Calculate new runway
    const dailyBurnRate = monthlyBurnRate / 30;
    const dailyNetCashflow = newNetCashflow / 30;
    
    let newRunwayDays = Infinity;
    if (dailyNetCashflow < 0) {
      // Still burning money, calculate runway
      newRunwayDays = currentBalance / Math.abs(dailyNetCashflow);
    } else if (dailyNetCashflow > 0) {
      // Positive cashflow, runway is infinite
      newRunwayDays = Infinity;
    }

    // Determine risk
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (newNetCashflow < 0 && newRunwayDays < 30) risk = 'critical';
    else if (newNetCashflow < 0 && newRunwayDays < 60) risk = 'high';
    else if (newNetCashflow < 0) risk = 'medium';

    return {
      metric: 'income_change_simulation',
      value: {
        percent_change: percent,
        new_monthly_income: Math.round(newMonthlyIncome * 100) / 100,
        new_net_cashflow: Math.round(newNetCashflow * 100) / 100,
        new_runway_days: newRunwayDays === Infinity ? 'Infinite' : Math.round(newRunwayDays * 100) / 100,
      },
      risk,
      explanation: `Income ${percent >= 0 ? 'increase' : 'decrease'} of ${Math.abs(percent)}% would result in ${newNetCashflow >= 0 ? 'positive' : 'negative'} cashflow of $${Math.abs(newNetCashflow).toFixed(2)}/month`,
      inputs: {
        current_monthly_income: currentMonthlyIncome,
        percent_change: percent,
        monthly_burn_rate: monthlyBurnRate,
        current_balance: currentBalance,
      },
    };
  } catch (error) {
    throw new Error(`Failed to simulate income change: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Simulate impact of expense change (percentage)
 */
export async function simulateExpenseChange(userId: string, percent: number): Promise<MetricResult> {
  try {
    if (percent < -100) {
      throw new Error('Expense change cannot be less than -100%');
    }

    // Get current burn rate
    const burnRateResult = await getBurnRate(userId);
    const currentMonthlyBurnRate = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;

    // Get current income
    const { data: incomes, error: incomesError } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId);

    if (incomesError) {
      throw new Error(`Failed to fetch incomes: ${incomesError.message}`);
    }

    let monthlyIncome = 0;
    (incomes || []).forEach((income: Income) => {
      monthlyIncome += convertToMonthly(income.amount, income.frequency);
    });

    // Calculate new burn rate
    const newMonthlyBurnRate = currentMonthlyBurnRate * (1 + percent / 100);
    const newNetCashflow = monthlyIncome - newMonthlyBurnRate;

    // Get current balance
    const runwayResult = await getRunway(userId);
    const currentBalance = typeof runwayResult.inputs.balance === 'number'
      ? runwayResult.inputs.balance
      : 0;

    // Calculate new runway
    const dailyBurnRate = newMonthlyBurnRate / 30;
    const dailyNetCashflow = newNetCashflow / 30;

    let newRunwayDays = Infinity;
    if (dailyNetCashflow < 0) {
      newRunwayDays = currentBalance / Math.abs(dailyNetCashflow);
    } else if (dailyNetCashflow > 0) {
      newRunwayDays = Infinity;
    }

    // Determine risk
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (newNetCashflow < 0 && newRunwayDays < 30) risk = 'critical';
    else if (newNetCashflow < 0 && newRunwayDays < 60) risk = 'high';
    else if (newNetCashflow < 0) risk = 'medium';

    return {
      metric: 'expense_change_simulation',
      value: {
        percent_change: percent,
        new_monthly_burn_rate: Math.round(newMonthlyBurnRate * 100) / 100,
        new_net_cashflow: Math.round(newNetCashflow * 100) / 100,
        new_runway_days: newRunwayDays === Infinity ? 'Infinite' : Math.round(newRunwayDays * 100) / 100,
      },
      risk,
      explanation: `Expense ${percent >= 0 ? 'increase' : 'decrease'} of ${Math.abs(percent)}% would result in ${newNetCashflow >= 0 ? 'positive' : 'negative'} cashflow of $${Math.abs(newNetCashflow).toFixed(2)}/month`,
      inputs: {
        current_monthly_burn_rate: currentMonthlyBurnRate,
        percent_change: percent,
        monthly_income: monthlyIncome,
        current_balance: currentBalance,
      },
    };
  } catch (error) {
    throw new Error(`Failed to simulate expense change: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      return 0;
    default:
      return amount;
  }
}
