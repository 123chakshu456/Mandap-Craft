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
import { memoryCache, invalidateCache } from '../../shared/middlewares/cacheMiddleware.js';

const router = express.Router();

const clearCarouselCache = (req, res, next) => {
  invalidateCache('/carousel');
  next();
};

// Public route for storefront (cached in-memory for 120 seconds to support 5000+ concurrent users)
router.get('/slides', memoryCache(120), getPublicSlides);
router.get('/slides/:id', memoryCache(120), getSlideById);

// Admin-only management endpoints with automatic cache invalidation
router.get('/admin/slides', authenticate, authorize('ADMIN'), getAdminSlides);
router.post('/admin/slides', authenticate, authorize('ADMIN'), clearCarouselCache, createSlide);
router.put('/admin/slides/:id', authenticate, authorize('ADMIN'), clearCarouselCache, updateSlide);
router.delete('/admin/slides/:id', authenticate, authorize('ADMIN'), clearCarouselCache, deleteSlide);
router.patch('/admin/slides/:id/toggle', authenticate, authorize('ADMIN'), clearCarouselCache, toggleSlideActive);
router.post('/admin/slides/reorder', authenticate, authorize('ADMIN'), clearCarouselCache, reorderSlides);

export default router;
