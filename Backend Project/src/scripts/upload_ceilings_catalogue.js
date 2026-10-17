import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { PDFDocument, PDFName } from 'pdf-lib';
import prisma from '../shared/config/prisma.js';
import { decodeAscii85 } from './catalogUploader.js';
import { slugify } from '../shared/utils/slugify.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PDF_PATH = path.resolve('C:/Users/123ch/OneDrive/Desktop/Shiv Shakti/Catalogues/Shiv_Shakti_Complete_Tent_Ceiling_Catalogue_Enhanced_All_Screenshots.pdf');
const TEMP_IMG_DIR = path.resolve('./extracted_ceilings');

const SUB_SUBCATEGORIES = [
  'decorative-ceiling-canopies',
  'designer-fabric-ceilings',
  'floral-ceiling-panels',
  'stage-drapery-ceilings',
];

const STYLES = [
  'Royal Scalloped Velvet',
  'Concentric Silk Mandala',
  'Pleated Geometrical Draping',
  'Traditional Marigold Arch',
  'Luxury Chandelier Canopy',
  'Multi-Tier Floral Rosette',
  'Sheer Organza Radiant Dome',
  'Grand Ballroom Velvet Cascade',
];

const STANDARD_FEATURES = [
  'Commercial fire-retardant treated multi-layered luxury fabric with zero sagging',
  'Heavy-duty load-tested modular suspension rings and quick-rigging carabiners',
  'Custom tailored draping with rich fall, pleated borders, and gold tassel trims',
  'Resistant to high humidity, banquet air conditioning drafts, and warm lighting',
  'Compatible with central crystal chandeliers and LED warm-glow wash lighting',
];

async function extractAllCeilingItems() {
  if (!fs.existsSync(PDF_PATH)) {
    throw new Error(`PDF catalogue not found at: ${PDF_PATH}`);
  }

  fs.mkdirSync(TEMP_IMG_DIR, { recursive: true });

  console.log('📄 Loading PDF catalogue:', PDF_PATH);
  const pdfBytes = fs.readFileSync(PDF_PATH);
  const doc = await PDFDocument.load(pdfBytes);
  const totalPages = doc.getPageCount();
  console.log(`Total Pages in PDF: ${totalPages}`);

  const items = [];

  // =========================================================================
  // SECTION 1: Pages 2 to 28 -> SC-001 to SC-106 (106 designs)
  // =========================================================================
  console.log('\n--- Extracting Section 1: SC-001 to SC-106 from Pages 2-28 ---');
  const cropBoxes = [
    { name: 'tl', left: 105, top: 270, width: 600, height: 630 },
    { name: 'tr', left: 785, top: 270, width: 600, height: 630 },
    { name: 'bl', left: 105, top: 1130, width: 600, height: 630 },
    { name: 'br', left: 785, top: 1130, width: 600, height: 630 },
  ];

  // Section 1: Custom crop adjustments for items containing extraneous snippets/UI
  const CUSTOM_CROPS = {
    'SC-004': { left: 785, top: 1100, width: 600, height: 500 }, // Exclude corner presenter
    'SC-010': { left: 785, top: 250, width: 600, height: 260 },  // Royal mandala ceiling only
    'SC-079': { left: 105, top: 1100, width: 600, height: 610 }, // Exclude bottom text caption
    'SC-080': { left: 785, top: 1280, width: 600, height: 470 }, // Exclude top phone UI icons
    'SC-081': { left: 105, top: 360, width: 600, height: 540 },  // Exclude Exporters India header
    'SC-082': { left: 785, top: 250, width: 600, height: 530 },  // Exclude bottom Alamy caption
    'SC-085': { left: 105, top: 250, width: 600, height: 480 },  // Exclude bottom Justdial caption
    'SC-087': { left: 785, top: 1100, width: 600, height: 530 }, // Exclude bottom text caption
    'SC-096': { left: 785, top: 1100, width: 600, height: 510 }, // Exclude bottom image snippet
    'SC-097': { left: 105, top: 250, width: 600, height: 525 },  // Exclude bottom Justdial text
    'SC-098': { left: 785, top: 400, width: 600, height: 500 },  // Exclude top snippet & jhumar text
    'SC-099': { left: 105, top: 1500, width: 600, height: 230 }, // Exclude top pink banquet snippet
    'SC-102': { left: 785, top: 495, width: 600, height: 415 },  // Exclude top Tradeindia & tent snippet
    'SC-106': { left: 785, top: 550, width: 600, height: 350 },  // Exclude top Flipkart & tent snippet
  };

  let scIndex = 1;
  for (let pIdx = 1; pIdx <= 27; pIdx++) {
    const page = doc.getPage(pIdx);
    const xObj = doc.context.lookup(page.node.Resources().get(PDFName.of('XObject')));
    const [k, v] = xObj.entries()[0];
    const stream = doc.context.lookup(v);
    const rawBytes = stream.getContents();
    const pageJpegBuffer = decodeAscii85(Buffer.from(rawBytes).toString('latin1'));

    const itemsOnPage = (pIdx === 27) ? 2 : 4;
    for (let cIdx = 0; cIdx < itemsOnPage; cIdx++) {
      const codeNum = String(scIndex).padStart(3, '0');
      const code = `SC-${codeNum}`;
      const sku = `SKU-CEIL-${code}`;
      const name = `Shiv Shakti Decorative Ceiling Canopy ${code}`;
      const outFileName = `cat_ceil_sc${codeNum}.jpg`;
      const outFilePath = path.join(TEMP_IMG_DIR, outFileName);

      const box = CUSTOM_CROPS[code] || cropBoxes[cIdx];
      await sharp(pageJpegBuffer)
        .extract(box)
        .jpeg({ quality: 90 })
        .toFile(outFilePath);

      items.push({
        series: 'SC',
        index: scIndex,
        code,
        sku,
        name,
        localPath: outFilePath,
        publicId: `cat_ceil_sc${codeNum}`,
      });

      scIndex++;
    }
  }
  console.log(`✅ Extracted ${items.length} items from Section 1 (SC-001 to SC-106).`);

  // =========================================================================
  // SECTION 2: Pages 29 to 53 -> CT-107 to CT-204 (98 designs)
  // =========================================================================
  console.log('\n--- Extracting Section 2: CT-107 to CT-204 from Pages 29-53 ---');
  let ctCount = 0;
  for (let pIdx = 28; pIdx < totalPages; pIdx++) {
    const page = doc.getPage(pIdx);
    const contents = page.node.Contents();
    const stream = doc.context.lookup(contents);
    const raw = Buffer.from(stream.getContents());
    const a85 = decodeAscii85(raw.toString('latin1'));
    const inf = zlib.inflateSync(a85).toString('utf8');

    const blockRegex = /\/(FormXob\.[a-f0-9]+)\s+Do[\s\S]*?\((CT-\d+)\)\s*Tj/g;
    let match;
    const xObj = doc.context.lookup(page.node.Resources().get(PDFName.of('XObject')));

    while ((match = blockRegex.exec(inf)) !== null) {
      const formName = match[1];
      const ctCode = match[2]; // e.g. "CT-107"
      const numOnly = ctCode.replace('CT-', '');
      const target = doc.context.lookup(xObj.get(PDFName.of(formName)));
      const w = target.dict.get(PDFName.of('Width')).asNumber();
      const h = target.dict.get(PDFName.of('Height')).asNumber();
      const rawBytes = target.getContents();
      const decoded = decodeAscii85(Buffer.from(rawBytes).toString('latin1'));
      const uncompressed = zlib.inflateSync(decoded);

      const outFileName = `cat_ceil_ct${numOnly}.jpg`;
      const outFilePath = path.join(TEMP_IMG_DIR, outFileName);

      await sharp(uncompressed, { raw: { width: w, height: h, channels: 3 } })
        .jpeg({ quality: 90 })
        .toFile(outFilePath);

      items.push({
        series: 'CT',
        index: parseInt(numOnly, 10),
        code: ctCode,
        sku: `SKU-CEIL-${ctCode}`,
        name: `Shiv Shakti Royal Tent Ceiling Design ${ctCode}`,
        localPath: outFilePath,
        publicId: `cat_ceil_ct${numOnly}`,
      });

      ctCount++;
    }
  }
  console.log(`✅ Extracted ${ctCount} items from Section 2 (CT-107 to CT-204).`);
  console.log(`\n🎉 Total Extracted Catalogue Designs: ${items.length} items.\n`);

  return items;
}

async function uploadToCloudinary(item, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await cloudinary.uploader.upload(item.localPath, {
        folder: 'shiv-shakti-ceilings',
        public_id: item.publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      });
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = attempt * 1500;
      console.warn(`  ⚠️ Retry ${attempt} for ${item.code} in ${delay}ms: ${err.message}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function runPipeline() {
  console.log('========================================================');
  console.log('🚀 SHIV SHAKTI CEILINGS CATALOGUE INGESTION PIPELINE');
  console.log('========================================================');

  // Step 1: Extract all items
  const items = await extractAllCeilingItems();

  // Step 2: Upload to Cloudinary in parallel batches
  console.log(`☁️ Uploading ${items.length} items to Cloudinary (Folder: 'shiv-shakti-ceilings')...`);
  const concurrency = 5;
  let successCount = 0;
  let currentIndex = 0;

  async function uploadWorker(workerId) {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      const item = items[idx];
      try {
        const uploadRes = await uploadToCloudinary(item);
        item.cloudinaryUrl = uploadRes.secure_url;
        item.cloudinaryPublicId = uploadRes.public_id;
        successCount++;
        const percent = Math.round((successCount / items.length) * 100);
        console.log(`  [${percent}%] (${successCount}/${items.length}) ☁️ Uploaded ${item.code} -> ${uploadRes.secure_url}`);
      } catch (uploadErr) {
        console.error(`  ❌ Failed uploading ${item.code}:`, uploadErr.message);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, (_, i) => uploadWorker(i + 1));
  await Promise.all(workers);
  console.log(`\n✅ Finished Cloudinary upload: ${successCount}/${items.length} uploaded successfully!\n`);

  // Step 3: Clean up old duplicate/partial ceiling products from DB
  console.log('🧹 Cleaning up old partial/duplicate ceiling records in database...');
  const existingCeilings = await prisma.product.findMany({
    where: { subcategoryId: 'ceilings' },
    select: { id: true, sku: true },
  });
  console.log(`Found ${existingCeilings.length} existing ceiling products to replace.`);

  // Delete product images first, then products
  const existingIds = existingCeilings.map(c => c.id);
  if (existingIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: { in: existingIds } },
    });
    await prisma.productFilterValue.deleteMany({
      where: { productId: { in: existingIds } },
    });
    await prisma.productBadge.deleteMany({
      where: { productId: { in: existingIds } },
    });
    await prisma.product.deleteMany({
      where: { id: { in: existingIds } },
    });
    console.log(`✅ Removed ${existingIds.length} legacy ceiling products.`);
  }

  // Step 4: Upsert all 204 new products into PostgreSQL database
  console.log(`\n📦 Upserting ${items.length} clean ceiling products into PostgreSQL database...`);
  let dbCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.cloudinaryUrl) {
      console.warn(`  ⚠️ Skipping DB upsert for ${item.code} (no Cloudinary URL)`);
      continue;
    }

    const subSub = SUB_SUBCATEGORIES[i % SUB_SUBCATEGORIES.length];
    const style = STYLES[i % STYLES.length];
    const basePrice = 24500 + ((i * 350) % 15000);
    const compareAt = Math.round(basePrice * 1.25);
    const rating = +(4.8 + ((i % 3) * 0.1)).toFixed(1);
    const reviews = 15 + ((i * 7) % 30);
    const slug = `shiv-shakti-${slugify(item.name)}-${slugify(item.code)}`;

    const productRecord = await prisma.product.create({
      data: {
        sku: item.sku,
        name: item.name,
        slug,
        categoryId: 'wedding',
        subcategoryId: 'ceilings',
        subSubcategoryId: subSub,
        style,
        price: basePrice,
        compareAtPrice: compareAt,
        pricingUnit: 'AREA_SQFT',
        areaMode: 'sqft',
        rating,
        reviews,
        image: item.cloudinaryUrl,
        description: `${item.name} (${item.code}) — Bespoke handcrafted luxury wedding ceiling decor featuring fire-retardant premium fabric draping, structural steel suspension hooks, and photogenic ambient symmetry engineered for royal Indian wedding mandaps and banquet ballrooms.`,
        features: STANDARD_FEATURES,
        inStock: true,
        status: 'PUBLISHED',
        sortPriority: item.series === 'CT' ? 10 : 5,
        seoTitle: `${item.name} | Shiv Shakti Events Mart`,
        seoDescription: `Wholesale manufacturer supply of ${item.name} (${item.code}). Premium fire-retardant tent ceiling draping canopy for luxury Indian weddings.`,
        seoKeywords: `${item.name}, ${item.code}, tent ceiling design, wedding ceiling canopy, Shiv Shakti Events`,
        images: {
          create: [
            {
              url: item.cloudinaryUrl,
              publicId: item.cloudinaryPublicId || item.publicId,
              altText: item.name,
              sortOrder: 0,
              type: 'gallery',
              isPrimary: true,
            },
          ],
        },
      },
    });

    dbCount++;
    if (dbCount % 25 === 0 || dbCount === items.length) {
      console.log(`  [${Math.round((dbCount / items.length) * 100)}%] (${dbCount}/${items.length}) 💾 DB Synced: ${productRecord.sku}`);
    }
  }

  console.log('\n========================================================');
  console.log('🎉 PIPELINE COMPLETED SUCCESSFULLY!');
  console.log(`✅ Extracted:     ${items.length} ceiling designs`);
  console.log(`☁️ Cloudinary:    ${successCount} images uploaded in Full HD`);
  console.log(`💾 Neon Database: ${dbCount} products pushed to Dashboard`);
  console.log('========================================================\n');

  // Clean up temporary extracted image files to save disk space
  console.log('🧹 Cleaning up local extracted temporary files...');
  if (fs.existsSync(TEMP_IMG_DIR)) {
    fs.rmSync(TEMP_IMG_DIR, { recursive: true, force: true });
    console.log('✅ Temporary image directory removed.');
  }

  await prisma.$disconnect();
}

runPipeline().catch((err) => {
  console.error('❌ Pipeline failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
