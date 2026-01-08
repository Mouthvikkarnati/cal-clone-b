import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Default Admin",
      email: "admin@example.com",
      timezone: "Asia/Kolkata"
    }
  });

  await prisma.eventType.upsert({
    where: { slug: "30-min-meeting" },
    update: {},
    create: {
      userId: user.id,
      title: "30 Min Meeting",
      description: "Introductory call",
      duration: 30,
      buffer: 5,
      slug: "30-min-meeting"
    }
  });

  console.log("Seed data inserted");
  await prisma.$disconnect();
}

seed();
