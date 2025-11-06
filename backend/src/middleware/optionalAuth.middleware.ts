import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface OptionalAuthRequest extends Request {
  userId?: string;
  walletAddress?: string;
}

/**
 * Optional authentication middleware
 * Tries to authenticate but doesn't fail if no token is provided
 * Useful for endpoints that can work with or without authentication
 */
export const optionalAuthMiddleware = async (
  req: OptionalAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string;
          address: string;
        };

        req.userId = decoded.userId;
        req.walletAddress = decoded.address;
      } catch (error) {
        // Invalid token, but continue without auth
        // Wallet address can be passed via query or header
      }
    }

    // Also check for wallet address in query or header
    const walletAddress = req.query.walletAddress as string || req.headers['x-wallet-address'] as string;
    if (walletAddress && !req.walletAddress) {
      req.walletAddress = walletAddress;
    }

    // Also check for user ID in header (for frontend compatibility)
    const headerUserId = req.headers['x-user-id'] as string;
    if (headerUserId && !req.userId) {
      req.userId = headerUserId;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

