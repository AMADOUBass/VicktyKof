/**
 * VicktyKof — ABSOLUTE MASTER SEED (Pre-Launch Audit Version)
 * 100% Data Richness + 100% Visual Premium (PNG Team/Services, SVG Shop).
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" }); 
config();                        

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function dA(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10, 0, 0, 0);
  return d;
}

function dF(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function main() {
  console.log("🌱  Lancement de l'Audit Final du Seed (Master Version)...\n");

  // 1. Reset
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

  const hA = await bcrypt.hash("VicktyKof2026!", 12);
  const hU = await bcrypt.hash("Test2024!", 12);

  // 2. Utilisateurs
  const v = await prisma.user.create({ data: { email: "vicktykoff@gmail.com", name: "Vicky Koffi", passwordHash: hA, role: "ADMIN", isMember: true, image: "/images/users/vicky.png", emailVerified: new Date() } });
  const nU = await prisma.user.create({ data: { email: "naomi@vicktykof.com", name: "Naomi Traoré", passwordHash: hU, role: "STYLIST", isMember: true, image: "/images/users/naomi.png", emailVerified: new Date() } });
  const sU = await prisma.user.create({ data: { email: "sarra@vicktykof.com", name: "Sarra Diallo", passwordHash: hU, role: "STYLIST", isMember: true, image: "/images/users/sarra.png", emailVerified: new Date() } });
  const mU = await prisma.user.create({ data: { email: "miriam@vicktykof.com", name: "Miriam Osei", passwordHash: hU, role: "STYLIST", isMember: false, image: "/images/users/miriam.png", emailVerified: new Date() } });
  const cli = await prisma.user.create({ data: { email: "aissatou@gmail.com", name: "Aissatou Ba", passwordHash: hU, role: "CLIENT", isMember: true, image: "/images/users/aissatou.png", emailVerified: new Date() } });

  // 3. Stylistes (Full Bios)
  const vS = await prisma.stylist.create({ data: { userId: v.id, yearsExp: 15, avatarUrl: v.image, specialties: ["RETWIST", "INTERLOCKS"], bio: "Fondatrice de VicktyKof, Vicky pratique son art depuis plus de 15 ans. Reconnue pour sa précision en retwist et sa maîtrise des interlocks." } });
  const nS = await prisma.stylist.create({ data: { userId: nU.id, yearsExp: 8, avatarUrl: nU.image, specialties: ["BRAIDING"], bio: "Experte en tresses africaines et coiffures naturelles, Naomi est le choix parfait pour les box braids." } });
  const sS = await prisma.stylist.create({ data: { userId: sU.id, yearsExp: 5, avatarUrl: sU.image, specialties: ["RETWIST"], bio: "Passionnée par les locs depuis l'enfance, Sarra excelle dans l'entretien et le retwist." } });
  const mS = await prisma.stylist.create({ data: { userId: mU.id, yearsExp: 3, avatarUrl: mU.image, specialties: ["BRAIDING"], bio: "Styliste polyvalente spécialisée dans les styles naturels et les tresses traditionnelles." } });

  for (const s of [vS, nS, sS, mS]) { for (let d=1; d<=6; d++) await prisma.availability.create({ data: { stylistId: s.id, dayOfWeek: d, startTime: "09:00", endTime: "19:00" } }); }

  // 4. Services
  const ser1 = await prisma.service.create({ data: { name: "Retwist Régulier", slug: "retwist-regulier", durationMins: 90, basePrice: 85, depositPct: 30, imageUrl: "/images/services/retwist.png", category: "locks" } });
  const ser2 = await prisma.service.create({ data: { name: "Starter Locs", slug: "starter-locs", durationMins: 240, basePrice: 200, depositPct: 10, imageUrl: "/images/services/starter-locs.png", category: "locks" } }); // 10% of 200 = 20
  const ser3 = await prisma.service.create({ data: { name: "Interlocks", slug: "interlocks", durationMins: 150, basePrice: 150, depositPct: 13, imageUrl: "/images/services/interlocks.png", category: "locks" } }); // ~20$
  const ser4 = await prisma.service.create({ data: { name: "Tresses Africaines", slug: "tresses-africaines", durationMins: 240, basePrice: 180, depositPct: 11, imageUrl: "/images/services/braids.png", category: "braids" } }); // ~20$
  const ser5 = await prisma.service.create({ data: { name: "Soin Profond & Lavage", slug: "soin-profond-lavage", durationMins: 45, basePrice: 25, depositPct: 0, imageUrl: "/images/services/hair-care.png", category: "treatment" } });
  const ser6 = await prisma.service.create({ data: { name: "Réparation par lock", slug: "reparation-lock", durationMins: 30, basePrice: 10, depositPct: 0, description: "Prix par lock. Juste le montant sera affiché.", category: "other" } });
  const ser7 = await prisma.service.create({ data: { name: "Style d'événement", slug: "style-evenement", durationMins: 120, basePrice: 100, depositPct: 20, imageUrl: "/images/gallery/updo.png", category: "natural" } }); // 20% of 100 = 20

  for (const s of [ser1, ser2, ser3, ser4, ser5, ser6, ser7]) await prisma.stylistService.create({ data: { stylistId: vS.id, serviceId: s.id } });

  // 5. Boutique (Exactement 12 Produits en SVG)
  const catS = await prisma.productCategory.create({ data: { name: "Soins capillaires", slug: "soins-capillaires" } });
  const catH = await prisma.productCategory.create({ data: { name: "Huiles & Beurres", slug: "huiles-beurres" } });
  const catA = await prisma.productCategory.create({ data: { name: "Accessoires", slug: "accessoires" } });
  const catK = await prisma.productCategory.create({ data: { name: "Kits & Coffrets", slug: "kits-coffrets" } });

  await prisma.product.create({ data: { name: "Crème Hydratante Locs VK", slug: "creme-hydratante-locs-vk", price: 28, comparePrice: 35, memberPrice: 22, stock: 45, images: ["/images/products/shampoing-locs.svg"], categoryId: catS.id, isFeatured: true } });
  await prisma.product.create({ data: { name: "Shampoing Clarifiant Naturel", slug: "shampoing-clarifiant-naturel", price: 22, memberPrice: 18, stock: 30, images: ["/images/products/apres-shampoing.svg"], categoryId: catS.id } });
  await prisma.product.create({ data: { name: "Spray Hydratant Quotidien", slug: "spray-hydratant-quotidien", price: 18, stock: 60, images: ["/images/products/spray-refresh.svg"], categoryId: catS.id, isFeatured: true } });
  await prisma.product.create({ data: { name: "Cire de Palmier Naturelle", slug: "cire-palmier-naturelle", price: 19, stock: 10, images: ["/images/products/cire-palmier.svg"], categoryId: catS.id } });
  await prisma.product.create({ data: { name: "Huile de Ricin Extra-Pure", slug: "huile-ricin-extra-pure", price: 24, comparePrice: 30, memberPrice: 19, stock: 25, images: ["/images/products/huile-ricin.svg"], categoryId: catH.id, isFeatured: true } });
  await prisma.product.create({ data: { name: "Beurre de Karité Brut", slug: "beurre-karite-brut", price: 20, memberPrice: 16, stock: 35, images: ["/images/products/beurre-karite.svg"], categoryId: catH.id } });
  await prisma.product.create({ data: { name: "Synergie d'Huiles Locs", slug: "synergie-huiles-essentielles-locs", price: 32, memberPrice: 26, stock: 20, images: ["/images/products/huile-argan.svg"], categoryId: catH.id, isFeatured: true } });
  await prisma.product.create({ data: { name: "Bonnet en Satin Luxe", slug: "bonnet-satin-luxe", price: 16, memberPrice: 12, stock: 50, images: ["/images/products/bonnet-satin.svg"], categoryId: catA.id } });
  await prisma.product.create({ data: { name: "Kit Aiguilles Interlocks Pro", slug: "kit-aiguilles-interlocks-pro", price: 18, stock: 40, images: ["/images/products/aiguille-interlocks.svg"], categoryId: catA.id } });
  await prisma.product.create({ data: { name: "Élastiques Sans Métal", slug: "elastiques-sans-metal", price: 8, stock: 100, images: ["/images/products/elastiques-satin.svg"], categoryId: catA.id } });
  await prisma.product.create({ data: { name: "Kit Starter Locs Complet", slug: "kit-starter-locs-complet", price: 68, comparePrice: 90, memberPrice: 55, stock: 15, images: ["/images/products/coffret-entretien.svg"], categoryId: catK.id, isFeatured: true } });
  await prisma.product.create({ data: { name: "Coffret Entretien Mensuel", slug: "coffret-entretien-mensuel", price: 58, memberPrice: 45, stock: 10, images: ["/images/products/huile-coco.svg"], categoryId: catK.id, isFeatured: true, isMemberOnly: true } });

  // 6. Galerie (12 Photos PNG + TAGS)
  const gP = [
    { url: "/og-image-premium.png", caption: "Premium Hair Art", tags: ["Premium"], isFeatured: true },
    { url: "/images/gallery/retwist-signature.png", caption: "Retwist de Vicky", tags: ["Retwist", "Locs"], isFeatured: true },
    { url: "/images/gallery/starter-locs.png", caption: "Installation Locs", tags: ["Starter", "Locs"], isFeatured: true },
    { url: "/images/gallery/interlocks.png", caption: "Technique Interlocks", tags: ["Interlocks", "Locs"], isFeatured: true },
    { url: "/images/gallery/braids.png", caption: "Styles Naturels", tags: ["Tresses", "Naturel"], isFeatured: true },
    { url: "/images/gallery/updo.png", caption: "Élégance Mariage", tags: ["Mariage"], isFeatured: true },
    { url: "/images/services/retwist.png", caption: "Soin complet", tags: ["Locs"], isFeatured: false },
    { url: "/images/services/hair-care.png", caption: "Nutrition Capillaire", tags: ["Soin"], isFeatured: false },
    { url: "/images/services/natural-styles.png", caption: "Texture Afro", tags: ["Naturel"], isFeatured: false },
    { url: "/images/services/starter-locs.png", caption: "Starter Locs — Jour 1", tags: ["Locs"], isFeatured: false },
    { url: "/images/services/interlocks.png", caption: "Entretien régulier", tags: ["Locs"], isFeatured: false },
    { url: "/images/services/braids.png", caption: "Tresses & Cornrows", tags: ["Tresses"], isFeatured: false },
  ];
  for (const ph of gP) await prisma.galleryPhoto.create({ data: { ...ph, uploadedBy: v.id } });

  // 7. Données Business (11 RDV)
  for (let i = 0; i < 11; i++) {
    await prisma.appointment.create({ data: { clientId: cli.id, stylistId: vS.id, serviceId: ser1.id, scheduledAt: dA(i + 1), durationMins: 90, totalPrice: 85, depositAmount: 25.5, depositPct: 30, status: (i % 2 === 0 ? "COMPLETED" : "ACCEPTED") } });
  }

  console.log("\n🔥  AUDIT DU SEED RÉUSSI : 12 produits, 12 photos, bios stylistes complètes !");
}

main()
  .catch((e) => { console.error("❌  Seed échoué :", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
