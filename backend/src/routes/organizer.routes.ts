import { Router } from 'express';
import { organizerController } from '../controllers/organizer.controller';
import { optionalAuthMiddleware } from '../middleware/optionalAuth.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Get comprehensive dashboard metrics (optional auth - verifies by walletAddress)
router.get('/:id/dashboard', optionalAuthMiddleware, apiLimiter, organizerController.getDashboardMetrics);

// Get real-time metrics updates (optional auth - verifies by walletAddress)
router.get('/:id/metrics/realtime', optionalAuthMiddleware, apiLimiter, organizerController.getRealtimeMetrics);

export default router;

