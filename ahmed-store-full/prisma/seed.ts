import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // create admin user with hashed password
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  // create sample products
  const products = [
    { name: 'Product 1', description: 'First product', price: 19.99, stock: 10, imageUrl: 'https://via.placeholder.com/300' },
    { name: 'Product 2', description: 'Second product', price: 39.99, stock: 5, imageUrl: 'https://via.placeholder.com/300' },
    { name: 'Product 3', description: 'Third product', price: 29.99, stock: 20, imageUrl: 'https://via.placeholder.com/300' },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });