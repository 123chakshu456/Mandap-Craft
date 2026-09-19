import express from 'express';
import {
  createQuote,
  getAllQuotes,
  updateQuoteStatus,
  deleteQuote,
} from './quote.controller.js';
import { authenticate, optionalAuth, authorize } from '../../shared/middlewares/authMiddleware.js';
import { rateLimit } from '../../shared/middlewares/securityMiddleware.js';

const router = express.Router();

// Quote submission anti-spam rate limiter
const quoteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // max 20 quotes per 10 minutes per IP
  message: 'Too many quote requests submitted from this IP. Please wait a few minutes.',
  key: 'quote-submissions',
});

// Public / User route
router.post('/', quoteLimiter, optionalAuth, createQuote);

// Admin-only routes
router.get('/', authenticate, authorize('ADMIN'), getAllQuotes);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateQuoteStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteQuote);

export default router;
