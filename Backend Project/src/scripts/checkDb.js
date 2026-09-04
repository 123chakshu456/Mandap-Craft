import dotenv from 'dotenv';
dotenv.config();
import prisma from '../shared/config/prisma.js';

async function main() {
  const [productCount, userCount, orderCount, quoteCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.quote.count(),
  ]);
  const sampleProduct = await prisma.product.findFirst();
  console.log({
    productCount,
    userCount,
    orderCount,
    quoteCount,
    sampleProduct,
  });
  await prisma.$disconnect();
}

main().catch(console.error);
