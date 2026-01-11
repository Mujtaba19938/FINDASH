// Simulate Expense Change API Route - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractUserIdFromRequest } from '../../lib/auth/verify-jwt';
import { simulateExpenseChange } from '../../lib/analytics/simulations';
import { validateUserId, validatePercent } from '../../lib/utils/validators';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const headers = req.headers as Record<string, string | undefined>;
    const userId = validateUserId(extractUserIdFromRequest(headers));

    const body = req.body as { percent?: number | string };
    const percent = validatePercent(body?.percent);

    const result = await simulateExpenseChange(userId, percent);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to simulate expense change',
    });
  }
}
