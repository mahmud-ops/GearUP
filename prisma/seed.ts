import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");
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
