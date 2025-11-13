import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { TalentProtocolService } from '../services/talentProtocol.service';

export const talentProtocolController = {
  /**
   * Sync user's Talent Protocol profile
   * POST /api/talent-protocol/sync
   */
  async syncProfile(req: any, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { walletAddress: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await TalentProtocolService.syncUserProfile(userId, user.walletAddress);

      res.json({ 
        success: true,
        message: 'Talent Protocol profile synced successfully' 
      });
    } catch (error: any) {
      console.error('Error syncing Talent Protocol profile:', error);
      res.status(500).json({ error: error.message || 'Failed to sync profile' });
    }
  },

  /**
   * Get user's Talent Protocol profile
   * GET /api/talent-protocol/profile
   */
  async getProfile(req: any, res: Response) {
    try {
      const { address } = req.query;

      if (address && typeof address === 'string') {
        const profile = await TalentProtocolService.getProfileByWalletAddress(address);

        if (!profile) {
          return res.status(404).json({ error: 'Talent Protocol profile not found' });
        }

        return res.json({ profile });
      }

      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await TalentProtocolService.getUserProfile(userId);

      if (!profile) {
        return res.status(404).json({ error: 'Talent Protocol profile not found' });
      }

      res.json({ profile });
    } catch (error: any) {
      console.error('Error getting Talent Protocol profile:', error);
      res.status(500).json({ error: error.message || 'Failed to get profile' });
    }
  },

  /**
   * Check if user has Talent Protocol profile
   * GET /api/talent-protocol/has-profile
   */
  async hasProfile(req: any, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const hasProfile = await TalentProtocolService.hasProfile(userId);

      res.json({ hasProfile });
    } catch (error: any) {
      console.error('Error checking Talent Protocol profile:', error);
      res.status(500).json({ error: error.message || 'Failed to check profile' });
    }
  },

  /**
   * Get Talent Protocol score
   * GET /api/talent-protocol/score
   */
  async getScore(req: any, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const score = await TalentProtocolService.getScore(userId);

      res.json({ score });
    } catch (error: any) {
      console.error('Error getting Talent Protocol score:', error);
      res.status(500).json({ error: error.message || 'Failed to get score' });
    }
  },

  /**
   * Sync profile by wallet address
   * POST /api/talent-protocol/sync-address
   */
  async syncProfileByAddress(req: Request, res: Response) {
    try {
      const { address } = req.body as { address?: string };

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      await TalentProtocolService.syncByWalletAddress(address);

      const profile = await TalentProtocolService.getProfileByWalletAddress(address);

      // If no profile found after sync, it means the user doesn't have a Talent Protocol profile
      if (!profile) {
        return res.json({
          success: true,
          message: 'Sync completed, but no Talent Protocol profile found for this address',
          profile: null,
          hasProfile: false,
        });
      }

      res.json({
        success: true,
        message: 'Talent Protocol profile synced successfully',
        profile,
        hasProfile: true,
      });
    } catch (error: any) {
      console.error('Error syncing Talent Protocol profile by address:', error);
      res.status(500).json({ error: error.message || 'Failed to sync profile' });
    }
  },

  /**
   * Get creator stats (requires wallet signature for authentication)
   * POST /api/talent-protocol/creator-stats
   */
  async getCreatorStats(req: Request, res: Response) {
    try {
      const { address, signature, chainId } = req.body as { 
        address?: string; 
        signature?: string; 
        chainId?: string;
      };

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      // Si no hay signature, intentar obtener stats sin autenticación (puede fallar)
      if (!signature || !chainId) {
        return res.status(400).json({ 
          error: 'Signature and chainId are required for creator stats. Please authenticate first.' 
        });
      }

      const stats = await TalentProtocolService.getCreatorStats(address, signature, chainId);

      if (!stats) {
        return res.status(404).json({ error: 'Creator stats not found or authentication failed' });
      }

      res.json({ creatorStats: stats });
    } catch (error: any) {
      console.error('Error getting creator stats:', error);
      res.status(500).json({ error: error.message || 'Failed to get creator stats' });
    }
  },

  /**
   * Get Farcaster scores for a list of Farcaster IDs
   * GET /api/talent-protocol/farcaster/scores?fids={fid1,fid2,...}&scorer_slug={optional}
   */
  async getFarcasterScores(req: Request, res: Response) {
    try {
      const { fids, scorer_slug } = req.query as {
        fids?: string;
        scorer_slug?: string;
      };

      if (!fids) {
        return res.status(400).json({ 
          error: 'fids parameter is required. Provide comma-separated list of Farcaster IDs (max 100).' 
        });
      }

      const scores = await TalentProtocolService.getFarcasterScores(
        fids,
        scorer_slug
      );

      res.json({ scores });
    } catch (error: any) {
      console.error('Error getting Farcaster scores:', error);
      res.status(500).json({ error: error.message || 'Failed to get Farcaster scores' });
    }
  },

  /**
   * Get Farcaster casts that a talent profile is the author of
   * GET /api/talent-protocol/farcaster/profile-casts?id={talent_id|wallet|account}&account_source={optional}
   */
  async getProfileFarcasterCasts(req: Request, res: Response) {
    try {
      const { id, account_source } = req.query as {
        id?: string;
        account_source?: 'farcaster' | 'github' | 'wallet';
      };

      if (!id) {
        return res.status(400).json({ 
          error: 'id parameter is required. Provide Talent ID, wallet address, or account identifier.' 
        });
      }

      const casts = await TalentProtocolService.getProfileFarcasterCasts(
        id,
        account_source
      );

      res.json({ farcaster_casts: casts });
    } catch (error: any) {
      console.error('Error getting profile Farcaster casts:', error);
      res.status(500).json({ error: error.message || 'Failed to get profile Farcaster casts' });
    }
  },

  /**
   * Get top Farcaster casts
   * GET /api/talent-protocol/farcaster/top-casts
   */
  async getTopFarcasterCasts(req: Request, res: Response) {
    try {
      const casts = await TalentProtocolService.getTopFarcasterCasts();

      res.json({ farcaster_casts: casts });
    } catch (error: any) {
      console.error('Error getting top Farcaster casts:', error);
      res.status(500).json({ error: error.message || 'Failed to get top Farcaster casts' });
    }
  },

  /**
   * Get Talent Protocol human checkmark status
   * GET /api/talent-protocol/human-checkmark?id={talent_id|wallet|account}&account_source={optional}
   */
  async getHumanCheckmark(req: Request, res: Response) {
    try {
      const { id, account_source } = req.query as {
        id?: string;
        account_source?: 'farcaster' | 'github' | 'wallet';
      };

      if (!id) {
        return res.status(400).json({ 
          error: 'id parameter is required. Provide Talent ID, wallet address, or account identifier.' 
        });
      }

      const isVerified = await TalentProtocolService.getHumanCheckmark(
        id,
        account_source
      );

      res.json({ humanity_verified: isVerified });
    } catch (error: any) {
      console.error('Error getting human checkmark:', error);
      res.status(500).json({ error: error.message || 'Failed to get human checkmark' });
    }
  },

  /**
   * Get Talent Protocol human checkmark data points
   * GET /api/talent-protocol/human-checkmark/data-points?id={optional}&account_source={optional}
   */
  async getHumanCheckmarkDataPoints(req: Request, res: Response) {
    try {
      const { id, account_source } = req.query as {
        id?: string;
        account_source?: 'farcaster' | 'github' | 'wallet';
      };

      const dataPoints = await TalentProtocolService.getHumanCheckmarkDataPoints(
        id,
        account_source
      );

      res.json({ data_points: dataPoints });
    } catch (error: any) {
      console.error('Error getting human checkmark data points:', error);
      res.status(500).json({ error: error.message || 'Failed to get human checkmark data points' });
    }
  },

  /**
   * Get a profile directly from Talent Protocol API
   * GET /api/talent-protocol/profile-direct?id={talent_id|wallet|account}&account_source={optional}&scorer_slug={optional}
   * 
   * This endpoint provides direct access to the Talent Protocol /profile endpoint
   * with full support for all query parameters including scorer_slug for rank position
   */
  async getProfileDirect(req: Request, res: Response) {
    try {
      const { id, account_source, scorer_slug } = req.query as {
        id?: string;
        account_source?: 'farcaster' | 'github' | 'wallet';
        scorer_slug?: 'builder_score' | 'creator_score';
      };

      if (!id) {
        return res.status(400).json({ 
          error: 'id parameter is required. Provide Talent ID, wallet address, or account identifier.' 
        });
      }

      const profile = await TalentProtocolService.getProfileDirect(
        id,
        account_source,
        scorer_slug
      );

      res.json({ profile });
    } catch (error: any) {
      console.error('Error getting profile directly:', error);
      res.status(500).json({ error: error.message || 'Failed to get profile' });
    }
  },
};

