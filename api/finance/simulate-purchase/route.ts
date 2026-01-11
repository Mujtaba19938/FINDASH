// Simulate Purchase API Route - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractUserIdFromRequest } from '../../lib/auth/verify-jwt';
import { simulatePurchase } from '../../lib/analytics/simulations';
import { validateUserId, validateAmount } from '../../lib/utils/validators';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const headers = req.headers as Record<string, string | undefined>;
    const userId = validateUserId(extractUserIdFromRequest(headers));

    const body = req.body as { amount?: number | string };
    const amount = validateAmount(body?.amount);

    const result = await simulatePurchase(userId, amount);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to simulate purchase',
    });
  }
}
