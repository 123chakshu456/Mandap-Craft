import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const nirCount = await prisma.product.count({ where: { sku: { startsWith: 'SKU-NIR' } } });
  const crateCount = await prisma.product.count({ where: { sku: { startsWith: 'SKU-CRATE' } } });
  console.log('NIR count:', nirCount, 'CRATE count:', crateCount);
  const nirList = await prisma.product.findMany({
    where: { sku: { startsWith: 'SKU-NIR' } },
    select: { id: true, name: true, sku: true, price: true, description: true, features: true }
  });
  console.log('All NIR products:');
  nirList.forEach(p => console.log(`${p.sku} | ${p.name} | ${p.price}`));
  await prisma.$disconnect();
}

main().catch(console.error);
