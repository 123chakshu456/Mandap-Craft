import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cols = await prisma.$queryRaw`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'products'
    ORDER BY ordinal_position;
  `;
  console.log('Columns in products table:');
  cols.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));
  await prisma.$disconnect();
}

main().catch(console.error);
