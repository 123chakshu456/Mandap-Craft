import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../shared/config/prisma.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function runUpload() {
  console.log('🚀 Uploading Table Covers to Cloudinary in Full HD...');

  const img1Path = path.resolve('extracted_covers/table_cover_4.jpg');
  const img2Path = path.resolve('extracted_covers/table_cover_5.jpg');

  // Upload image 1
  console.log('Uploading GL-TC-001 (Yellow Top Round Table Cover)...');
  const upload1 = await cloudinary.uploader.upload(img1Path, {
    folder: 'shiv-shakti-products',
    public_id: 'cat_wedding_table_cover_yellow_top_gl_tc_001',
    overwrite: true,
    resource_type: 'image',
  });
  console.log('✅ Uploaded 1:', {
    url: upload1.secure_url,
    width: upload1.width,
    height: upload1.height,
    format: upload1.format,
    bytes: upload1.bytes,
    public_id: upload1.public_id,
  });

  // Upload image 2
  console.log('Uploading GL-TC-002 (Green Velvet Overlay Table Cover)...');
  const upload2 = await cloudinary.uploader.upload(img2Path, {
    folder: 'shiv-shakti-products',
    public_id: 'cat_wedding_table_cover_green_velvet_gl_tc_002',
    overwrite: true,
    resource_type: 'image',
  });
  console.log('✅ Uploaded 2:', {
    url: upload2.secure_url,
    width: upload2.width,
    height: upload2.height,
    format: upload2.format,
    bytes: upload2.bytes,
    public_id: upload2.public_id,
  });

  // Upload category banner/thumbnail to shiv-shakti-categories
  console.log('Uploading Category Thumbnail to shiv-shakti-categories...');
  const catUpload = await cloudinary.uploader.upload(img2Path, {
    folder: 'shiv-shakti-categories',
    public_id: 'wedding_table_covers_banner',
    overwrite: true,
    resource_type: 'image',
  });
  console.log('✅ Category image uploaded:', catUpload.secure_url);

  return {
    item1: upload1,
    item2: upload2,
    catImage: catUpload,
  };
}

runUpload()
  .then(res => {
    console.log('\nAll uploads finished successfully!');
    fs.writeFileSync('C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Catalogues/extracted/cloudinary_results.json', JSON.stringify(res, null, 2));
  })
  .catch(err => {
    console.error('❌ Upload failed:', err);
    process.exit(1);
  });
