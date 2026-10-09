import express from 'express';
import {
  register,
  signIn,
  signOut,
  getProfile,
  googleLogin,
  getGoogleClientId,
} from './auth.controller.js';
import { authenticate } from '../../shared/middlewares/authMiddleware.js';
import { rateLimit, noCacheSensitive } from '../../shared/middlewares/securityMiddleware.js';

const router = express.Router();

// Strict Rate Limiting for Authentication (Brute Force Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 attempts per IP per 15 minutes
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
  key: 'auth-attempts',
});

// Disable caching for all authentication endpoints
router.use(noCacheSensitive);

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, signIn);
router.post('/signin', authLimiter, signIn);
router.post('/google-login', authLimiter, googleLogin);
router.get('/google-client-id', getGoogleClientId);
router.post('/logout', signOut);
router.post('/signout', signOut);

// Protected routes
router.get('/me', authenticate, getProfile);

export default router;
