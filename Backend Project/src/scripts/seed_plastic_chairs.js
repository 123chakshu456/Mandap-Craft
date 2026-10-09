import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const plasticChairs = [
  {
    sku: 'SSE-PC-S01',
    name: 'Shiv Shakti Plastic Chair SSE-PC-S01',
    slug: 'shiv-shakti-plastic-chair-sse-pc-s01',
    categoryId: 'furniture',
    subcategoryId: 'chairs',
    subSubcategoryId: 'plastic-chairs',
    style: 'Commercial Heavy-Duty',
    price: 850,
    compareAtPrice: 1100,
    pricingUnit: 'FIXED',
    areaMode: null,
    presetSizes: [],
    rating: 4.9,
    reviews: 38,
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791578629/shiv-shakti-products/sse-pc-s01_supreme_plastic_chair_with_arms.jpg',
    publicId: 'shiv-shakti-products/sse-pc-s01_supreme_plastic_chair_with_arms',
    description: 'Heavy-duty commercial plastic event chair featuring curved armrests and precision slotted seat & backrest. Engineered from 100% virgin polypropylene polymer for high load-bearing capacity across outdoor shamiana events, banquet halls, community centers, and ceremonial pandals.',
    features: [
      'Heavy-duty virgin polypropylene molded construction with reinforced load capacity',
      'Ergonomic integrated armrests and ventilated slotted seat & backrest',
      'High-density stackable design for rapid event setup and compact transport',
      'All-weather UV-stabilized glossy finish resistant to fading (Colour Shown: Red)'
    ],
    isFeatured: true,
    tag: 'Plastic Collection',
    inStock: true,
    status: 'PUBLISHED',
    sortPriority: 100,
  },
  {
    sku: 'SSE-PC-S02',
    name: 'Shiv Shakti Plastic Chair SSE-PC-S02',
    slug: 'shiv-shakti-plastic-chair-sse-pc-s02',
    categoryId: 'furniture',
    subcategoryId: 'chairs',
    subSubcategoryId: 'plastic-chairs',
    style: 'Commercial Heavy-Duty',
    price: 680,
    compareAtPrice: 890,
    pricingUnit: 'FIXED',
    areaMode: null,
    presetSizes: [],
    rating: 4.8,
    reviews: 32,
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791578632/shiv-shakti-products/sse-pc-s02_supreme_plastic_chair_without_arms.jpg',
    publicId: 'shiv-shakti-products/sse-pc-s02_supreme_plastic_chair_without_arms',
    description: 'Commercial event chair featuring an elegant woven-grid backrest and contoured seat pan. Space-efficient profile specifically designed to optimize guest seating capacity in dense shamiana dining halls and convention setups.',
    features: [
      'Commercial molded polymer construction with distinctive woven-grid backrest pattern',
      'Armless space-saving profile maximizing guest capacity at banquet dining tables',
      'Lightweight yet rigid structural ribbing, stackable up to 25 units safely',
      'Weatherproof and stain-resistant glossy finish for easy wiping (Colour Shown: Red)'
    ],
    isFeatured: true,
    tag: 'Plastic Collection',
    inStock: true,
    status: 'PUBLISHED',
    sortPriority: 99,
  },
  {
    sku: 'SSE-PC-H01',
    name: 'Shiv Shakti Plastic Chair SSE-PC-H01',
    slug: 'shiv-shakti-plastic-chair-sse-pc-h01',
    categoryId: 'furniture',
    subcategoryId: 'chairs',
    subSubcategoryId: 'plastic-chairs',
    style: 'Commercial Heavy-Duty',
    price: 820,
    compareAtPrice: 1050,
    pricingUnit: 'FIXED',
    areaMode: null,
    presetSizes: [],
    rating: 4.9,
    reviews: 35,
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791578635/shiv-shakti-products/sse-pc-h01_himalaya_plastic_chair_with_arms.jpg',
    publicId: 'shiv-shakti-products/sse-pc-h01_himalaya_plastic_chair_with_arms',
    description: 'Commercial event chair featuring an arched vertical-slat backrest and reinforced armrests. Tailored for heavy-duty event usage, marriage pandals, outdoor catering, and convention seating with superior ergonomics.',
    features: [
      'High-impact commercial polymer formulation engineered for intense event rental cycles',
      'Arched vertical-slat backrest provides optimal lumbar support and airflow ventilation',
      'Reinforced solid armrests with rounded comfort contours',
      'All-weather UV-stabilized exterior finish (Colour Shown: Red)'
    ],
    isFeatured: true,
    tag: 'Plastic Collection',
    inStock: true,
    status: 'PUBLISHED',
    sortPriority: 98,
  },
  {
    sku: 'SSE-PC-H02',
    name: 'Shiv Shakti Plastic Chair SSE-PC-H02',
    slug: 'shiv-shakti-plastic-chair-sse-pc-h02',
    categoryId: 'furniture',
    subcategoryId: 'chairs',
    subSubcategoryId: 'plastic-chairs',
    style: 'Commercial Heavy-Duty',
    price: 650,
    compareAtPrice: 850,
    pricingUnit: 'FIXED',
    areaMode: null,
    presetSizes: [],
    rating: 4.8,
    reviews: 29,
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791578637/shiv-shakti-products/sse-pc-h02_himalaya_plastic_chair_without_arms.jpg',
    publicId: 'shiv-shakti-products/sse-pc-h02_himalaya_plastic_chair_without_arms',
    description: 'Commercial event chair featuring an aerodynamic horizontal-slat backrest and scalloped contour seat. Ideal for rapid deployment, high-density banquet arrangements, and easy warehouse handling.',
    features: [
      'Heavy-duty molded polymer with ventilated horizontal-slat backrest geometry',
      'Slim-profile form factor for seamless side-by-side buffet table seating',
      'Effortless vertical stacking reduces transit and staging space requirements',
      'Heavy-duty crack-resistant design with glossy UV-treated finish (Colour Shown: Red)'
    ],
    isFeatured: true,
    tag: 'Plastic Collection',
    inStock: true,
    status: 'PUBLISHED',
    sortPriority: 97,
  },
];

async function seed() {
  console.log('Updating plastic chairs in database (removing with/without arms from names)...');
  for (const item of plasticChairs) {
    const { publicId, ...productData } = item;
    const product = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        ...productData,
        updatedAt: new Date(),
      },
      create: productData,
    });
    console.log(`Updated product: ${product.name} (${product.sku})`);

    // Update primary ProductImage record alt text
    await prisma.productImage.updateMany({
      where: { productId: product.id },
      data: {
        altText: product.name,
      },
    });
  }

  const products = await prisma.product.findMany({
    where: { sku: { startsWith: 'SSE-PC' } },
    select: { id: true, name: true, sku: true, tag: true },
  });
  console.log('\nVerification of updated products:');
  console.log(JSON.stringify(products, null, 2));
}

seed()
  .catch((e) => {
    console.error('Error updating plastic chairs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
