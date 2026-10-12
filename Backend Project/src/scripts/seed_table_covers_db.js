import dotenv from 'dotenv';
dotenv.config();

import prisma from '../shared/config/prisma.js';

async function seedTableCovers() {
  console.log('📦 Upserting Wedding Table Covers category & products into database...');

  // 1. Level 2 Category: table-covers under wedding
  const tableCoversCategory = await prisma.category.upsert({
    where: { id: 'table-covers' },
    update: {
      name: 'Wedding Table Covers',
      shortTitle: 'Table Covers',
      slug: 'wedding-table-covers',
      tagline: 'Royal Round Table Linens & Velvet Overlays',
      description: 'Luxury Round Banquet Table Covers, Velvet Overlays & Royal Wedding Table Linens',
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836830/shiv-shakti-categories/wedding_table_covers_banner.jpg',
      popularItems: [
        'Yellow Top Round Table Cover',
        'Green Velvet Overlay Table Cover',
        'Round Table Cover Collection',
        'Velvet Overlay Linen'
      ],
      parentId: 'wedding',
      level: 2,
      sortOrder: 8,
      isActive: true,
    },
    create: {
      id: 'table-covers',
      name: 'Wedding Table Covers',
      shortTitle: 'Table Covers',
      slug: 'wedding-table-covers',
      tagline: 'Royal Round Table Linens & Velvet Overlays',
      description: 'Luxury Round Banquet Table Covers, Velvet Overlays & Royal Wedding Table Linens',
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836830/shiv-shakti-categories/wedding_table_covers_banner.jpg',
      popularItems: [
        'Yellow Top Round Table Cover',
        'Green Velvet Overlay Table Cover',
        'Round Table Cover Collection',
        'Velvet Overlay Linen'
      ],
      parentId: 'wedding',
      level: 2,
      sortOrder: 8,
      isActive: true,
    },
  });
  console.log('✅ Level 2 Category upserted:', tableCoversCategory.id, tableCoversCategory.name);

  // 2. Level 3 Category: round-table-covers under table-covers
  const roundTableCoversL3 = await prisma.category.upsert({
    where: { id: 'round-table-covers' },
    update: {
      name: 'Round Table Covers',
      shortTitle: 'Round Covers',
      slug: 'wedding-round-table-covers',
      description: 'Handcrafted Round Table Linen Series with Pleated Frills & Royal Velvet Overlays',
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836822/shiv-shakti-products/cat_wedding_table_cover_yellow_top_gl_tc_001.jpg',
      parentId: 'table-covers',
      level: 3,
      sortOrder: 1,
      isActive: true,
    },
    create: {
      id: 'round-table-covers',
      name: 'Round Table Covers',
      shortTitle: 'Round Covers',
      slug: 'wedding-round-table-covers',
      description: 'Handcrafted Round Table Linen Series with Pleated Frills & Royal Velvet Overlays',
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836822/shiv-shakti-products/cat_wedding_table_cover_yellow_top_gl_tc_001.jpg',
      parentId: 'table-covers',
      level: 3,
      sortOrder: 1,
      isActive: true,
    },
  });
  console.log('✅ Level 3 Category upserted:', roundTableCoversL3.id, roundTableCoversL3.name);

  // 3. Upsert Product 1 (GL-TC-001)
  const product1 = await prisma.product.upsert({
    where: { sku: 'GL-TC-001' },
    update: {
      name: 'Yellow Top Round Table Cover',
      slug: 'yellow-top-round-table-cover-gl-tc-001',
      categoryId: 'wedding',
      subcategoryId: 'table-covers',
      subSubcategoryId: 'round-table-covers',
      style: 'Traditional',
      price: 1850,
      compareAtPrice: 2400,
      pricingUnit: 'PIECE',
      rating: 4.9,
      reviews: 28,
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836822/shiv-shakti-products/cat_wedding_table_cover_yellow_top_gl_tc_001.jpg',
      description: 'Shiv Shakti Yellow Top Round Table Cover (GL-TC-001) — Premium commercial-grade round banquet table cover tailored with a radiant golden-yellow round top and rich ethnic printed pleated frill skirting. Specially crafted for Indian wedding mandaps, haldi ceremonies, banquet halls, and royal dining setups.',
      features: [
        'Designed for standard 5ft to 6ft diameter round banquet tables',
        'Full floor-length pleated skirt with festive Indian heritage border motif',
        'Durable, colorfast, stain-resistant premium event fabric',
        'Smooth non-slip top surface engineered for banquet dining and floral centerpieces',
        'Industrial laundry safe with high wrinkle resistance'
      ],
      isFeatured: true,
      tag: 'New Launch',
      inStock: true,
      status: 'PUBLISHED',
      sortPriority: 10,
      seoTitle: 'Yellow Top Round Table Cover (GL-TC-001) | Shiv Shakti Events Mart',
      seoDescription: 'Wholesale Yellow Top Round Table Cover for weddings, mandaps, and banquets. Features radiant golden top and pleated festive border skirting.',
      seoKeywords: 'Yellow Top Round Table Cover, GL-TC-001, wedding table cover, banquet linen, round table cover, Shiv Shakti',
    },
    create: {
      sku: 'GL-TC-001',
      name: 'Yellow Top Round Table Cover',
      slug: 'yellow-top-round-table-cover-gl-tc-001',
      categoryId: 'wedding',
      subcategoryId: 'table-covers',
      subSubcategoryId: 'round-table-covers',
      style: 'Traditional',
      price: 1850,
      compareAtPrice: 2400,
      pricingUnit: 'PIECE',
      rating: 4.9,
      reviews: 28,
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836822/shiv-shakti-products/cat_wedding_table_cover_yellow_top_gl_tc_001.jpg',
      description: 'Shiv Shakti Yellow Top Round Table Cover (GL-TC-001) — Premium commercial-grade round banquet table cover tailored with a radiant golden-yellow round top and rich ethnic printed pleated frill skirting. Specially crafted for Indian wedding mandaps, haldi ceremonies, banquet halls, and royal dining setups.',
      features: [
        'Designed for standard 5ft to 6ft diameter round banquet tables',
        'Full floor-length pleated skirt with festive Indian heritage border motif',
        'Durable, colorfast, stain-resistant premium event fabric',
        'Smooth non-slip top surface engineered for banquet dining and floral centerpieces',
        'Industrial laundry safe with high wrinkle resistance'
      ],
      isFeatured: true,
      tag: 'New Launch',
      inStock: true,
      status: 'PUBLISHED',
      sortPriority: 10,
      seoTitle: 'Yellow Top Round Table Cover (GL-TC-001) | Shiv Shakti Events Mart',
      seoDescription: 'Wholesale Yellow Top Round Table Cover for weddings, mandaps, and banquets. Features radiant golden top and pleated festive border skirting.',
      seoKeywords: 'Yellow Top Round Table Cover, GL-TC-001, wedding table cover, banquet linen, round table cover, Shiv Shakti',
    },
  });

  // Primary image for Product 1
  await prisma.productImage.deleteMany({ where: { productId: product1.id } });
  await prisma.productImage.create({
    data: {
      productId: product1.id,
      url: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836822/shiv-shakti-products/cat_wedding_table_cover_yellow_top_gl_tc_001.jpg',
      publicId: 'shiv-shakti-products/cat_wedding_table_cover_yellow_top_gl_tc_001',
      altText: 'Yellow Top Round Table Cover (GL-TC-001)',
      isPrimary: true,
      sortOrder: 0,
      type: 'gallery',
    },
  });
  console.log('✅ Product 1 upserted:', product1.name, product1.sku);

  // 4. Upsert Product 2 (GL-TC-002)
  const product2 = await prisma.product.upsert({
    where: { sku: 'GL-TC-002' },
    update: {
      name: 'Green Velvet Overlay Table Cover',
      slug: 'green-velvet-overlay-table-cover-gl-tc-002',
      categoryId: 'wedding',
      subcategoryId: 'table-covers',
      subSubcategoryId: 'round-table-covers',
      style: 'Luxury Velvet',
      price: 2450,
      compareAtPrice: 3200,
      pricingUnit: 'PIECE',
      rating: 5.0,
      reviews: 34,
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836827/shiv-shakti-products/cat_wedding_table_cover_green_velvet_gl_tc_002.jpg',
      description: 'Shiv Shakti Green Velvet Overlay Table Cover (GL-TC-002) — Luxury round banquet table ensemble featuring an emerald-green royal velvet square overlay with gold satin contrast piping over a deeply gathered ethnic print base skirt. Engineered for high-profile wedding receptions, VIP shamianas, and royal banquets.',
      features: [
        'Rich emerald-green plush velvet square overlay with opulent gold satin piping',
        'Full floor-length gathered base skirt with exquisite ceremonial border trim',
        'Dual-layer banquet presentation providing depth and luxurious drape',
        'Heavyweight fabric prevents shifting or bunching during lavish dining events',
        'Commercial-grade laundering resilience with premium anti-fray stitching'
      ],
      isFeatured: true,
      tag: 'Best Seller',
      inStock: true,
      status: 'PUBLISHED',
      sortPriority: 10,
      seoTitle: 'Green Velvet Overlay Table Cover (GL-TC-002) | Shiv Shakti Events Mart',
      seoDescription: 'Luxury Green Velvet Overlay Round Table Cover for royal wedding banquets and VIP event staging. Emerald velvet with gold trim.',
      seoKeywords: 'Green Velvet Overlay Table Cover, GL-TC-002, velvet table cover, wedding banquet linen, Shiv Shakti',
    },
    create: {
      sku: 'GL-TC-002',
      name: 'Green Velvet Overlay Table Cover',
      slug: 'green-velvet-overlay-table-cover-gl-tc-002',
      categoryId: 'wedding',
      subcategoryId: 'table-covers',
      subSubcategoryId: 'round-table-covers',
      style: 'Luxury Velvet',
      price: 2450,
      compareAtPrice: 3200,
      pricingUnit: 'PIECE',
      rating: 5.0,
      reviews: 34,
      image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836827/shiv-shakti-products/cat_wedding_table_cover_green_velvet_gl_tc_002.jpg',
      description: 'Shiv Shakti Green Velvet Overlay Table Cover (GL-TC-002) — Luxury round banquet table ensemble featuring an emerald-green royal velvet square overlay with gold satin contrast piping over a deeply gathered ethnic print base skirt. Engineered for high-profile wedding receptions, VIP shamianas, and royal banquets.',
      features: [
        'Rich emerald-green plush velvet square overlay with opulent gold satin piping',
        'Full floor-length gathered base skirt with exquisite ceremonial border trim',
        'Dual-layer banquet presentation providing depth and luxurious drape',
        'Heavyweight fabric prevents shifting or bunching during lavish dining events',
        'Commercial-grade laundering resilience with premium anti-fray stitching'
      ],
      isFeatured: true,
      tag: 'Best Seller',
      inStock: true,
      status: 'PUBLISHED',
      sortPriority: 10,
      seoTitle: 'Green Velvet Overlay Table Cover (GL-TC-002) | Shiv Shakti Events Mart',
      seoDescription: 'Luxury Green Velvet Overlay Round Table Cover for royal wedding banquets and VIP event staging. Emerald velvet with gold trim.',
      seoKeywords: 'Green Velvet Overlay Table Cover, GL-TC-002, velvet table cover, wedding banquet linen, Shiv Shakti',
    },
  });

  // Primary image for Product 2
  await prisma.productImage.deleteMany({ where: { productId: product2.id } });
  await prisma.productImage.create({
    data: {
      productId: product2.id,
      url: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791836827/shiv-shakti-products/cat_wedding_table_cover_green_velvet_gl_tc_002.jpg',
      publicId: 'shiv-shakti-products/cat_wedding_table_cover_green_velvet_gl_tc_002',
      altText: 'Green Velvet Overlay Table Cover (GL-TC-002)',
      isPrimary: true,
      sortOrder: 0,
      type: 'gallery',
    },
  });
  console.log('✅ Product 2 upserted:', product2.name, product2.sku);

  console.log('\n🎉 Category and Products successfully synchronized in PostgreSQL!');
}

seedTableCovers()
  .catch((e) => {
    console.error('Error seeding table covers:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
