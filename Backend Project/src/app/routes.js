import express from 'express';
import { authRoutes } from '../features/auth/index.js';
import { categoryRoutes } from '../features/categories/index.js';
import { productRoutes } from '../features/products/index.js';
import { mediaRoutes } from '../features/media/index.js';
import { filterRoutes } from '../features/filters/index.js';
import { badgeRoutes } from '../features/badges/index.js';
import { pageRoutes } from '../features/pages/index.js';
import { orderRoutes } from '../features/orders/index.js';
import { quoteRoutes } from '../features/quotes/index.js';
import { searchRoutes } from '../features/search/index.js';
import { adminRoutes } from '../features/admin/index.js';

const router = express.Router();

// System health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Shiv Shakti Events Mart CMS API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature Domains
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/media', mediaRoutes);
router.use('/filters', filterRoutes);
router.use('/badges', badgeRoutes);
router.use('/pages', pageRoutes);
router.use('/orders', orderRoutes);
router.use('/quotes', quoteRoutes);
router.use('/search', searchRoutes);
router.use('/admin', adminRoutes);

export default router;
