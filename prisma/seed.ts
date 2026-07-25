import bcrypt from "bcryptjs";
import config from "../src/config";
import { prisma } from "../src/lib/prisma";
import type { Role } from "../generated/prisma/enums";

async function main() {
  console.log("Seeding database...");

  const saltRounds = Number(config.bcrypt_salt_rounds);
  const users = [
    {
      name: "Provider 1",
      email: "provider1@gmail.com",
      password: "password123",
      role: "PROVIDER",
    },
    {
      name: "Customer 1",
      email: "customer1@gmail.com",
      password: "password123",
      role: "CUSTOMER",
    },
    {
      name: "Provider 2",
      email: "provider2@gmail.com",
      password: "password123",
      role: "PROVIDER",
    },
    {
      name: "Customer 2",
      email: "customer2@gmail.com",
      password: "password123",
      role: "CUSTOMER",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    await prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role as Role,
      },
    });
    console.log(`Created user: ${user.email}`);
  }

  await prisma.categories.createMany({
    data: [
      {
        name: "Camping",
        description: "Gear needed for camping.",
        slug: "camping",
      },
      {
        name: "Hiking",
        description: "Equipment for hiking and trekking.",
        slug: "hiking",
      },
      {
        name: "Cycling",
        description: "Bikes and cycling accessories.",
        slug: "cycling",
      },
      {
        name: "Water Sports",
        description: "Gear for kayaking, surfing, and other water activities.",
        slug: "water-sports",
      },
      {
        name: "Football",
        description: "Equipment for football training and matches.",
        slug: "football",
      },
    ],
  });
}

main()
  .then(async () => {
    console.log("Seed completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
