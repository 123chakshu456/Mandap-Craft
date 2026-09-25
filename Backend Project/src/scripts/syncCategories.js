import prisma from '../shared/config/prisma.js';

const UNIFIED_CATEGORIES = [
  {
    id: 'wedding',
    name: 'Wedding',
    shortTitle: 'Wedding',
    sortOrder: 1,
    subcategories: [
      { id: 'ceilings', name: 'Ceilings & Cloth Canopies', sortOrder: 1 },
      { id: 'mandaps', name: 'Mandaps', sortOrder: 2 },
      { id: 'tents', name: 'Tents', sortOrder: 3 },
      { id: 'canopies', name: 'Canopies', sortOrder: 4 },
      { id: 'backdrops', name: 'Backdrops', sortOrder: 5 },
      { id: 'jaimala', name: 'Jaimala', sortOrder: 6 },
      { id: 'stage-items', name: 'Stage Items', sortOrder: 7 },
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture',
    shortTitle: 'Furniture',
    sortOrder: 2,
    subcategories: [
      { id: 'chairs', name: 'Chairs', sortOrder: 1 },
      { id: 'designer-chairs', name: 'Designer Chairs', sortOrder: 2 },
      { id: 'plastic-chairs', name: 'Plastic Chairs', sortOrder: 3 },
      { id: 'tables', name: 'Tables', sortOrder: 4 },
      { id: 'sofas', name: 'Sofas', sortOrder: 5 },
      { id: 'bar-tables', name: 'Bar Tables', sortOrder: 6 },
      { id: 'counters', name: 'Counters', sortOrder: 7 },
      { id: 'outdoor-furniture', name: 'Outdoor Furniture', sortOrder: 8 },
    ],
  },
  {
    id: 'catering',
    name: 'Catering',
    shortTitle: 'Catering',
    sortOrder: 3,
    subcategories: [
      { id: 'crockery', name: 'Crockery', sortOrder: 1 },
      { id: 'serving-items', name: 'Serving Items', sortOrder: 2 },
      { id: 'gas-pipes', name: 'Gas Pipes', sortOrder: 3 },
      { id: 'catering-equipment', name: 'Catering Equipment', sortOrder: 4 },
      { id: 'buffet-counters', name: 'Buffet Counters', sortOrder: 5 },
    ],
  },
  {
    id: 'decor',
    name: 'Decor',
    shortTitle: 'Decor',
    sortOrder: 4,
    subcategories: [
      { id: 'artificial-flowers', name: 'Artificial Flowers', sortOrder: 1 },
      { id: 'props', name: 'Props', sortOrder: 2 },
      { id: 'panels', name: 'Panels', sortOrder: 3 },
      { id: 'fabrics', name: 'Fabrics', sortOrder: 4 },
      { id: 'centerpieces', name: 'Centerpieces', sortOrder: 5 },
      { id: 'lighting', name: 'Lighting', sortOrder: 6 },
    ],
  },
  {
    id: 'event-essentials',
    name: 'Event Essentials',
    shortTitle: 'Event Essentials',
    sortOrder: 5,
    subcategories: [
      { id: 'coolers', name: 'Coolers', sortOrder: 1 },
      { id: 'fans', name: 'Fans', sortOrder: 2 },
      { id: 'carpets', name: 'Carpets', sortOrder: 3 },
      { id: 'mats', name: 'Mats', sortOrder: 4 },
      { id: 'electrical-items', name: 'Electrical Items', sortOrder: 5 },
      { id: 'miscellaneous-equipment', name: 'Miscellaneous Equipment', sortOrder: 6 },
      { id: 'heaters', name: 'Heaters', sortOrder: 7 },
    ],
  },
  {
    id: 'custom-manufacturing',
    name: 'Custom Manufacturing',
    shortTitle: 'Custom Manufacturing',
    sortOrder: 6,
    subcategories: [
      { id: 'custom-tents', name: 'Custom Tents', sortOrder: 1 },
      { id: 'custom-counters', name: 'Custom Counters', sortOrder: 2 },
      { id: 'custom-furniture', name: 'Custom Furniture', sortOrder: 3 },
      { id: 'custom-decor', name: 'Custom Decor', sortOrder: 4 },
    ],
  },
];

async function syncCategories() {
  console.log('Synchronizing database categories with menu bar taxonomy...');

  for (const cat of UNIFIED_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        shortTitle: cat.shortTitle,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.id,
        shortTitle: cat.shortTitle,
        sortOrder: cat.sortOrder,
        level: 1,
        isActive: true,
      },
    });

    console.log(`Updated Level 1 Category: ${cat.name} (${cat.id})`);

    for (const sub of cat.subcategories) {
      await prisma.category.upsert({
        where: { id: sub.id },
        update: {
          name: sub.name,
          shortTitle: sub.name,
          sortOrder: sub.sortOrder,
          parentId: cat.id,
        },
        create: {
          id: sub.id,
          name: sub.name,
          slug: `${cat.id}-${sub.id}`,
          shortTitle: sub.name,
          sortOrder: sub.sortOrder,
          parentId: cat.id,
          level: 2,
          isActive: true,
        },
      });
      console.log(`  -> Subcategory: ${sub.name} (${sub.id}) [order ${sub.sortOrder}]`);
    }
  }

  console.log('Category synchronization completed successfully!');
  process.exit(0);
}

syncCategories().catch((err) => {
  console.error('Error syncing categories:', err);
  process.exit(1);
});
