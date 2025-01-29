import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  // Clean up the test database before all tests
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Clean up and disconnect after all tests are done
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
