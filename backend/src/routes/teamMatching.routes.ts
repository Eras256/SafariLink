import { Router } from 'express';
import {
  getProfile,
  createOrUpdateProfile,
  findMatches,
  getUserMatches,
  respondToMatch,
  getMatch,
  deleteProfile,
} from '../controllers/teamMatching.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Rate limiting
router.use(apiLimiter);

// Profile routes
router.get('/hackathons/:hackathonId/profile', getProfile);
router.post('/hackathons/:hackathonId/profile', createOrUpdateProfile);
router.put('/hackathons/:hackathonId/profile', createOrUpdateProfile);
router.delete('/hackathons/:hackathonId/profile', deleteProfile);

// Match routes
router.get('/hackathons/:hackathonId/matches', findMatches);
router.get('/hackathons/:hackathonId/my-matches', getUserMatches);
router.get('/matches/:matchId', getMatch);
router.post('/matches/:matchId/respond', respondToMatch);

export default router;

