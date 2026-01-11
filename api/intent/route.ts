// Intent Router API Route - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractUserIdFromRequest } from '@/lib/auth/verify-jwt';
import { routeIntent } from '@/lib/utils/intent-router';
import { validateUserId } from '@/lib/utils/validators';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const headers = req.headers as Record<string, string | undefined>;
    const userId = validateUserId(extractUserIdFromRequest(headers));

    const body = req.body as { query?: string };
    const query = typeof body?.query === 'string' ? body.query.trim() : '';

    if (!query || query.length === 0) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await routeIntent({ query, userId });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to route intent',
    });
  }
}
