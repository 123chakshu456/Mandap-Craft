import express from 'express';
import {
  getPublicCategories,
  getAdminCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from './category.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicCategories);
router.get('/:id', getCategoryById);

// Admin-only routes (Requires authenticate + authorize('ADMIN'))
router.get('/admin/tree', authenticate, authorize('ADMIN'), getAdminCategories);
router.post('/admin', authenticate, authorize('ADMIN'), createCategory);
router.put('/admin/:id', authenticate, authorize('ADMIN'), updateCategory);
router.patch('/admin/:id/status', authenticate, authorize('ADMIN'), toggleCategoryStatus);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), deleteCategory);

export default router;
