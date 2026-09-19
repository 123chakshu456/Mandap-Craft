import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../../public/uploads');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Save image locally if Cloudinary is not configured or fails
 */
const saveLocalFallback = (buffer, originalName = '') => {
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const rawExt = path.extname(originalName || '').toLowerCase();
  const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.tiff', '.avif'];
  const ext = validExts.includes(rawExt) ? rawExt : '.jpg';

  const filename = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  writeFileSync(filePath, buffer);

  const baseUrl = process.env.RENDER_EXTERNAL_URL ||
    process.env.BASE_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://shiv-shakti-events-mart.onrender.com' : '');
  const url = baseUrl ? `${baseUrl.replace(/\/+$/, '')}/uploads/${filename}` : `/uploads/${filename}`;

  return {
    url,
    publicId: `local_${filename}`,
    width: 800,
    height: 600,
    format: ext.replace('.', ''),
    bytes: buffer.length,
  };
};

/**
 * Upload a buffer stream to Cloudinary with local fallback
 * @param {Buffer} buffer 
 * @param {string} folder 
 * @param {string} originalName
 * @returns {Promise<{url: string, publicId: string, width: number, height: number, format: string, bytes: number}>}
 */
export const uploadStreamToCloudinary = (buffer, folder = 'shiv-shakti-events', originalName = '') => {
  if (!isCloudinaryConfigured) {
    console.log('ℹ️ Cloudinary credentials not configured. Storing image in local /uploads directory.');
    return Promise.resolve(saveLocalFallback(buffer, originalName));
  }

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          console.warn('⚠️ Cloudinary upload failed. Falling back to local storage:', error?.message);
          return resolve(saveLocalFallback(buffer, originalName));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

/**
 * Delete an asset from Cloudinary or local storage
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  if (publicId.startsWith('local_')) {
    return null; // Local asset deletion is non-critical
  }
  if (!isCloudinaryConfigured) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn(`[Cloudinary Destroy Warning] Failed to delete ${publicId}:`, err.message);
    return null;
  }
};

export default cloudinary;
