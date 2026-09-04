/**
 * SEED SCRIPT — Migrates all products from mockData.ts into the PostgreSQL database.
 * Run with: npx tsx src/scripts/seedProducts.ts
 */

import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

// Import the TypeScript CATALOG_PRODUCTS directly
const CATALOG_PRODUCTS_MODULE = await import(
  '../../../Project/Shiv-Shakti-Events-Mart/src/constants/mockData.js'
).catch(() => null);

// Fallback: try direct relative path
let products: any[] = [];

if (CATALOG_PRODUCTS_MODULE) {
  products = CATALOG_PRODUCTS_MODULE.CATALOG_PRODUCTS || [];
} else {
  console.error('Could not import mockData. Using empty array.');
  process.exit(1);
}

const prisma = new PrismaClient();

async function seed() {
  console.log(`\n🌱 Starting database seed with ${products.length} products...\n`);

  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`⚠️  Database already has ${existing} products.`);
    console.log('   Skipping duplicates (matched by name + categoryId).\n');
  }

  let inserted = 0;
  let skipped = 0;
  const errors: { name: string; error: string }[] = [];

  for (const product of products) {
    try {
      const exists = await prisma.product.findFirst({
        where: { name: product.name, categoryId: product.categoryId },
      });
      if (exists) { skipped++; continue; }

      await prisma.product.create({
        data: {
          name: product.name,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          style: product.style || 'Traditional',
          price: Number(product.price) || 0,
          rating: Number(product.rating) || 4.5,
          reviews: Number(product.reviews) || 0,
          image: product.image || '',
          description: product.description || '',
          features: Array.isArray(product.features) ? product.features : [],
          isFeatured: product.isFeatured || false,
          tag: product.tag || null,
          inStock: true,
        },
      });
      inserted++;
      if (inserted % 50 === 0) process.stdout.write(`   ⏳ ${inserted} inserted...\r`);
    } catch (err: any) {
      errors.push({ name: product.name, error: err.message });
    }
  }

  console.log(`\n✅ Done! Inserted: ${inserted} | Skipped: ${skipped} | Errors: ${errors.length}`);
  const total = await prisma.product.count();
  console.log(`📊 Total products in database: ${total}\n`);

  await prisma.$disconnect();
}

seed().catch(console.error);
