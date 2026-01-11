// Savings Rate API Route - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractUserIdFromRequest } from '../../lib/auth/verify-jwt';
import { getSavingsRate } from '../../lib/analytics/savings-rate';
import { validateUserId } from '../../lib/utils/validators';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const headers = req.headers as Record<string, string | undefined>;
    const userId = validateUserId(extractUserIdFromRequest(headers));

    const result = await getSavingsRate(userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to calculate savings rate',
    });
  }
}
