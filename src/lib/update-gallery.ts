import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const images = [
    "/images/gallery/retwist-signature.png",
    "/images/services/braids.png",
    "/images/services/starter-locs.png",
    "/images/home/hero-luxury.png",
    "/images/services/interlocks.png",
    "/images/services/retwist.png",
    "/images/services/natural-styles.png",
    "/images/services/hair-care.png",
    "/images/users/naomi.png",
    "/images/users/sarra.png",
    "/images/users/miriam.png",
    "/images/users/vicky.png",
  ];

  const photos = await prisma.galleryPhoto.findMany({ orderBy: { createdAt: "asc" } });

  for (let i = 0; i < photos.length; i++) {
    const imgUrl = images[i % images.length];
    await prisma.galleryPhoto.update({
      where: { id: photos[i].id },
      data: { url: imgUrl }
    });
    console.log(`Updated photo ${photos[i].id} with ${imgUrl}`);
  }

  console.log("Gallery DB Updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
