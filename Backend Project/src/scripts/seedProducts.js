/**
 * SEED SCRIPT — Migrates all products from products_seed.json into the PostgreSQL database.
 * Run once with: node src/scripts/seedProducts.js
 *
 * First run: npx tsx src/scripts/extract.ts  (generates products_seed.json)
 * Then run:  node src/scripts/seedProducts.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// -------------------------------------------------------
// Step 1: Load the pre-extracted products JSON
// -------------------------------------------------------
const jsonPath = join(__dirname, 'products_seed.json');

if (!existsSync(jsonPath)) {
  console.error('❌ products_seed.json not found. Run: npx tsx src/scripts/extract.ts first.');
  process.exit(1);
}

const CATALOG_PRODUCTS = JSON.parse(readFileSync(jsonPath, 'utf8'));
console.log(`📂 Loaded ${CATALOG_PRODUCTS.length} products from JSON.`);



// -------------------------------------------------------
// Step 2: Insert into database via Prisma
// -------------------------------------------------------
const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('\n🌱 Starting database seed...\n');

    // Check existing count
    const existing = await prisma.product.count();
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} products.`);
      console.log('   To re-seed, manually run: DELETE FROM products; in your DB first.\n');
    }

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const product of CATALOG_PRODUCTS) {
      try {
        // Check if product with this "legacy" id already exists (by name + category)
        const exists = await prisma.product.findFirst({
          where: { name: product.name, categoryId: product.categoryId },
        });

        if (exists) {
          skipped++;
          continue;
        }

        await prisma.product.create({
          data: {
            name: product.name,
            categoryId: product.categoryId,
            subcategoryId: product.subcategoryId,
            style: product.style || 'Traditional',
            price: parseFloat(product.price) || 0,
            rating: parseFloat(product.rating) || 4.5,
            reviews: parseInt(product.reviews) || 0,
            image: product.image || '',
            description: product.description || '',
            features: Array.isArray(product.features) ? product.features : [],
            isFeatured: product.isFeatured || false,
            tag: product.tag || null,
            inStock: true,
          },
        });
        inserted++;

        if (inserted % 50 === 0) {
          console.log(`   ⏳ Inserted ${inserted} products so far...`);
        }
      } catch (err) {
        errors.push({ name: product.name, error: err.message });
      }
    }

    console.log('\n✅ Seed complete!');
    console.log(`   📦 Inserted:  ${inserted} new products`);
    console.log(`   ⏭️  Skipped:   ${skipped} (already existed)`);
    if (errors.length > 0) {
      console.log(`   ❌ Errors:    ${errors.length}`);
      errors.forEach(e => console.log(`      - ${e.name}: ${e.error}`));
    }

    const total = await prisma.product.count();
    console.log(`\n📊 Total products in database: ${total}\n`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
