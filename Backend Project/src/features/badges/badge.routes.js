import express from 'express';
import {
  getPublicBadges,
  getAdminBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from './badge.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicBadges);

// Admin-only routes (Requires authenticate + authorize('ADMIN'))
router.get('/admin/list', authenticate, authorize('ADMIN'), getAdminBadges);
router.post('/admin', authenticate, authorize('ADMIN'), createBadge);
router.put('/admin/:id', authenticate, authorize('ADMIN'), updateBadge);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), deleteBadge);

export default router;
