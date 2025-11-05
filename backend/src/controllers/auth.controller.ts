import { Request, Response } from 'express';
import { verifyMessage } from 'viem';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { redis } from '../config/redis';

export const authController = {
  async getNonce(req: Request, res: Response) {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }

    const nonce = Math.random().toString(36).substring(2, 15);
    await redis.setEx(`nonce:${address.toLowerCase()}`, 300, nonce); // 5 min expiry

    res.json({ nonce });
  },

  async verifySignature(req: Request, res: Response) {
    const { address, signature } = req.body;

    const nonce = await redis.get(`nonce:${address.toLowerCase()}`);
    if (!nonce) {
      return res.status(400).json({ error: 'Nonce expired' });
    }

    const message = `Sign this message to authenticate: ${nonce}`;

    try {
      const valid = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });

      if (!valid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      await redis.del(`nonce:${address.toLowerCase()}`);

      // Get or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress: address.toLowerCase() },
      });

      if (!user) {
        user = await prisma.user.create({
          data: { walletAddress: address.toLowerCase() },
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const accessToken = jwt.sign(
        { userId: user.id, address: user.walletAddress },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({ accessToken, user });
    } catch (error: any) {
      console.error('Verification error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  },

  async refreshToken(req: Request, res: Response) {
    // Implementation for token refresh
    res.json({ message: 'Token refresh not implemented yet' });
  },

  async logout(req: Request, res: Response) {
    // Invalidate token if needed
    res.json({ message: 'Logged out successfully' });
  },

  async getMe(req: any, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          walletAddress: true,
          ens: true,
          email: true,
          username: true,
          bio: true,
          avatar: true,
          builderScore: true,
          humanPassportScore: true,
          worldIdVerified: true,
          kycStatus: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },
};

