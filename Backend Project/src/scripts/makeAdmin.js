import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node src/scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true },
  });

  console.log('✅ Updated user to ADMIN:');
  console.log('  Name:', user.name);
  console.log('  Email:', user.email);
  console.log('  Role:', user.role);

  await prisma.$disconnect();
}

main().catch(console.error);
