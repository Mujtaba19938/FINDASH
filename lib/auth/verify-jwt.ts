// Firebase JWT Verification Helper
// This is a stub implementation that assumes the frontend sends a verified user ID
// In production, you would verify the Firebase JWT token server-side

/**
 * Verify Firebase JWT token and extract user ID
 * 
 * NOTE: This is a stub implementation. In production, you should:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Initialize Firebase Admin SDK with service account
 * 3. Verify the JWT token using admin.auth().verifyIdToken()
 * 
 * For now, this assumes the frontend has already verified the token
 * and sends the user_id directly in the request headers or body
 */

export interface VerifiedUser {
  userId: string;
  email?: string;
}

/**
 * Extract user ID from request
 * Assumes the frontend sends the Firebase user ID in the Authorization header
 * or in the request body
 * 
 * In production, implement proper JWT verification here
 */
export async function verifyJWT(token?: string): Promise<VerifiedUser> {
  // Stub implementation - assumes token contains user ID or is passed directly
  // TODO: Implement actual Firebase JWT verification using firebase-admin
  
  if (!token) {
    throw new Error('No authentication token provided');
  }

  // For now, assume the token is the user ID or extract it from a verified token
  // In production, you would:
  // const admin = require('firebase-admin');
  // const decodedToken = await admin.auth().verifyIdToken(token);
  // return { userId: decodedToken.uid, email: decodedToken.email };

  // Stub: treat token as user ID (remove this in production)
  return {
    userId: token,
  };
}

/**
 * Extract user ID from request headers
 * Looks for Authorization header or X-User-Id header
 */
export function extractUserIdFromRequest(headers: Record<string, string | undefined>): string {
  const authHeader = headers['authorization'];
  const userIdHeader = headers['x-user-id'];

  if (userIdHeader) {
    return userIdHeader;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // In production, verify the token here
    return token; // Stub: return token as-is
  }

  throw new Error('No user ID found in request headers');
}
