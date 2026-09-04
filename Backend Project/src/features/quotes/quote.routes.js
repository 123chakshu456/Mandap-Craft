import express from 'express';
import {
  createQuote,
  getAllQuotes,
  updateQuoteStatus,
} from './quote.controller.js';
import { authenticate, optionalAuth, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Public / User route
router.post('/', optionalAuth, createQuote);

// Admin-only routes
router.get('/', authenticate, authorize('ADMIN'), getAllQuotes);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateQuoteStatus);

export default router;
