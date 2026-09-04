import express from 'express';
import multer from 'multer';
import {
  uploadMedia,
  addImageToProduct,
  updateProductImage,
  deleteProductImage,
  reorderProductImages,
} from './media.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

// In-memory buffer storage for direct Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
  },
});

// All media mutations require Admin access
router.post('/upload', authenticate, authorize('ADMIN'), upload.single('image'), uploadMedia);
router.post('/products/:id/images', authenticate, authorize('ADMIN'), addImageToProduct);
router.put('/products/:id/images/:imageId', authenticate, authorize('ADMIN'), updateProductImage);
router.delete('/products/:id/images/:imageId', authenticate, authorize('ADMIN'), deleteProductImage);
router.patch('/products/:id/images/reorder', authenticate, authorize('ADMIN'), reorderProductImages);

export default router;
