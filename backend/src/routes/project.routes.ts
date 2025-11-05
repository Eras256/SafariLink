import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { submissionLimiter, apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/', apiLimiter, projectController.getAll);
router.get('/:id', apiLimiter, projectController.getById);
router.post('/', authMiddleware, submissionLimiter, projectController.create);
router.put('/:id', authMiddleware, apiLimiter, projectController.update);
router.post('/:id/submit', authMiddleware, submissionLimiter, projectController.submit);
router.post('/:id/vote', authMiddleware, apiLimiter, projectController.vote);

export default router;

