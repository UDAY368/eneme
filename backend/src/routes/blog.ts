import { Router } from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCount,
  getBlogListWithCount,
} from '../controllers/blogController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes (for user UI) - /list and /count must be before /:id
router.get('/', getBlogs);
router.get('/list', getBlogListWithCount);
router.get('/count', getBlogCount);
router.get('/:id', getBlogById);

// Admin routes
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

export default router;
