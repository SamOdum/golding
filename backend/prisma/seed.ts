import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  const users = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 10),
    },
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
    },
  ];

  console.log("🌱 Starting seeding...");

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${createdUser.id}`);
  }

  console.log("🌱 Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
