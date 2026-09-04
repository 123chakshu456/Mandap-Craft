import express from 'express';
import {
  getPublicFilters,
  getAdminFilters,
  createFilter,
  updateFilter,
  deleteFilter,
  addFilterValue,
  updateFilterValue,
  deleteFilterValue,
} from './filter.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicFilters);

// Admin routes (Requires authenticate + authorize('ADMIN'))
router.get('/admin/list', authenticate, authorize('ADMIN'), getAdminFilters);
router.post('/admin', authenticate, authorize('ADMIN'), createFilter);
router.put('/admin/:id', authenticate, authorize('ADMIN'), updateFilter);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), deleteFilter);

// Filter values management
router.post('/admin/:id/values', authenticate, authorize('ADMIN'), addFilterValue);
router.put('/admin/:id/values/:valueId', authenticate, authorize('ADMIN'), updateFilterValue);
router.delete('/admin/:id/values/:valueId', authenticate, authorize('ADMIN'), deleteFilterValue);

export default router;
