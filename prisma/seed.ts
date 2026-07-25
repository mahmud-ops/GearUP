import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");

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
