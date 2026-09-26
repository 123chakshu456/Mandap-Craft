/**
 * ============================================================================
 * UNIFIED CATALOG & MEDIA UPLOADER (Shiv Shakti Events Mart)
 * ============================================================================
 * 
 * A robust, all-in-one ingestion engine for uploading PDF catalogues and photos
 * to Cloudinary and synchronizing them directly into the PostgreSQL database.
 * 
 * Features:
 * 1. Pre-flight Cloudinary quota & credits inspection.
 * 2. High-performance PDF image extraction (ASCII85 / Flate / FormXObject).
 * 3. Direct photo ingestion from local image directories or single files.
 * 4. Automatic taxonomy validation (Category -> Subcategory -> Sub-subcategory).
 * 5. Idempotent PostgreSQL product upserting via Prisma (safe to re-run).
 * 6. Concurrency worker pool with exponential backoff retries.
 * 7. Comprehensive summary reports and Cloudinary credit auditing.
 * 
 * CLI Usage Examples:
 *   - Check Cloudinary Credits:
 *       node src/scripts/catalogUploader.js --check-credits
 * 
 *   - Upload a PDF Catalogue:
 *       node src/scripts/catalogUploader.js --pdf "Catalogues/My_Catalogue.pdf" --category wedding --subcategory mandaps --sub-subcategory fiber-mandaps
 * 
 *   - Upload Photos from a Folder:
 *       node src/scripts/catalogUploader.js --photos "Catalogues/NewPhotos" --category catering --subcategory serving-items
 * 
 * ============================================================================
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { v2 as cloudinary } from 'cloudinary';
import { PDFDocument, PDFName } from 'pdf-lib';
import prisma from '../shared/config/prisma.js';
import { slugify } from '../shared/utils/slugify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default directory paths
const LOCAL_CATALOGUE_DIR = path.resolve(__dirname, '../../../Project/Shiv-Shakti-Events-Mart/public/catalogue');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Robust ASCII85 stream decoder for embedded PDF objects
 * @param {string} input
 * @returns {Buffer}
 */
export function decodeAscii85(input) {
  let str = input.replace(/\s+/g, '');
  if (str.startsWith('<~')) str = str.slice(2);
  if (str.endsWith('~>')) str = str.slice(0, -2);
  if (str.endsWith('~')) str = str.slice(0, -1);

  const out = [];
  let tuple = 0;
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 122 && count === 0) {
      out.push(0, 0, 0, 0);
      continue;
    }
    if (c < 33 || c > 117) continue;

    tuple = tuple * 85 + (c - 33);
    count++;

    if (count === 5) {
      out.push(
        (tuple >>> 24) & 255,
        (tuple >>> 16) & 255,
        (tuple >>> 8) & 255,
        tuple & 255
      );
      tuple = 0;
      count = 0;
    }
  }

  if (count > 1) {
    for (let i = count; i < 5; i++) {
      tuple = tuple * 85 + 84;
    }
    for (let i = 0; i < count - 1; i++) {
      out.push((tuple >>> (24 - i * 8)) & 255);
    }
  }

  return Buffer.from(out);
}

/**
 * Check Cloudinary credit balance, bandwidth, and storage quotas
 * @returns {Promise<{ usage: number, limit: number, usedPercent: number, safeToUpload: boolean }>}
 */
export async function checkCloudinaryCredits() {
  try {
    const usage = await cloudinary.api.usage();
    const credits = usage.credits || {};
    const used = credits.usage || 0;
    const limit = credits.limit || 25;
    const percent = credits.used_percent || ((used / limit) * 100);

    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│ ☁️  CLOUDINARY USAGE & QUOTA AUDIT                     │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│ Plan:              ${(usage.plan || 'Free').padEnd(35)} │`);
    console.log(`│ Credits Used:      ${`${used.toFixed(2)} / ${limit} credits (${percent.toFixed(1)}%)`.padEnd(35)} │`);
    console.log(`│ Storage:           ${`${((usage.storage?.usage || 0) / 1024 / 1024).toFixed(1)} MB`.padEnd(35)} │`);
    console.log(`│ Bandwidth:         ${`${((usage.bandwidth?.usage || 0) / 1024 / 1024).toFixed(1)} MB`.padEnd(35)} │`);
    console.log(`│ Transformations:   ${`${usage.transformations?.usage || 0}`.padEnd(35)} │`);
    console.log('└────────────────────────────────────────────────────────┘\n');

    const safeToUpload = percent < 90;
    if (!safeToUpload) {
      console.warn('⚠️ WARNING: Cloudinary account has reached over 90% of credit quota!');
    }
    return { usage: used, limit, usedPercent: percent, safeToUpload };
  } catch (err) {
    console.warn('⚠️ Could not verify Cloudinary usage quota:', err.message);
    return { usage: 0, limit: 25, usedPercent: 0, safeToUpload: true };
  }
}

/**
 * Extract embedded product images and text blocks from a PDF catalogue
 * @param {string} pdfPath
 * @param {string} prefix
 * @returns {Promise<Array<{ page: number, itemOnPage: number, title: string, code: string, localFilePath: string, fileSizeBytes: number }>>}
 */
export async function extractPdfCatalogueItems(pdfPath, prefix = 'cat') {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found at: ${pdfPath}`);
  }

  fs.mkdirSync(LOCAL_CATALOGUE_DIR, { recursive: true });

  const pdfBytes = fs.readFileSync(pdfPath);
  const doc = await PDFDocument.load(pdfBytes);
  const totalPages = doc.getPageCount();
  const items = [];

  console.log(`📄 Scanning PDF "${path.basename(pdfPath)}" (${totalPages} pages)...`);

  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const page = doc.getPage(pIdx);
    const contents = page.node.Contents();
    if (!contents) continue;

    const stream = doc.context.lookup(contents);
    if (!stream) continue;

    let inflated = '';
    try {
      const raw = Buffer.from(stream.getContents()).toString('latin1');
      const a85 = decodeAscii85(raw);
      inflated = zlib.inflateSync(a85).toString('utf8');
    } catch {
      continue;
    }

    const resources = page.node.Resources();
    const xObject = resources ? resources.get(PDFName.of('XObject')) : null;
    const xObjectDict = xObject ? doc.context.lookup(xObject) : null;
    if (!xObjectDict) continue;

    const blockRegex = /\/(FormXob\.[a-f0-9]+)\s+Do[\s\S]*?Tm\s*\(([^)]+)\)\s*Tj[\s\S]*?Tm\s*\(([^)]+)\)\s*Tj/g;
    let match;
    let itemOnPage = 0;

    while ((match = blockRegex.exec(inflated)) !== null) {
      itemOnPage++;
      const formName = match[1];
      const title = match[2].trim();
      const code = match[3].trim();

      const formStreamRef = xObjectDict.get(PDFName.of(formName));
      const formStream = doc.context.lookup(formStreamRef);
      if (!formStream) continue;

      try {
        const formRaw = Buffer.from(formStream.getContents()).toString('latin1');
        const jpegBuffer = decodeAscii85(formRaw);

        const safeCode = slugify(code || `item-${itemOnPage}`);
        const safeTitle = slugify(title || `page-${pIdx + 1}`);
        const filename = `cat_${prefix}_p${pIdx + 1}_${itemOnPage}_${safeCode}_${safeTitle}.jpg`;
        const localFilePath = path.join(LOCAL_CATALOGUE_DIR, filename);

        fs.writeFileSync(localFilePath, jpegBuffer);

        items.push({
          page: pIdx + 1,
          itemOnPage,
          title: title || `Product ${code || itemOnPage}`,
          code: code || `P${pIdx + 1}-${itemOnPage}`,
          filename,
          localFilePath,
          fileSizeBytes: jpegBuffer.length,
        });
      } catch (extractErr) {
        console.warn(`  ⚠️ Failed extracting image for item ${itemOnPage} on page ${pIdx + 1}:`, extractErr.message);
      }
    }
  }

  console.log(`✅ Extracted ${items.length} product photos from PDF.\n`);
  return items;
}

/**
 * Scan a directory of standalone photos (.jpg, .jpeg, .png, .webp)
 * @param {string} dirPath
 * @returns {Array<{ originalFile: string, localFilePath: string, fileSizeBytes: number }>}
 */
export function scanPhotoDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const stat = fs.statSync(dirPath);

  if (!stat.isDirectory()) {
    const ext = path.extname(dirPath).toLowerCase();
    if (validExts.includes(ext)) {
      return [{
        originalFile: path.basename(dirPath),
        localFilePath: dirPath,
        fileSizeBytes: stat.size,
      }];
    }
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const items = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (validExts.includes(ext)) {
      const fullPath = path.join(dirPath, file);
      const fileStat = fs.statSync(fullPath);
      items.push({
        originalFile: file,
        localFilePath: fullPath,
        fileSizeBytes: fileStat.size,
      });
    }
  }

  return items;
}

/**
 * Ensure category hierarchy exists in the database
 * @param {Array<{ id: string, name: string, slug?: string, parentId?: string, level: number }>} categories
 */
export async function ensureCategories(categories = []) {
  if (!categories || categories.length === 0) return;

  console.log(`📁 Verifying ${categories.length} taxonomy categories in database...`);
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug || slugify(cat.id),
        parentId: cat.parentId || null,
        level: cat.level || 1,
        isActive: true,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || slugify(cat.id),
        shortTitle: cat.shortTitle || cat.name,
        tagline: cat.tagline || `Luxury Event & Wedding ${cat.name}`,
        description: cat.description || `Commercial wholesale wedding supplies, banquet hardware, and event decor in ${cat.name}.`,
        parentId: cat.parentId || null,
        level: cat.level || 1,
        sortOrder: cat.sortOrder || 1,
        isActive: true,
      },
    });
  }
  console.log('✅ Taxonomy categories verified.\n');
}

/**
 * Upload single image to Cloudinary with retry
 * @param {string} localFilePath
 * @param {string} folder
 * @param {number} maxRetries
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function uploadToCloudinaryWithRetry(localFilePath, folder = 'shiv-shakti-products', maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      const res = await cloudinary.uploader.upload(localFilePath, {
        folder,
        use_filename: true,
        unique_filename: true,
        resource_type: 'image',
      });
      return res;
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`  ⚠️ Upload attempt ${attempt} failed, retrying in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/**
 * Upsert a single product and primary image into the database
 * @param {Object} product
 * @returns {Promise<Object>}
 */
export async function upsertProductRecord(product) {
  const {
    sku,
    name,
    slug,
    categoryId,
    subcategoryId = null,
    subSubcategoryId = null,
    style = 'Modern',
    price = 1000,
    compareAtPrice = null,
    rating = 4.8,
    reviews = 25,
    imageUrl,
    publicId = '',
    description = '',
    features = [],
    seoTitle,
    seoDescription,
    seoKeywords,
  } = product;

  const dbProduct = await prisma.product.upsert({
    where: { sku },
    update: {
      name,
      slug: slug || slugify(name),
      categoryId,
      subcategoryId,
      subSubcategoryId,
      style,
      price,
      compareAtPrice: compareAtPrice || Math.round(price * 1.25),
      rating,
      reviews,
      image: imageUrl,
      description: description || `Shiv Shakti ${name} — Professional wholesale event decor and catering equipment.`,
      features: features.length > 0 ? features : ['Commercial grade durability', 'Heavy-duty construction', 'Wholesale pricing direct from manufacturer'],
      inStock: true,
      status: 'PUBLISHED',
      seoTitle: seoTitle || `${name} | Shiv Shakti Events Mart`,
      seoDescription: seoDescription || description.slice(0, 160),
      seoKeywords: seoKeywords || `${name}, wedding decor, event supplies, Shiv Shakti`,
      updatedAt: new Date(),
    },
    create: {
      sku,
      name,
      slug: slug || slugify(name),
      categoryId,
      subcategoryId,
      subSubcategoryId,
      style,
      price,
      compareAtPrice: compareAtPrice || Math.round(price * 1.25),
      rating,
      reviews,
      image: imageUrl,
      description: description || `Shiv Shakti ${name} — Professional wholesale event decor and catering equipment.`,
      features: features.length > 0 ? features : ['Commercial grade durability', 'Heavy-duty construction', 'Wholesale pricing direct from manufacturer'],
      inStock: true,
      status: 'PUBLISHED',
      seoTitle: seoTitle || `${name} | Shiv Shakti Events Mart`,
      seoDescription: seoDescription || description.slice(0, 160),
      seoKeywords: seoKeywords || `${name}, wedding decor, event supplies, Shiv Shakti`,
      images: {
        create: [
          {
            url: imageUrl,
            publicId,
            altText: name,
            sortOrder: 0,
            type: 'gallery',
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Ensure primary image is updated if it exists
  const existingImg = await prisma.productImage.findFirst({
    where: { productId: dbProduct.id, isPrimary: true },
  });

  if (existingImg) {
    await prisma.productImage.update({
      where: { id: existingImg.id },
      data: { url: imageUrl, publicId, altText: name },
    });
  }

  return dbProduct;
}

/**
 * Execute concurrent batch ingestion of products
 * @param {Array<Object>} productsList
 * @param {number} concurrency
 * @returns {Promise<{ successCount: number, errorCount: number, errors: Array }>}
 */
export async function executeBatchIngestion(productsList, concurrency = 4) {
  console.log(`🚀 Starting batch ingestion of ${productsList.length} items (concurrency: ${concurrency})...`);
  const startTime = Date.now();
  let currentIndex = 0;
  let successCount = 0;
  const errors = [];

  async function worker(workerId) {
    while (currentIndex < productsList.length) {
      const idx = currentIndex++;
      const item = productsList[idx];

      try {
        let imageUrl = item.image || item.imageUrl;
        let publicId = item.publicId || '';

        // If local file path provided, upload to Cloudinary
        if (item.localFilePath && fs.existsSync(item.localFilePath)) {
          const uploadRes = await uploadToCloudinaryWithRetry(item.localFilePath, 'shiv-shakti-products');
          imageUrl = uploadRes.secure_url;
          publicId = uploadRes.public_id;
        }

        if (!imageUrl) {
          throw new Error(`No image URL or local file path found for SKU: ${item.sku}`);
        }

        await upsertProductRecord({
          ...item,
          imageUrl,
          publicId,
        });

        successCount++;
        const percent = Math.round((successCount / productsList.length) * 100);
        console.log(`  [${percent}%] (${successCount}/${productsList.length}) ✅ ${item.sku} — ${item.name.slice(0, 45)}`);
      } catch (err) {
        errors.push({ sku: item.sku, name: item.name, error: err.message });
        console.error(`  ❌ Failed item ${item.sku}:`, err.message);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n========================================================');
  console.log('🎉 INGESTION RUN FINISHED');
  console.log(`⏱️  Duration:           ${durationSec}s`);
  console.log(`✅ Success:            ${successCount} / ${productsList.length}`);
  console.log(`❌ Errors:             ${errors.length}`);
  console.log('========================================================\n');

  // Final Cloudinary credit audit
  await checkCloudinaryCredits();

  return { successCount, errorCount: errors.length, errors };
}

// ============================================================================
// CLI DISPATCHER
// ============================================================================
async function runCli() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
Shiv Shakti Events Mart — Unified Catalog Ingestion Tool

Usage:
  node src/scripts/catalogUploader.js [options]

Options:
  --check-credits                  Check Cloudinary credits, bandwidth & storage
  --pdf <path>                     Path to PDF catalogue to extract & upload
  --prefix <str>                   Filename prefix for PDF extraction (default: 'cat')
  --photos <dir_or_file>           Path to image file or directory of photos to upload
  --category <id>                  Level 1 Category ID (e.g. 'wedding', 'catering', 'event-essentials')
  --subcategory <id>               Level 2 Subcategory ID (e.g. 'mandaps', 'serving-items')
  --sub-subcategory <id>           Level 3 Micro-category ID (e.g. 'fiber-mandaps')
  --sku-prefix <str>               Custom SKU prefix (e.g. 'SSM-CAT')
  --price <num>                    Default base price if not specified
  --concurrency <num>              Concurrent upload workers (default: 4)

Examples:
  node src/scripts/catalogUploader.js --check-credits
  node src/scripts/catalogUploader.js --photos "Catalogues" --category catering --subcategory serving-items
    `);
    process.exit(0);
  }

  if (args.includes('--check-credits')) {
    await checkCloudinaryCredits();
    process.exit(0);
  }

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
  };

  const pdfPath = getArg('--pdf');
  const photosPath = getArg('--photos');
  const categoryId = getArg('--category') || 'wedding';
  const subcategoryId = getArg('--subcategory') || null;
  const subSubcategoryId = getArg('--sub-subcategory') || null;
  const prefix = getArg('--prefix') || 'cat';
  const skuPrefix = getArg('--sku-prefix') || 'SKU';
  const basePrice = parseInt(getArg('--price') || '2500', 10);
  const concurrency = parseInt(getArg('--concurrency') || '4', 10);

  // Pre-flight quota check
  const quota = await checkCloudinaryCredits();
  if (!quota.safeToUpload) {
    console.error('❌ Aborting upload: Cloudinary credit quota exceeded 90%.');
    process.exit(1);
  }

  const productsList = [];

  if (pdfPath) {
    const extracted = await extractPdfCatalogueItems(path.resolve(process.cwd(), pdfPath), prefix);
    extracted.forEach((item, idx) => {
      const codeClean = (item.code || `P${idx + 1}`).replace(/[\s\-_]/g, '').toUpperCase();
      productsList.push({
        sku: `${skuPrefix}-${codeClean}`,
        name: `Shiv Shakti ${item.title}`,
        slug: `shiv-shakti-${slugify(item.title)}-${slugify(codeClean)}`,
        categoryId,
        subcategoryId,
        subSubcategoryId,
        price: basePrice,
        compareAtPrice: Math.round(basePrice * 1.25),
        localFilePath: item.localFilePath,
      });
    });
  } else if (photosPath) {
    const scanned = scanPhotoDirectory(path.resolve(process.cwd(), photosPath));
    scanned.forEach((item, idx) => {
      const cleanName = path.basename(item.originalFile, path.extname(item.originalFile))
        .replace(/[_\-]+/g, ' ')
        .trim();
      const codeClean = `PH${idx + 1}`;
      productsList.push({
        sku: `${skuPrefix}-${codeClean}`,
        name: `Shiv Shakti ${cleanName}`,
        slug: `shiv-shakti-${slugify(cleanName)}`,
        categoryId,
        subcategoryId,
        subSubcategoryId,
        price: basePrice,
        compareAtPrice: Math.round(basePrice * 1.25),
        localFilePath: item.localFilePath,
      });
    });
  }

  if (productsList.length === 0) {
    console.log('⚠️ No items found to upload. Please specify --pdf or --photos with a valid file or folder.');
    process.exit(0);
  }

  await executeBatchIngestion(productsList, concurrency);
  await prisma.$disconnect();
}

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('catalogUploader.js')) {
  runCli().catch((err) => {
    console.error('Fatal upload error:', err);
    prisma.$disconnect();
    process.exit(1);
  });
}
