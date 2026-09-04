import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } });
  console.log('All users:');
  users.forEach(u => console.log(' -', u.email, '|', u.name, '| role:', u.role));
  await prisma.$disconnect();
}
main().catch(console.error);
