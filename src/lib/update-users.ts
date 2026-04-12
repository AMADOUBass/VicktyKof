import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    { name: "Vicky", img: "/images/users/vicky.png" },
    { name: "Naomi", img: "/images/users/naomi.png" },
    { name: "Sarra", img: "/images/users/sarra.png" },
    { name: "Miriam", img: "/images/users/miriam.png" },
    { name: "Aissatou", img: "/images/users/aissatou.png" },
    { name: "Fatoumata", img: "/images/users/fatoumata.png" },
    { name: "Aminata", img: "/images/users/aminata.png" },
    { name: "Rokia", img: "/images/users/rokia.png" },
  ];

  for (const u of users) {
    // Update User
    const resUser = await prisma.user.updateMany({
      where: { name: { contains: u.name, mode: "insensitive" } },
      data: { image: u.img },
    });
    console.log(`Updated User ${u.name}: ${resUser.count} records`);

    // Update Stylist
    const resStylist = await prisma.stylist.updateMany({
      where: { user: { name: { contains: u.name, mode: "insensitive" } } },
      data: { avatarUrl: u.img },
    });
    console.log(`Updated Stylist ${u.name}: ${resStylist.count} records`);
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
