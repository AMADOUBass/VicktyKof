/**
 * VicktyKof — SUPER-FULL MASTER SEED (Testing & Demo Ready)
 * Version finale : Galerie complète (12+ photos) avec TAGS et FILTRES.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" }); 
config();                        

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱  Restauration finale de la Galerie Complète (12+ photos) avec Filtres...\n");

  // ── 1. Nettoyage Complet ──────────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.portfolioPhoto.deleteMany(),
    prisma.galleryPhoto.deleteMany(),
    prisma.stylistService.deleteMany(),
    prisma.availability.deleteMany(),
    prisma.stylist.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productCategory.deleteMany(),
    prisma.service.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const hash = await bcrypt.hash("VicktyKof2026!", 12);
  const testPass = await bcrypt.hash("Test2024!", 12);

  // ── 2. Équipe & Portraits PNG ────────────────────────────────────────────────
  const vicky = await prisma.user.create({ data: { email: "vicktykoff@gmail.com", name: "Vicky Koffi", passwordHash: hash, role: "ADMIN", image: "/images/users/vicky.png", emailVerified: new Date() } });
  const naomi = await prisma.user.create({ data: { email: "naomi@vicktykof.com", name: "Naomi Diallo", passwordHash: testPass, role: "STYLIST", image: "/images/users/naomi.png", emailVerified: new Date() } });
  const sarra = await prisma.user.create({ data: { email: "sarra@vicktykof.com", name: "Sarra Ben", passwordHash: testPass, role: "STYLIST", image: "/images/users/sarra.png", emailVerified: new Date() } });
  const miriam = await prisma.user.create({ data: { email: "miriam@vicktykof.com", name: "Miriam K.", passwordHash: testPass, role: "STYLIST", image: "/images/users/miriam.png", emailVerified: new Date() } });

  const client = await prisma.user.create({ data: { email: "aissatou@gmail.com", name: "Aissatou Sow", passwordHash: testPass, role: "CLIENT", image: "/images/users/aissatou.png", emailVerified: new Date() } });

  const dbStylists = [];
  for (const u of [vicky, naomi, sarra, miriam]) {
    const st = await prisma.stylist.create({ data: { userId: u.id, bio: "Expertise VicktyKof.", yearsExp: 10, isActive: true, avatarUrl: u.image } });
    dbStylists.push(st);
  }

  // ── 3. Services ─────────────────────────────────────────────────────────────
  const services = [
    { name: "Retwist", slug: "retwist", durationMins: 90, basePrice: 85, imageUrl: "/images/services/retwist.png", category: "Entretien" },
    { name: "Starter Locs", slug: "starter-locs", durationMins: 180, basePrice: 200, imageUrl: "/images/services/starter-locs.png", category: "Création" },
    { name: "Interlocks", slug: "interlocks", durationMins: 150, basePrice: 150, imageUrl: "/images/services/interlocks.png", category: "Entretien" },
    { name: "Tresses African", slug: "tresses-africaines", durationMins: 240, basePrice: 180, imageUrl: "/images/services/braids.png", category: "Tresses" },
    { name: "Soin Profond", slug: "soin-profond", durationMins: 60, basePrice: 65, imageUrl: "/images/services/hair-care.png", category: "Soin" },
    { name: "Styles Naturels", slug: "styles-naturels", durationMins: 75, basePrice: 70, imageUrl: "/images/services/natural-styles.png", category: "Naturel" },
  ];

  const dbSvc = [];
  for (const s of services) {
    const ds = await prisma.service.create({ data: { ...s, description: "Service premium.", depositPct: 30 } });
    dbSvc.push(ds);
    await prisma.stylistService.create({ data: { stylistId: dbStylists[0].id, serviceId: ds.id } });
  }

  // ── 4. Galerie Remise à Neuf (12+ photos PNG avec TAGS) ──────────────────────
  const gallery = [
    { url: "/og-image-premium.png", caption: "L'art de la coiffure afro", tags: ["Premium", "Style"], isFeatured: true },
    { url: "/images/gallery/retwist-signature.png", caption: "Retwist de précision", tags: ["Locs", "Entretien"], isFeatured: true },
    { url: "/images/gallery/starter-locs.png", caption: "Nouveau départ Locs", tags: ["Locs", "Création"], isFeatured: true },
    { url: "/images/gallery/interlocks.png", caption: "Technique Interlocks", tags: ["Locs", "Technique"], isFeatured: true },
    { url: "/images/gallery/braids.png", caption: "Tresses protectrices", tags: ["Tresses", "Naturel"], isFeatured: true },
    { url: "/images/gallery/updo.png", caption: "Style de cérémonie", tags: ["Style", "Mariage"], isFeatured: true },
    { url: "/images/services/retwist.png", caption: "Soin complet", tags: ["Locs", "Soin"], isFeatured: false },
    { url: "/images/services/hair-care.png", caption: "Nutrition des boucles", tags: ["Soin"], isFeatured: false },
    { url: "/images/services/natural-styles.png", caption: "Beauté authentique", tags: ["Naturel"], isFeatured: false },
    { url: "/images/services/starter-locs.png", caption: "Starter Locs — Jour 1", tags: ["Locs", "Création"], isFeatured: false },
    { url: "/images/services/interlocks.png", caption: "Entretien régulier", tags: ["Locs", "Entretien"], isFeatured: false },
    { url: "/images/services/braids.png", caption: "Tresses & Cornrows", tags: ["Tresses"], isFeatured: false },
  ];

  for (const p of gallery) {
    await prisma.galleryPhoto.create({ data: { ...p, uploadedBy: vicky.id, altText: p.caption } });
  }

  // ── 5. RDV Dashboard ───────────────────────────────────────────────────────
  for (let i = 0; i < 15; i++) {
    await prisma.appointment.create({
      data: {
        stylistId: dbStylists[i % 4].id,
        serviceId: dbSvc[i % 6].id,
        clientId: client.id,
        scheduledAt: new Date(),
        durationMins: 90,
        totalPrice: 120,
        depositAmount: 40,
        depositPct: 30,
        status: "COMPLETED",
      }
    });
  }

  console.log("\n🚀  RESTORE COMPLET TERMINÉ : 12 photos avec Tags & Filtres réactivés !");
}

main()
  .catch((e) => { console.error("❌  Seed échoué :", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
