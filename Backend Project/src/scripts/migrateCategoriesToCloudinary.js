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

async function main() {
  const cats = await prisma.category.findMany({
    where: { image: { not: null, startsWith: '/' } },
  });

  console.log(`Migrating ${cats.length} category thumbnails to Cloudinary...`);

  for (const cat of cats) {
    const localRel = cat.image.startsWith('/') ? cat.image.slice(1) : cat.image;
    const fullPath = path.join(frontendPublicDir, localRel);

    if (existsSync(fullPath)) {
      try {
        const res = await cloudinary.uploader.upload(fullPath, {
          folder: 'shiv-shakti-categories',
          use_filename: true,
          unique_filename: true,
        });

        await prisma.category.update({
          where: { id: cat.id },
          data: { image: res.secure_url },
        });

        console.log(`✅ ${cat.name} -> ${res.secure_url}`);
      } catch (err) {
        console.error(`⚠️ Failed ${cat.name}:`, err.message);
      }
    } else {
      console.log(`⏩ Not found locally: ${localRel}`);
    }
  }

  console.log('Category migration complete!');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
