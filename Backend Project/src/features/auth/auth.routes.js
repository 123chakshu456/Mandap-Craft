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
import { rateLimit } from '../../shared/middlewares/securityMiddleware.js';

const router = express.Router();

// Strict Rate Limiting for Authentication (Brute Force Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 attempts per IP
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
  key: 'auth-attempts',
});

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
