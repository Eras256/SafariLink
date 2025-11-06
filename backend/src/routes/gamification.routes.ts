import { Router } from 'express';
import { gamificationController } from '../controllers/gamification.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuth.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Get user badges (requires auth)
router.get('/hackathon/:hackathonId/badges', optionalAuthMiddleware, apiLimiter, gamificationController.getUserBadges);

// Get leaderboard (public, optional auth)
router.get('/hackathon/:hackathonId/leaderboard', optionalAuthMiddleware, apiLimiter, gamificationController.getLeaderboard);

// Get user rank (requires auth)
router.get('/hackathon/:hackathonId/rank', optionalAuthMiddleware, apiLimiter, gamificationController.getUserRank);

// Get user stats (requires auth)
router.get('/hackathon/:hackathonId/stats', optionalAuthMiddleware, apiLimiter, gamificationController.getUserStats);

// Get daily challenges (public, optional auth)
router.get('/hackathon/:hackathonId/challenges', optionalAuthMiddleware, apiLimiter, gamificationController.getDailyChallenges);

// Complete challenge (requires auth)
router.post('/hackathon/:hackathonId/challenge/:challengeId/complete', authMiddleware, apiLimiter, gamificationController.completeChallenge);

// Check badges (requires auth) - usually called after user actions
router.post('/hackathon/:hackathonId/check-badges', authMiddleware, apiLimiter, gamificationController.checkBadges);

export default router;

