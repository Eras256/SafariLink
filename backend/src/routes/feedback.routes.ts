import { Router } from 'express';
import { feedbackController } from '../controllers/feedback.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuth.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Get feedback for a project (public, optional auth)
router.get('/project/:projectId', optionalAuthMiddleware, apiLimiter, feedbackController.getProjectFeedback);

// Get feedback statistics (public, optional auth)
router.get('/project/:projectId/stats', optionalAuthMiddleware, apiLimiter, feedbackController.getFeedbackStats);

// Create feedback (requires auth)
router.post('/project/:projectId', authMiddleware, apiLimiter, feedbackController.createFeedback);

// Update feedback (requires auth, owner only)
router.put('/:id', authMiddleware, apiLimiter, feedbackController.updateFeedback);

// Delete feedback (requires auth, owner only)
router.delete('/:id', authMiddleware, apiLimiter, feedbackController.deleteFeedback);

export default router;

