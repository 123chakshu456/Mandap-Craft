import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadMedia,
  getMediaAssets,
  deleteMediaAsset,
  addImageToProduct,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,
} from './media.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// Supported image MIME types and file extensions
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/x-ms-bmp',
  'image/tiff',
  'image/avif',
  'image/heic',
  'image/heif',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.bmp',
  '.tiff',
  '.avif',
  '.heic',
  '.heif',
]);

// In-memory buffer storage for direct Cloudinary / local fallback streaming
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const mime = (file.mimetype || '').toLowerCase();
    const ext = path.extname(file.originalname || '').toLowerCase();

    if (ALLOWED_MIME_TYPES.has(mime) || ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      const err = new Error('Unsupported image format. Please upload a valid image file (JPG, PNG, WebP, AVIF, GIF, or SVG).');
      err.statusCode = 400;
      cb(err);
    }
  },
});

// All media endpoints require Admin access
router.get('/', authenticate, authorize('ADMIN'), getMediaAssets);
router.post('/upload', authenticate, authorize('ADMIN'), upload.single('image'), uploadMedia);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteMediaAsset);

// Product-specific gallery management
router.post('/products/:id/images', authenticate, authorize('ADMIN'), addImageToProduct);
router.put('/products/:id/images/:imageId', authenticate, authorize('ADMIN'), updateProductImage);
router.delete('/products/:id/images/:imageId', authenticate, authorize('ADMIN'), deleteProductImage);
router.patch('/products/:id/images/reorder', authenticate, authorize('ADMIN'), reorderProductImages);

export default router;
