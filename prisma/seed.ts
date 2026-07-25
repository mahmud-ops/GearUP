import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding gear items...");

  await prisma.gearItems.createMany({
    data: [
      // ================= Camping =================
      {
        name: "2-Person Camping Tent",
        description: "Lightweight waterproof tent for two campers.",
        dailyRate: 18,
        availableQuantity: 5,
        image: "https://picsum.photos/seed/tent/600/400",
        categoryId: "76b2f9a0-73bc-4dea-a324-371df4cdb89c",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Camping Stove",
        description: "Portable gas stove for outdoor cooking.",
        dailyRate: 10,
        availableQuantity: 8,
        image: "https://picsum.photos/seed/stove/600/400",
        categoryId: "76b2f9a0-73bc-4dea-a324-371df4cdb89c",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Sleeping Bag",
        description: "Warm sleeping bag suitable for cold nights.",
        dailyRate: 12,
        availableQuantity: 10,
        image: "https://picsum.photos/seed/sleepingbag/600/400",
        categoryId: "76b2f9a0-73bc-4dea-a324-371df4cdb89c",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },
      {
        name: "Camping Lantern",
        description: "Rechargeable LED lantern with long battery life.",
        dailyRate: 8,
        availableQuantity: 12,
        image: "https://picsum.photos/seed/lantern/600/400",
        categoryId: "76b2f9a0-73bc-4dea-a324-371df4cdb89c",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },

      // ================= Hiking =================
      {
        name: "Hiking Backpack 50L",
        description: "Durable 50L backpack for multi-day hikes.",
        dailyRate: 15,
        availableQuantity: 7,
        image: "https://picsum.photos/seed/backpack/600/400",
        categoryId: "d7d0db54-5056-4d1f-a9c9-286bffe349af",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Trekking Poles",
        description: "Adjustable aluminum trekking poles.",
        dailyRate: 9,
        availableQuantity: 15,
        image: "https://picsum.photos/seed/poles/600/400",
        categoryId: "d7d0db54-5056-4d1f-a9c9-286bffe349af",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Hiking Boots",
        description: "Water-resistant boots with excellent grip.",
        dailyRate: 16,
        availableQuantity: 9,
        image: "https://picsum.photos/seed/boots/600/400",
        categoryId: "d7d0db54-5056-4d1f-a9c9-286bffe349af",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },
      {
        name: "Hydration Pack",
        description: "2-liter hydration backpack for long hikes.",
        dailyRate: 11,
        availableQuantity: 10,
        image: "https://picsum.photos/seed/hydration/600/400",
        categoryId: "d7d0db54-5056-4d1f-a9c9-286bffe349af",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },

      // ================= Cycling =================
      {
        name: "Mountain Bike",
        description: "27.5-inch mountain bike for off-road trails.",
        dailyRate: 35,
        availableQuantity: 4,
        image: "https://picsum.photos/seed/mtb/600/400",
        categoryId: "e53371a4-d2ba-4e30-8952-191d702c2fe5",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Road Bike",
        description: "Lightweight road bicycle for long rides.",
        dailyRate: 40,
        availableQuantity: 3,
        image: "https://picsum.photos/seed/roadbike/600/400",
        categoryId: "e53371a4-d2ba-4e30-8952-191d702c2fe5",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Cycling Helmet",
        description: "Certified lightweight cycling helmet.",
        dailyRate: 7,
        availableQuantity: 12,
        image: "https://picsum.photos/seed/helmet/600/400",
        categoryId: "e53371a4-d2ba-4e30-8952-191d702c2fe5",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },
      {
        name: "Bike Repair Kit",
        description: "Complete repair kit for emergency fixes.",
        dailyRate: 6,
        availableQuantity: 15,
        image: "https://picsum.photos/seed/repair/600/400",
        categoryId: "e53371a4-d2ba-4e30-8952-191d702c2fe5",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },

      // ================= Water Sports =================
      {
        name: "Inflatable Kayak",
        description: "Two-person inflatable kayak with paddles.",
        dailyRate: 45,
        availableQuantity: 3,
        image: "https://picsum.photos/seed/kayak/600/400",
        categoryId: "0c267ebf-d37a-4b2c-ada6-7eb9c0d7057e",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Stand-Up Paddle Board",
        description: "Inflatable SUP for lakes and rivers.",
        dailyRate: 38,
        availableQuantity: 4,
        image: "https://picsum.photos/seed/sup/600/400",
        categoryId: "0c267ebf-d37a-4b2c-ada6-7eb9c0d7057e",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Life Jacket",
        description: "Adult-size safety life jacket.",
        dailyRate: 8,
        availableQuantity: 20,
        image: "https://picsum.photos/seed/lifejacket/600/400",
        categoryId: "0c267ebf-d37a-4b2c-ada6-7eb9c0d7057e",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },
      {
        name: "Snorkeling Set",
        description: "Mask, snorkel, and fins for water adventures.",
        dailyRate: 14,
        availableQuantity: 10,
        image: "https://picsum.photos/seed/snorkel/600/400",
        categoryId: "0c267ebf-d37a-4b2c-ada6-7eb9c0d7057e",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },

      // ================= Football =================
      {
        name: "Match Football",
        description: "FIFA-quality size 5 football.",
        dailyRate: 5,
        availableQuantity: 20,
        image: "https://picsum.photos/seed/football/600/400",
        categoryId: "15023491-08ce-42d9-98ca-3bb6c2712ec2",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Football Goal Net",
        description: "Durable replacement goal net.",
        dailyRate: 12,
        availableQuantity: 6,
        image: "https://picsum.photos/seed/goalnet/600/400",
        categoryId: "15023491-08ce-42d9-98ca-3bb6c2712ec2",
        providerId: "aa156be8-bb4f-4042-a4e0-18cbed776747",
      },
      {
        name: "Football Training Cones",
        description: "Set of 20 cones for drills.",
        dailyRate: 4,
        availableQuantity: 15,
        image: "https://picsum.photos/seed/cones/600/400",
        categoryId: "15023491-08ce-42d9-98ca-3bb6c2712ec2",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },
      {
        name: "Goalkeeper Gloves",
        description: "Professional grip goalkeeper gloves.",
        dailyRate: 9,
        availableQuantity: 8,
        image: "https://picsum.photos/seed/gloves/600/400",
        categoryId: "15023491-08ce-42d9-98ca-3bb6c2712ec2",
        providerId: "cb49f8da-c0f1-48fa-a1cc-15c2365564d5",
      },
    ],
  });

  console.log("Gear items seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });