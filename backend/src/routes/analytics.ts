import { Router } from 'express';
import { getAnalytics, getAnalyticsSummary } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.get('/summary', authMiddleware, getAnalyticsSummary);
router.get('/', authMiddleware, getAnalytics);
export default router;
