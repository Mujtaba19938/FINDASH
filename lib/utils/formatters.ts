// Formatters
// Convert raw metrics to FinancialSummary format for LLM consumption

import type { FinancialSummary, MetricResult } from '../types/finance';
import { getBurnRate } from '../analytics/burn-rate';
import { getSavingsRate } from '../analytics/savings-rate';
import { getRunway } from '../analytics/runway';
import { calculateRiskScore } from '../analytics/risk-score';
import { getPaymentPriority } from '../analytics/payment-priority';
import { getCashflowForecast } from '../analytics/cashflow-forecast';
import { detectSpendingAnomalies } from '../analytics/anomalies';
import { supabase } from '../supabase/client';

/**
 * Generate comprehensive FinancialSummary for LLM consumption
 */
export async function generateFinancialSummary(userId: string): Promise<FinancialSummary> {
  try {
    // Get core metrics
    const burnRateResult = await getBurnRate(userId);
    const savingsRateResult = await getSavingsRate(userId);
    const runwayResult = await getRunway(userId);
    const riskScoreResult = await calculateRiskScore(userId);

    // Get current balance
    const currentBalance = typeof runwayResult.inputs.balance === 'number'
      ? runwayResult.inputs.balance
      : 0;

    // Get monthly income
    const { data: incomes } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId);

    let monthlyIncome = 0;
    (incomes || []).forEach(income => {
      monthlyIncome += convertToMonthly(income.amount, income.frequency);
    });

    const monthlyBurnRate = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;
    const runway = typeof runwayResult.value === 'string' ? runwayResult.value : 'N/A';
    const riskLevel = riskScoreResult.risk_score || riskScoreResult.risk;

    // Get additional insights
    const paymentPriorityResult = await getPaymentPriority(userId);
    const forecastResult = await getCashflowForecast(userId, 6);
    const anomaliesResult = await detectSpendingAnomalies(userId);

    // Build insights array
    const insights = [
      {
        metric: 'burn_rate',
        value: monthlyBurnRate,
        risk: burnRateResult.risk,
        explanation: burnRateResult.explanation,
      },
      {
        metric: 'savings_rate',
        value: savingsRateResult.value,
        risk: savingsRateResult.risk,
        explanation: savingsRateResult.explanation,
      },
      {
        metric: 'runway',
        value: runway,
        risk: runwayResult.risk,
        explanation: runwayResult.explanation,
      },
      {
        metric: 'payment_priority',
        value: paymentPriorityResult.value,
        risk: paymentPriorityResult.risk,
        explanation: paymentPriorityResult.explanation,
      },
    ];

    // Build simulations array (empty for now, can be populated from user queries)
    const simulations: any[] = [];

    // Build anomalies array
    const anomalies = Array.isArray(anomaliesResult.anomalies) ? anomaliesResult.anomalies : [];

    // Build recommendations (heuristic-based)
    const recommendations = generateRecommendations(
      monthlyBurnRate,
      runwayResult,
      paymentPriorityResult,
      riskLevel
    );

    return {
      financial_state: {
        balance: currentBalance,
        income: monthlyIncome,
        burn_rate: monthlyBurnRate,
        runway,
        risk_level: riskLevel,
      },
      insights,
      simulations,
      anomalies,
      recommendations,
    };
  } catch (error) {
    throw new Error(`Failed to generate financial summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate heuristic-based recommendations
 */
function generateRecommendations(
  burnRate: number,
  runwayResult: MetricResult,
  paymentResult: MetricResult & { payments?: any[] },
  riskLevel: string
): string[] {
  const recommendations: string[] = [];

  const runwayDays = typeof runwayResult.inputs.runway_days === 'number'
    ? runwayResult.inputs.runway_days
    : Infinity;

  if (runwayDays < 30) {
    recommendations.push('CRITICAL: Very low runway. Consider reducing expenses immediately or increasing income.');
  } else if (runwayDays < 90) {
    recommendations.push('Monitor cashflow closely. Consider building emergency fund.');
  }

  if (riskLevel === 'high' || riskLevel === 'critical') {
    recommendations.push('High financial risk detected. Review spending patterns and consider financial planning.');
  }

  if (Array.isArray(paymentResult.payments) && paymentResult.payments.length > 5) {
    recommendations.push('Multiple upcoming payments. Consider prioritizing high-interest debt and critical bills.');
  }

  if (burnRate > 10000) {
    recommendations.push('High monthly burn rate. Review recurring expenses and subscriptions.');
  }

  return recommendations;
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
