// Risk Score Analytics
// Calculates risk level based on runway, obligations, burn rate, income stability

import type { MetricResult, RiskLevel } from '../types/finance';
import { getRunway } from './runway';
import { getBurnRate } from './burn-rate';
import { getPaymentPriority } from './payment-priority';
import { supabase } from '../supabase/client';
import type { Income } from '../types/finance';

/**
 * Calculate overall financial risk score
 * risk_score = f(runway, obligations, burn_rate, income_stability)
 */
export async function calculateRiskScore(userId: string): Promise<MetricResult & { risk_score: RiskLevel }> {
  try {
    // Get runway
    const runwayResult = await getRunway(userId);
    const runwayDays = typeof runwayResult.inputs.runway_days === 'number'
      ? runwayResult.inputs.runway_days
      : Infinity;

    // Get burn rate
    const burnRateResult = await getBurnRate(userId);
    const monthlyBurnRate = typeof burnRateResult.value === 'number' ? burnRateResult.value : 0;

    // Get payment priority (obligations)
    const paymentResult = await getPaymentPriority(userId);
    const upcomingPaymentsTotal = typeof paymentResult.inputs.total_amount === 'number'
      ? paymentResult.inputs.total_amount
      : 0;

    // Calculate income stability (variance in income sources)
    const { data: incomes, error: incomesError } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', userId);

    if (incomesError) {
      throw new Error(`Failed to fetch incomes: ${incomesError.message}`);
    }

    const incomeCount = incomes?.length || 0;
    const incomeStability = incomeCount > 1 ? 1.0 : 0.5; // Multiple sources = more stable

    // Get current balance
    const currentBalance = typeof runwayResult.inputs.balance === 'number'
      ? runwayResult.inputs.balance
      : 0;

    // Calculate risk factors (0-1 scale, higher = more risky)
    let riskScore = 0;

    // Runway risk (0-0.4 weight)
    if (runwayDays < 30) riskScore += 0.4;
    else if (runwayDays < 60) riskScore += 0.3;
    else if (runwayDays < 90) riskScore += 0.2;
    else if (runwayDays < 180) riskScore += 0.1;

    // Obligations risk (0-0.2 weight)
    const obligationsRatio = monthlyBurnRate > 0 ? upcomingPaymentsTotal / monthlyBurnRate : 0;
    if (obligationsRatio > 1.5) riskScore += 0.2;
    else if (obligationsRatio > 1.0) riskScore += 0.15;
    else if (obligationsRatio > 0.5) riskScore += 0.1;

    // Burn rate risk (0-0.2 weight)
    if (monthlyBurnRate > 10000) riskScore += 0.2;
    else if (monthlyBurnRate > 5000) riskScore += 0.15;
    else if (monthlyBurnRate > 2000) riskScore += 0.1;

    // Income stability risk (0-0.2 weight)
    riskScore += (1 - incomeStability) * 0.2;

    // Negative balance check (critical)
    if (currentBalance < 0) {
      riskScore = 1.0;
    }

    // Normalize to 0-1 and determine risk level
    const normalizedRisk = Math.min(1.0, riskScore);

    let riskLevel: RiskLevel = 'low';
    if (normalizedRisk >= 0.75) riskLevel = 'critical';
    else if (normalizedRisk >= 0.5) riskLevel = 'high';
    else if (normalizedRisk >= 0.25) riskLevel = 'medium';

    const explanation = buildRiskExplanation(
      riskLevel,
      runwayDays,
      monthlyBurnRate,
      upcomingPaymentsTotal,
      incomeCount,
      currentBalance
    );

    return {
      metric: 'risk_score',
      value: Math.round(normalizedRisk * 100),
      risk: riskLevel,
      explanation,
      inputs: {
        runway_days: runwayDays,
        monthly_burn_rate: monthlyBurnRate,
        upcoming_payments_total: upcomingPaymentsTotal,
        income_source_count: incomeCount,
        income_stability: incomeStability,
        current_balance: currentBalance,
        risk_score: normalizedRisk,
      },
      risk_score: riskLevel,
    };
  } catch (error) {
    throw new Error(`Failed to calculate risk score: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build human-readable risk explanation
 */
function buildRiskExplanation(
  riskLevel: RiskLevel,
  runwayDays: number,
  monthlyBurnRate: number,
  upcomingPaymentsTotal: number,
  incomeCount: number,
  currentBalance: number
): string {
  const factors: string[] = [];

  if (currentBalance < 0) {
    factors.push('negative balance');
  }

  if (runwayDays < 30) {
    factors.push(`very short runway (${Math.round(runwayDays)} days)`);
  } else if (runwayDays < 90) {
    factors.push(`short runway (${Math.round(runwayDays)} days)`);
  }

  if (upcomingPaymentsTotal > monthlyBurnRate * 1.5) {
    factors.push('high upcoming payment obligations');
  }

  if (incomeCount <= 1) {
    factors.push('single income source (low stability)');
  }

  if (monthlyBurnRate > 10000) {
    factors.push('high monthly burn rate');
  }

  const factorsText = factors.length > 0 
    ? ` Risk factors: ${factors.join(', ')}.`
    : '';

  return `Overall financial risk is ${riskLevel}.${factorsText}`;
}
