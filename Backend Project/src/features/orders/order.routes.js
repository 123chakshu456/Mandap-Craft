import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from './order.controller.js';
import { authenticate, optionalAuth, authorize } from '../../shared/middlewares/authMiddleware.js';
import { rateLimit } from '../../shared/middlewares/securityMiddleware.js';

const router = express.Router();

// Order creation anti-bot rate limiter
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // max 30 orders per 10 minutes per IP
  message: 'Too many order placements from this IP. Please wait a few minutes.',
  key: 'order-placements',
});

// Public / User routes
router.post('/', orderLimiter, optionalAuth, createOrder);
router.get('/my-orders', authenticate, getMyOrders);

// Admin-only routes
router.get('/', authenticate, authorize('ADMIN'), getAllOrders);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteOrder);

export default router;
