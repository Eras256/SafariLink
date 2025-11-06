import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { OptionalAuthRequest } from '../middleware/optionalAuth.middleware';
import { GamificationService } from '../services/gamification.service';

const gamificationService = new GamificationService();

export const gamificationController = {
  /**
   * Get user's badges for a hackathon
   */
  async getUserBadges(req: OptionalAuthRequest, res: Response) {
    try {
      const { hackathonId } = req.params;
      const userId = req.userId || (req.headers['x-user-id'] as string);

      if (!userId) {
        // Return empty badges if no user ID
        const allBadges = await prisma.badge.findMany({
          where: {
            hackathonId,
            isActive: true,
          },
          orderBy: { createdAt: 'asc' },
        });

        const badges = allBadges.map((badge) => ({
          ...badge,
          earned: false,
          earnedAt: null,
          nftTokenId: null,
        }));

        return res.json({ badges });
      }

      const userBadges = await prisma.userBadge.findMany({
        where: {
          userId,
          hackathonId,
        },
        include: {
          badge: true,
        },
        orderBy: { earnedAt: 'desc' },
      });

      // Get all available badges
      const allBadges = await prisma.badge.findMany({
        where: {
          hackathonId,
          isActive: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

      const badges = allBadges.map((badge) => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id),
        earnedAt: userBadges.find((ub) => ub.badgeId === badge.id)?.earnedAt || null,
        nftTokenId: userBadges.find((ub) => ub.badgeId === badge.id)?.nftTokenId || null,
      }));

      res.json({ badges });
    } catch (error: any) {
      console.error('Error fetching user badges:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch badges' });
    }
  },

  /**
   * Get leaderboard for a hackathon
   */
  async getLeaderboard(req: OptionalAuthRequest, res: Response) {
    try {
      const { hackathonId } = req.params;
      const { limit = 100, offset = 0 } = req.query;

      const result = await gamificationService.getLeaderboard(
        hackathonId,
        Number(limit),
        Number(offset)
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch leaderboard' });
    }
  },

  /**
   * Get user's rank in leaderboard
   */
  async getUserRank(req: OptionalAuthRequest, res: Response) {
    try {
      const { hackathonId } = req.params;
      const userId = req.userId || (req.headers['x-user-id'] as string);

      if (!userId) {
        return res.json({ rank: null });
      }

      const rank = await gamificationService.getUserRank(userId, hackathonId);

      if (!rank) {
        // User not in leaderboard yet, calculate and add
        await gamificationService.updateLeaderboard(userId, hackathonId);
        const newRank = await gamificationService.getUserRank(userId, hackathonId);
        return res.json({ rank: newRank });
      }

      res.json({ rank });
    } catch (error: any) {
      console.error('Error fetching user rank:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch user rank' });
    }
  },

  /**
   * Get daily challenges
   */
  async getDailyChallenges(req: OptionalAuthRequest, res: Response) {
    try {
      const { hackathonId } = req.params;
      const userId = req.userId || (req.headers['x-user-id'] as string);

      const challenges = await gamificationService.getDailyChallenges(hackathonId, userId || undefined);

      res.json({ challenges });
    } catch (error: any) {
      console.error('Error fetching daily challenges:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch challenges' });
    }
  },

  /**
   * Complete a challenge
   */
  async completeChallenge(req: AuthRequest, res: Response) {
    try {
      const { hackathonId, challengeId } = req.params;
      const userId = req.userId!;

      const userChallenge = await gamificationService.completeChallenge(
        userId,
        challengeId,
        hackathonId
      );

      res.json({ userChallenge });
    } catch (error: any) {
      console.error('Error completing challenge:', error);
      res.status(500).json({ error: error.message || 'Failed to complete challenge' });
    }
  },

  /**
   * Get user's gamification stats
   */
  async getUserStats(req: OptionalAuthRequest, res: Response) {
    try {
      const { hackathonId } = req.params;
      const userId = req.userId || (req.headers['x-user-id'] as string);

      if (!userId) {
        return res.json({
          score: 0,
          rank: null,
          badgeCount: 0,
          projectCount: 0,
          challengeCount: 0,
          totalScore: 0,
        });
      }

      const score = await gamificationService.calculateUserScore(userId, hackathonId);
      const rank = await gamificationService.getUserRank(userId, hackathonId);

      const [badgeCount, projectCount, challengeCount] = await Promise.all([
        prisma.userBadge.count({
          where: { userId, hackathonId },
        }),
        prisma.project.count({
          where: {
            creatorId: userId,
            hackathonId,
            status: { in: ['SUBMITTED', 'APPROVED', 'WINNER'] },
          },
        }),
        prisma.userChallenge.count({
          where: { userId, hackathonId },
        }),
      ]);

      res.json({
        score,
        rank: rank?.rank || null,
        badgeCount,
        projectCount,
        challengeCount,
        totalScore: rank?.totalScore || score,
      });
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch user stats' });
    }
  },

  /**
   * Trigger badge check (usually called after user actions)
   */
  async checkBadges(req: AuthRequest, res: Response) {
    try {
      const { hackathonId } = req.params;
      const userId = req.userId!;

      const awardedBadges = await gamificationService.checkAndAwardBadges(userId, hackathonId);

      res.json({ awardedBadges, count: awardedBadges.length });
    } catch (error: any) {
      console.error('Error checking badges:', error);
      res.status(500).json({ error: error.message || 'Failed to check badges' });
    }
  },
};

