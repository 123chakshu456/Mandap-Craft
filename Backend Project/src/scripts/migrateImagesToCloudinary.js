import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../shared/config/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPublicDir = path.resolve(__dirname, '../../../Project/Shiv-Shakti-Events-Mart/public');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CONCURRENCY = 6;

async function main() {
  console.log('========================================================');
  console.log('🚀 PARALLEL CLOUDINARY PRODUCT IMAGE MIGRATION');
  console.log('========================================================\n');

  console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  const ping = await cloudinary.api.ping();
  console.log('✅ Cloudinary Ping status:', ping.status, '\n');

  // Fetch all products from DB
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      images: true,
      categoryId: true,
      subcategoryId: true,
    },
  });

  console.log(`📦 Total products in DB: ${allProducts.length}`);

  // Filter products needing migration (whose primary image does not start with http)
  const productsToMigrate = allProducts.filter((p) => p.image && !p.image.startsWith('http'));

  // Prioritize catalogue, chairs, sofas, furniture first
  productsToMigrate.sort((a, b) => {
    const aIsPriority = a.image.includes('catalogue') || a.image.includes('chair') || a.subcategoryId === 'chairs' || a.subcategoryId === 'sofas';
    const bIsPriority = b.image.includes('catalogue') || b.image.includes('chair') || b.subcategoryId === 'chairs' || b.subcategoryId === 'sofas';
    if (aIsPriority && !bIsPriority) return -1;
    if (!aIsPriority && bIsPriority) return 1;
    return 0;
  });

  console.log(`🔍 Products with local image paths to migrate: ${productsToMigrate.length}`);

  const uploadCache = new Map(); // localRelPath -> Promise<{ url, publicId }>
  let completed = 0;
  let successCount = 0;
  let failCount = 0;

  async function getOrUploadImage(imagePath) {
    if (!imagePath || imagePath.startsWith('http')) return null;
    const cleanRelPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullLocalPath = path.join(frontendPublicDir, cleanRelPath);

    if (uploadCache.has(cleanRelPath)) {
      return uploadCache.get(cleanRelPath);
    }

    if (!existsSync(fullLocalPath)) {
      uploadCache.set(cleanRelPath, Promise.resolve(null));
      return null;
    }

    const uploadPromise = (async () => {
      try {
        const uploadRes = await cloudinary.uploader.upload(fullLocalPath, {
          folder: 'shiv-shakti-products',
          use_filename: true,
          unique_filename: true,
          resource_type: 'image',
        });
        return {
          url: uploadRes.secure_url,
          publicId: uploadRes.public_id,
        };
      } catch (err) {
        console.error(`\n⚠️ Upload error for ${cleanRelPath}:`, err.message);
        return null;
      }
    })();

    uploadCache.set(cleanRelPath, uploadPromise);
    return uploadPromise;
  }

  // Worker pool for parallel processing
  async function processProduct(product, idx) {
    try {
      const uploadResult = await getOrUploadImage(product.image);
      if (uploadResult && uploadResult.url) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: uploadResult.url },
        });

        // Also update any matching ProductImage
        if (product.images && product.images.length > 0) {
          for (const img of product.images) {
            if (img.url === product.image) {
              await prisma.productImage.update({
                where: { id: img.id },
                data: {
                  url: uploadResult.url,
                  publicId: uploadResult.publicId || undefined,
                },
              });
            }
          }
        }
        successCount++;
      } else {
        failCount++;
      }
    } catch (err) {
      failCount++;
      console.error(`\n⚠️ DB update error for ${product.name}:`, err.message);
    } finally {
      completed++;
      if (completed % 25 === 0 || completed === productsToMigrate.length) {
        const pct = Math.round((completed / productsToMigrate.length) * 100);
        console.log(`[${pct}%] ${completed}/${productsToMigrate.length} products processed (Updated: ${successCount}, Skipped: ${failCount})`);
      }
    }
  }

  // Queue runner with bounded concurrency
  let queueIndex = 0;
  async function worker() {
    while (queueIndex < productsToMigrate.length) {
      const curIndex = queueIndex++;
      await processProduct(productsToMigrate[curIndex], curIndex);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log('\n========================================================');
  console.log('🎉 ALL PRODUCTS MIGRATED TO CLOUDINARY!');
  console.log(`   - Total Processed: ${completed}`);
  console.log(`   - Successfully Updated: ${successCount}`);
  console.log(`   - Skipped / Missing Files: ${failCount}`);
  console.log(`   - Unique Images Uploaded: ${uploadCache.size}`);
  console.log('========================================================\n');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Fatal error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
