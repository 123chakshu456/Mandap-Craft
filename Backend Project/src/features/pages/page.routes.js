import express from 'express';
import {
  getPublicPages,
  getPublicPageBySlug,
  getAdminPages,
  getAdminPageById,
  createPage,
  updatePage,
  publishPage,
  unpublishPage,
  deletePage,
} from './page.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicPages);
router.get('/slug/:slug', getPublicPageBySlug);

// Admin-only routes (Requires authenticate + authorize('ADMIN'))
router.get('/admin/list', authenticate, authorize('ADMIN'), getAdminPages);
router.get('/admin/item/:id', authenticate, authorize('ADMIN'), getAdminPageById);
router.post('/admin', authenticate, authorize('ADMIN'), createPage);
router.put('/admin/:id', authenticate, authorize('ADMIN'), updatePage);
router.patch('/admin/:id/publish', authenticate, authorize('ADMIN'), publishPage);
router.patch('/admin/:id/unpublish', authenticate, authorize('ADMIN'), unpublishPage);
router.delete('/admin/:id', authenticate, authorize('ADMIN'), deletePage);

export default router;
