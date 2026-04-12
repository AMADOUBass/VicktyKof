import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const updates = [
    { name: "Starter", url: "/images/services/starter-locs.png" },
    { name: "Retwist", url: "/images/services/retwist.png" },
    { name: "Interlock", url: "/images/services/interlocks.png" },
    { name: "Tresse", url: "/images/services/braids.png" },
    { name: "Naturel", url: "/images/services/natural-styles.png" },
    { name: "Soin", url: "/images/services/hair-care.png" },
    { name: "Coiffure", url: "/images/services/natural-styles.png" },
  ];

  for (const up of updates) {
    const res = await prisma.service.updateMany({
      where: { name: { contains: up.name, mode: "insensitive" } },
      data: { imageUrl: up.url },
    });
    console.log(`Updated ${up.name}: ${res.count} records`);
  }

  console.log("DB Updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
