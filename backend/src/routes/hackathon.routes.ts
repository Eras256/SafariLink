import { Router } from 'express';
import { hackathonController } from '../controllers/hackathon.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/', apiLimiter, hackathonController.getAll);
router.get('/:id', apiLimiter, hackathonController.getById);
router.post('/', authMiddleware, apiLimiter, hackathonController.create);
router.put('/:id', authMiddleware, apiLimiter, hackathonController.update);
router.post('/:id/register', authMiddleware, apiLimiter, hackathonController.register);
router.get('/:id/projects', apiLimiter, hackathonController.getProjects);

export default router;

