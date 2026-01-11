// Cashflow Forecast Analytics
// Projects balance N months ahead based on historical trends

import { supabase } from '../supabase/client';
import type { MetricResult, Income, Expense, Transaction, BalanceTimeseries } from '../types/finance';

interface ForecastDataPoint {
  month: string;
  projected_balance: number;
  projected_income: number;
  projected_expenses: number;
}

/**
 * Generate cashflow forecast for N months ahead
 */
export async function getCashflowForecast(userId: string, months: number = 6): Promise<MetricResult & { forecast: ForecastDataPoint[] }> {
  try {
    if (months < 1 || months > 24) {
      throw new Error('Months must be between 1 and 24');
    }

    // Get current balance
    const { data: currentBalanceData, error: balanceError } = await supabase
      .from('balance_timeseries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    const currentBalance = currentBalanceData?.balance || 0;

    // Get average monthly income
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

    // Get average monthly expenses from transactions (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', sixMonthsAgo.toISOString());

    if (transactionsError) {
      throw new Error(`Failed to fetch transactions: ${transactionsError.message}`);
    }

    // Calculate average monthly expense from transactions
    let avgMonthlyExpense = 0;
    if (transactions && transactions.length > 0) {
      const expenseTransactions = transactions.filter(t => t.amount < 0);
      const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      avgMonthlyExpense = totalExpenses / 6;
    }

    // Get recurring expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId);

    if (expensesError) {
      throw new Error(`Failed to fetch expenses: ${expensesError.message}`);
    }

    let monthlyRecurringExpenses = 0;
    (expenses || []).forEach((expense: Expense) => {
      monthlyRecurringExpenses += convertToMonthly(expense.amount, expense.recurrence);
    });

    const totalMonthlyExpense = avgMonthlyExpense + monthlyRecurringExpenses;
    const netMonthlyCashflow = monthlyIncome - totalMonthlyExpense;

    // Generate forecast
    const forecast: ForecastDataPoint[] = [];
    let projectedBalance = currentBalance;
    const today = new Date();

    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(today);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      const monthName = forecastDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      projectedBalance += netMonthlyCashflow;

      forecast.push({
        month: monthName,
        projected_balance: Math.round(projectedBalance * 100) / 100,
        projected_income: monthlyIncome,
        projected_expenses: totalMonthlyExpense,
      });
    }

    // Determine risk based on forecast
    const finalBalance = forecast[forecast.length - 1].projected_balance;
    let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (finalBalance < 0) risk = 'critical';
    else if (finalBalance < 1000) risk = 'high';
    else if (finalBalance < 5000) risk = 'medium';

    return {
      metric: 'cashflow_forecast',
      value: months,
      risk,
      explanation: `Projected balance after ${months} months: $${finalBalance.toFixed(2)}. Based on monthly income of $${monthlyIncome.toFixed(2)} and expenses of $${totalMonthlyExpense.toFixed(2)} (net: $${netMonthlyCashflow.toFixed(2)}/month)`,
      inputs: {
        current_balance: currentBalance,
        monthly_income: monthlyIncome,
        monthly_expenses: totalMonthlyExpense,
        net_cashflow: netMonthlyCashflow,
        forecast_months: months,
      },
      forecast,
    };
  } catch (error) {
    throw new Error(`Failed to generate cashflow forecast: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert amount to monthly based on frequency/recurrence
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
