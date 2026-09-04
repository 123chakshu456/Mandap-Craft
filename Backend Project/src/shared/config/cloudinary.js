import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer stream directly to Cloudinary
 * @param {Buffer} buffer 
 * @param {string} folder 
 * @returns {Promise<{url: string, publicId: string, width: number, height: number}>}
 */
export const uploadStreamToCloudinary = (buffer, folder = 'shiv-shakti-events') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

export default cloudinary;
