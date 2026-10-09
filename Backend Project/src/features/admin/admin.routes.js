import express from 'express';
import { getStats, getAuditLogs } from './admin.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';
import { rateLimit, noCacheSensitive } from '../../shared/middlewares/securityMiddleware.js';
import { dataManagementRoutes } from '../data-management/index.js';

const router = express.Router();

// Anti-fuzzing admin rate limiter
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'Admin operation rate limit reached. Please wait a few minutes.',
  key: 'admin-operations',
});

// Admin-only protection with no-cache and rate limiting
router.use(authenticate, authorize('ADMIN'), noCacheSensitive, adminLimiter);

router.get('/stats', getStats);
router.get('/audit-logs', getAuditLogs);
router.use('/data', dataManagementRoutes);

export default router;
