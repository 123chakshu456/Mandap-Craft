import express from 'express';
import {
  register,
  signIn,
  login,
  signOut,
  logout,
  getProfile,
  googleLogin,
  getGoogleClientId,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registration
router.post('/register', register);

// Sign In / Login (both endpoints supported)
router.post('/signin', signIn);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/google-client-id', getGoogleClientId);

// Sign Out / Logout (both endpoints supported)
router.post('/signout', signOut);
router.post('/logout', logout);

// Profile
router.get('/me', authenticate, getProfile);

export default router;
