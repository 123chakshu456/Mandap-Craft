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

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (Requires authenticate + authorize('ADMIN'))
router.get('/admin/list', authenticate, authorize('ADMIN'), getAdminProducts);
router.get('/admin/item/:id', authenticate, authorize('ADMIN'), getAdminProductById);
router.post('/admin/bulk-status', authenticate, authorize('ADMIN'), bulkStatusUpdate);
router.post('/admin/bulk-category', authenticate, authorize('ADMIN'), bulkCategoryUpdate);
router.post('/admin/bulk-delete', authenticate, authorize('ADMIN'), bulkDelete);
router.post('/admin', authenticate, authorize('ADMIN'), createProduct);
router.put('/admin/:id', authenticate, authorize('ADMIN'), updateProduct);
router.patch('/admin/:id/publish', authenticate, authorize('ADMIN'), publishProduct);
router.patch('/admin/:id/unpublish', authenticate, authorize('ADMIN'), unpublishProduct);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), deleteProduct);

export default router;
