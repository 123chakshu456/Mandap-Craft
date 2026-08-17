import express from 'express';
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import quoteRoutes from './quoteRoutes.js';
import { globalSearch } from '../controllers/searchController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Search route
router.get('/search', optionalAuth, globalSearch);

// Mount modular sub-routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/quotes', quoteRoutes);

export default router;

