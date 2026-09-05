import bcrypt from 'bcryptjs';
import prisma from '../shared/config/prisma.js';

async function createAdminUser() {
  const email = process.argv[2] || 'shivshaktieventsmart@gmail.com';
  const plainPassword = process.argv[3] || 'ShivShakti@2026';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Shiv Shakti Admin',
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Shiv Shakti Admin',
    },
  });

  console.log(`✅ Admin Account Created / Updated Successfully!`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: ${plainPassword}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   User ID: ${user.id}`);

  await prisma.$disconnect();
  process.exit(0);
}

createAdminUser().catch((err) => {
  console.error('❌ Failed to create admin user:', err);
  process.exit(1);
});
