import { Router } from 'express';
import { grantController } from '../controllers/grant.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/', authMiddleware, apiLimiter, grantController.getAll);
router.get('/:id', authMiddleware, apiLimiter, grantController.getById);
router.post('/', authMiddleware, apiLimiter, grantController.create);
router.put('/:id', authMiddleware, apiLimiter, grantController.update);

export default router;

