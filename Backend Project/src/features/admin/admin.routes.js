import express from 'express';
import { getStats } from './admin.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Admin-only protection
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getStats);

export default router;
