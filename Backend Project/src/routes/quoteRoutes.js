import express from 'express';
import {
  createQuote,
  getAllQuotes,
} from '../controllers/quoteController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Submit new bespoke quote request
router.post('/', optionalAuth, createQuote);

// Get quotes
router.get('/', getAllQuotes);

export default router;
