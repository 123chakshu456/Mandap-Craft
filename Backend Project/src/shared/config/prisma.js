import { PrismaClient } from '@prisma/client';

// Global singleton PrismaClient instance
const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export default prisma;
