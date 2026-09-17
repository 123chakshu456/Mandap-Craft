import express from 'express';
import {
  getProducts,
  getProductById,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  publishProduct,
  unpublishProduct,
  deleteProduct,
  bulkStatusUpdate,
  bulkCategoryUpdate,
  bulkDelete,
} from './product.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';
import { memoryCache, invalidateCache } from '../../shared/middlewares/cacheMiddleware.js';

const router = express.Router();

const clearProductCache = (req, res, next) => {
  invalidateCache('/products');
  next();
};

// Public routes (Cached for 60 seconds in RAM to support 10,000+ concurrent users)
router.get('/', memoryCache(60), getProducts);
router.get('/:id', memoryCache(60), getProductById);

// Admin-only routes with automatic cache invalidation
router.get('/admin/list', authenticate, authorize('ADMIN'), getAdminProducts);
router.get('/admin/item/:id', authenticate, authorize('ADMIN'), getAdminProductById);
router.post('/admin/bulk-status', authenticate, authorize('ADMIN'), clearProductCache, bulkStatusUpdate);
router.post('/admin/bulk-category', authenticate, authorize('ADMIN'), clearProductCache, bulkCategoryUpdate);
router.post('/admin/bulk-delete', authenticate, authorize('ADMIN'), clearProductCache, bulkDelete);
router.post('/admin', authenticate, authorize('ADMIN'), clearProductCache, createProduct);
router.put('/admin/:id', authenticate, authorize('ADMIN'), clearProductCache, updateProduct);
router.patch('/admin/:id/publish', authenticate, authorize('ADMIN'), clearProductCache, publishProduct);
router.patch('/admin/:id/unpublish', authenticate, authorize('ADMIN'), clearProductCache, unpublishProduct);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), clearProductCache, deleteProduct);

export default router;
