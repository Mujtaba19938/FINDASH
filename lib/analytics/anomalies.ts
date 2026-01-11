// Anomaly Detection Analytics
// Detects spending spikes vs historical baseline

import { supabase } from '../supabase/client';
import type { MetricResult, Transaction } from '../types/finance';

interface Anomaly {
  category: string;
  vendor?: string;
  amount: number;
  baseline: number;
  deviation_percent: number;
  timestamp: string;
}

/**
 * Detect spending anomalies (spikes) compared to historical baseline
 */
export async function detectSpendingAnomalies(userId: string): Promise<MetricResult & { anomalies: Anomaly[] }> {
  try {
    // Get transactions from last 3 months (detection period)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const { data: recentTransactions, error: recentError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', threeMonthsAgo.toISOString())
      .lt('amount', 0); // Only expenses

    if (recentError) {
      throw new Error(`Failed to fetch recent transactions: ${recentError.message}`);
    }

    // Get historical baseline (6-12 months ago)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data: historicalTransactions, error: historicalError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', twelveMonthsAgo.toISOString())
      .lt('timestamp', sixMonthsAgo.toISOString())
      .lt('amount', 0);

    if (historicalError) {
      throw new Error(`Failed to fetch historical transactions: ${historicalError.message}`);
    }

    // Calculate baseline averages by category
    const baselineByCategory: Record<string, { total: number; count: number; avg: number }> = {};

    (historicalTransactions || []).forEach((t: Transaction) => {
      if (!baselineByCategory[t.category]) {
        baselineByCategory[t.category] = { total: 0, count: 0, avg: 0 };
      }
      baselineByCategory[t.category].total += Math.abs(t.amount);
      baselineByCategory[t.category].count += 1;
    });

    // Calculate averages
    Object.keys(baselineByCategory).forEach(category => {
      const data = baselineByCategory[category];
      data.avg = data.count > 0 ? data.total / data.count : 0;
    });

    // Detect anomalies (transactions that are > 2x the baseline average)
    const anomalies: Anomaly[] = [];
    const ANOMALY_THRESHOLD = 2.0; // 200% of baseline

    (recentTransactions || []).forEach((t: Transaction) => {
      const baseline = baselineByCategory[t.category]?.avg || 0;
      const amount = Math.abs(t.amount);

      if (baseline > 0 && amount > baseline * ANOMALY_THRESHOLD) {
        const deviationPercent = ((amount - baseline) / baseline) * 100;
        anomalies.push({
          category: t.category,
          vendor: t.vendor || undefined,
          amount,
          baseline,
          deviation_percent: Math.round(deviationPercent * 100) / 100,
          timestamp: t.timestamp,
        });
      }
    });

    // Sort by deviation (largest first)
    anomalies.sort((a, b) => b.deviation_percent - a.deviation_percent);

    // Determine risk
    const risk = anomalies.length > 10 ? 'high' : anomalies.length > 5 ? 'medium' : 'low';

    return {
      metric: 'spending_anomalies',
      value: anomalies.length,
      risk,
      explanation: `Detected ${anomalies.length} spending anomaly(ies) - transactions that exceed 200% of historical baseline average for their category`,
      inputs: {
        detection_period_months: 3,
        baseline_period_months: 6,
        anomaly_threshold: ANOMALY_THRESHOLD,
        categories_analyzed: Object.keys(baselineByCategory).length,
      },
      anomalies: anomalies.slice(0, 20), // Limit to top 20 anomalies
    };
  } catch (error) {
    throw new Error(`Failed to detect anomalies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
