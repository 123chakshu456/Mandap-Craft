import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from './order.controller.js';
import { authenticate, optionalAuth, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public / User routes
router.post('/', optionalAuth, createOrder);
router.get('/my-orders', authenticate, getMyOrders);

// Admin-only routes
router.get('/', authenticate, authorize('ADMIN'), getAllOrders);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);

export default router;
