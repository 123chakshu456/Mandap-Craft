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
import { memoryCache, invalidateCache } from '../../shared/middlewares/cacheMiddleware.js';

const router = express.Router();

const clearCategoryCache = (req, res, next) => {
  invalidateCache('/categories');
  next();
};

// Public routes (Cached for 120 seconds in RAM)
router.get('/', memoryCache(120), getPublicCategories);
router.get('/:id', memoryCache(120), getCategoryById);

// Admin-only routes with automatic cache invalidation
router.get('/admin/tree', authenticate, authorize('ADMIN'), getAdminCategories);
router.post('/admin', authenticate, authorize('ADMIN'), clearCategoryCache, createCategory);
router.put('/admin/:id', authenticate, authorize('ADMIN'), clearCategoryCache, updateCategory);
router.patch('/admin/:id/status', authenticate, authorize('ADMIN'), clearCategoryCache, toggleCategoryStatus);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), clearCategoryCache, deleteCategory);

export default router;
