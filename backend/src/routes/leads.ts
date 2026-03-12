import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadCount,
  updateLeadReviewed,
  deleteLead,
} from '../controllers/leadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
// Public - form submission from frontend
router.post('/', createLead);
// Admin only
router.get('/', authMiddleware, getLeads);
router.get('/count', authMiddleware, getLeadCount);
router.patch('/:id/review', authMiddleware, updateLeadReviewed);
router.delete('/:id', authMiddleware, deleteLead);
export default router;
