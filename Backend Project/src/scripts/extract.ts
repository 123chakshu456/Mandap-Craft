// Run from Backend Project dir: npx tsx src/scripts/extract.ts
import { CATALOG_PRODUCTS } from '../../../Project/Shiv-Shakti-Events-Mart/src/constants/mockData.ts';
import { writeFileSync } from 'fs';

writeFileSync('src/scripts/products_seed.json', JSON.stringify(CATALOG_PRODUCTS, null, 2));
console.log(`Extracted ${CATALOG_PRODUCTS.length} products to products_seed.json`);
