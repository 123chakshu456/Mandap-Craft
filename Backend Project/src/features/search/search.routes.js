import express from 'express';
import { globalSearch } from './search.controller.js';
import { optionalAuth } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, globalSearch);

export default router;
