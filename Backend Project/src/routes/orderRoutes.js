import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import { authenticate, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create new order (supports guest and logged-in user)
router.post('/', optionalAuth, createOrder);

// Get current user's orders
router.get('/my-orders', authenticate, getMyOrders);

// Get all orders (admin/overview)
router.get('/', getAllOrders);

export default router;
