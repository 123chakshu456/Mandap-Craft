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

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', signIn);
router.post('/signin', signIn);
router.post('/google-login', googleLogin);
router.get('/google-client-id', getGoogleClientId);
router.post('/logout', signOut);
router.post('/signout', signOut);

// Protected routes
router.get('/me', authenticate, getProfile);

export default router;
