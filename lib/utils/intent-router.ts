// Intent Router
// Rule-based intent detection and routing to appropriate analytics functions

import type { IntentRouterRequest, IntentRouterResponse } from '../types/finance';
import { getBurnRate } from '../analytics/burn-rate';
import { getSavingsRate } from '../analytics/savings-rate';
import { getRunway } from '../analytics/runway';
import { getPaymentPriority } from '../analytics/payment-priority';
import { getCashflowForecast } from '../analytics/cashflow-forecast';
import { detectSpendingAnomalies } from '../analytics/anomalies';
import { simulatePurchase } from '../analytics/simulations';
import { simulateIncomeChange } from '../analytics/simulations';
import { simulateExpenseChange } from '../analytics/simulations';
import { calculateRiskScore } from '../analytics/risk-score';

/**
 * Detect intent from user query using rule-based pattern matching
 */
export function detectIntent(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Advisory intent - general questions about financial state
  if (
    lowerQuery.includes('how am i doing') ||
    lowerQuery.includes('financial health') ||
    lowerQuery.includes('overall') ||
    lowerQuery.includes('summary') ||
    lowerQuery.includes('status') ||
    lowerQuery.includes('advisory')
  ) {
    return 'advisory';
  }

  // Forecasting intent
  if (
    lowerQuery.includes('forecast') ||
    lowerQuery.includes('projection') ||
    lowerQuery.includes('future') ||
    lowerQuery.includes('months ahead') ||
    lowerQuery.includes('cashflow')
  ) {
    return 'forecasting';
  }

  // Simulation intent
  if (
    lowerQuery.includes('what if') ||
    lowerQuery.includes('simulate') ||
    lowerQuery.includes('purchase') ||
    lowerQuery.includes('buy') ||
    lowerQuery.includes('if i spend') ||
    lowerQuery.includes('if i earn') ||
    lowerQuery.includes('if income') ||
    lowerQuery.includes('if expense')
  ) {
    return 'simulation';
  }

  // Anomaly intent
  if (
    lowerQuery.includes('anomaly') ||
    lowerQuery.includes('unusual') ||
    lowerQuery.includes('spike') ||
    lowerQuery.includes('outlier') ||
    lowerQuery.includes('strange')
  ) {
    return 'anomaly';
  }

  // Planning intent
  if (
    lowerQuery.includes('priority') ||
    lowerQuery.includes('pay') ||
    lowerQuery.includes('planning') ||
    lowerQuery.includes('should i pay') ||
    lowerQuery.includes('upcoming payments')
  ) {
    return 'planning';
  }

  // Default to advisory
  return 'advisory';
}

/**
 * Route user query to appropriate analytics functions
 */
export async function routeIntent(request: IntentRouterRequest): Promise<IntentRouterResponse> {
  const { query, userId } = request;
  const intent = detectIntent(query);
  const calledFunctions: string[] = [];
  const results: Record<string, any> = {};

  try {
    switch (intent) {
      case 'advisory': {
        // Return general financial state
        calledFunctions.push('getBurnRate', 'getSavingsRate', 'getRunway', 'calculateRiskScore');
        results.burn_rate = await getBurnRate(userId);
        results.savings_rate = await getSavingsRate(userId);
        results.runway = await getRunway(userId);
        results.risk_score = await calculateRiskScore(userId);
        break;
      }

      case 'forecasting': {
        // Extract number of months if mentioned
        const monthsMatch = query.match(/(\d+)\s*months?/i);
        const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 6;

        calledFunctions.push('getCashflowForecast', 'getRunway');
        results.forecast = await getCashflowForecast(userId, months);
        results.runway = await getRunway(userId);
        break;
      }

      case 'simulation': {
        // Detect simulation type
        const lowerQuery = query.toLowerCase();
        const amountMatch = query.match(/\$?(\d+(?:\.\d{2})?)/);
        const percentMatch = query.match(/(\d+)\s*%/);

        if (lowerQuery.includes('purchase') || lowerQuery.includes('buy') || lowerQuery.includes('spend')) {
          const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
          if (amount > 0) {
            calledFunctions.push('simulatePurchase');
            results.purchase_simulation = await simulatePurchase(userId, amount);
          }
        } else if (lowerQuery.includes('income')) {
          const percent = percentMatch ? parseFloat(percentMatch[1]) : 0;
          if (percent !== 0) {
            calledFunctions.push('simulateIncomeChange');
            results.income_simulation = await simulateIncomeChange(userId, percent);
          }
        } else if (lowerQuery.includes('expense')) {
          const percent = percentMatch ? parseFloat(percentMatch[1]) : 0;
          if (percent !== 0) {
            calledFunctions.push('simulateExpenseChange');
            results.expense_simulation = await simulateExpenseChange(userId, percent);
          }
        }
        break;
      }

      case 'anomaly': {
        calledFunctions.push('detectSpendingAnomalies');
        results.anomalies = await detectSpendingAnomalies(userId);
        break;
      }

      case 'planning': {
        calledFunctions.push('getPaymentPriority', 'getRunway', 'getCashflowForecast');
        results.payment_priority = await getPaymentPriority(userId);
        results.runway = await getRunway(userId);
        results.forecast = await getCashflowForecast(userId, 3);
        break;
      }

      default: {
        // Fallback to advisory
        calledFunctions.push('getBurnRate', 'getRunway');
        results.burn_rate = await getBurnRate(userId);
        results.runway = await getRunway(userId);
        break;
      }
    }

    return {
      intent,
      called_functions: calledFunctions,
      aggregated_results: results,
    };
  } catch (error) {
    throw new Error(`Failed to route intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
