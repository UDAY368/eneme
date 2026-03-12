import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolioStats,
} from '../controllers/portfolioController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes (for user UI)
router.get('/categories', getCategories);
router.get('/subcategories', getSubCategories);
router.get('/', getPortfolios);
router.get('/stats', getPortfolioStats);
router.get('/:id', getPortfolioById);

// Admin routes
router.post('/categories', authMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);
router.post('/subcategories', authMiddleware, createSubCategory);
router.put('/subcategories/:id', authMiddleware, updateSubCategory);
router.delete('/subcategories/:id', authMiddleware, deleteSubCategory);
router.post('/', authMiddleware, createPortfolio);
router.put('/:id', authMiddleware, updatePortfolio);
router.delete('/:id', authMiddleware, deletePortfolio);

export default router;
