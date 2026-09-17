import express from 'express';
import {
  getPublicSlides,
  getAdminSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  toggleSlideActive,
  reorderSlides,
} from './carousel.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public route for storefront
router.get('/slides', getPublicSlides);
router.get('/slides/:id', getSlideById);

// Admin-only management endpoints
router.get('/admin/slides', authenticate, authorize('ADMIN'), getAdminSlides);
router.post('/admin/slides', authenticate, authorize('ADMIN'), createSlide);
router.put('/admin/slides/:id', authenticate, authorize('ADMIN'), updateSlide);
router.delete('/admin/slides/:id', authenticate, authorize('ADMIN'), deleteSlide);
router.patch('/admin/slides/:id/toggle', authenticate, authorize('ADMIN'), toggleSlideActive);
router.post('/admin/slides/reorder', authenticate, authorize('ADMIN'), reorderSlides);

export default router;
