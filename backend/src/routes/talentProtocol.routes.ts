import { Router } from 'express';
import { talentProtocolController } from '../controllers/talentProtocol.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Authenticated routes
router.post('/sync', authMiddleware, talentProtocolController.syncProfile);
router.get('/profile', authMiddleware, talentProtocolController.getProfile);
router.get('/has-profile', authMiddleware, talentProtocolController.hasProfile);
router.get('/score', authMiddleware, talentProtocolController.getScore);

// Public routes for wallet-only flows
router.post('/sync-address', talentProtocolController.syncProfileByAddress);
router.get('/profile/by-address', talentProtocolController.getProfile);
router.get('/profile-direct', talentProtocolController.getProfileDirect);
router.post('/creator-stats', talentProtocolController.getCreatorStats);
router.get('/farcaster/scores', talentProtocolController.getFarcasterScores);
router.get('/farcaster/profile-casts', talentProtocolController.getProfileFarcasterCasts);
router.get('/farcaster/top-casts', talentProtocolController.getTopFarcasterCasts);
router.get('/human-checkmark', talentProtocolController.getHumanCheckmark);
router.get('/human-checkmark/data-points', talentProtocolController.getHumanCheckmarkDataPoints);

export default router;

