import express from 'express';
import { getStats, getAuditLogs } from './admin.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';
import { dataManagementRoutes } from '../data-management/index.js';

const router = express.Router();

// Admin-only protection
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/audit-logs', getAuditLogs);
router.use('/data', dataManagementRoutes);

export default router;
