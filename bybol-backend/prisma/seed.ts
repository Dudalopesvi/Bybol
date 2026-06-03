import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { prisma } from '../src/core/prisma/client.js';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {},
    create: {
      name: 'Admin Acme',
      email: 'admin@acme.test',
      passwordHash,
    },
  });

  await prisma.book.upsert({
    where: { id: 'seed-book-acme' },
    update: {},
    create: {
      id: 'seed-book-acme',
      name: 'Book inicial',
      description: 'Book de exemplo',
    },
  });

  console.log({
    user: { email: user.email, password: 'password123' },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
