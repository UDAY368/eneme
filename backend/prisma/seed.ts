import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user: user@111 / Admin@111
  const hashedPassword = await bcrypt.hash('Admin@111', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'user@111' },
    update: { password: hashedPassword },
    create: {
      username: 'user@111',
      password: hashedPassword,
    },
  });

  console.log('Created/updated admin user:', adminUser.username);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
