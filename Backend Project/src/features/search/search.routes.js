import express from 'express';
import { globalSearch } from './search.controller.js';
import { optionalAuth } from '../../shared/middlewares/authMiddleware.js';
import { rateLimit } from '../../shared/middlewares/securityMiddleware.js';

const router = express.Router();

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max 60 searches per minute per IP
  message: 'Search query rate limit reached. Please wait a moment.',
  key: 'search-query-limiter',
});

router.get('/', searchLimiter, optionalAuth, globalSearch);

export default router;
