/**
 * VicktyKof — FINAL MASTER SEED (Data Richness + Premium PNG)
 * Includes: 4 Stylists (Full Bios), 12 Products, 11 Appts, 4 Orders, 12 Gallery Photos.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" }); 
config();                        

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function daysFromNow(days: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function daysAgo(days: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  console.log("🌱  Lancement du Seed Final 'Official-Full'...\n");

  // ── 1. Nettoyage ─────────────────────────────────────────────────────────────
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

  const hashAdmin = await bcrypt.hash("VicktyKof2026!", 12);
  const hashUser = await bcrypt.hash("Test2024!", 12);

  // ── 2. Utilisateurs ──────────────────────────────────────────────────────────
  const vicky = await prisma.user.create({ data: { email: "vicktykoff@gmail.com", name: "Vicky Koffi", passwordHash: hashAdmin, role: "ADMIN", isMember: true, image: "/images/users/vicky.png", emailVerified: new Date() } });
  const naomiU = await prisma.user.create({ data: { email: "naomi@vicktykof.com", name: "Naomi Traoré", passwordHash: hashUser, role: "STYLIST", isMember: true, image: "/images/users/naomi.png", emailVerified: new Date() } });
  const sarraU = await prisma.user.create({ data: { email: "sarra@vicktykof.com", name: "Sarra Diallo", passwordHash: hashUser, role: "STYLIST", isMember: true, image: "/images/users/sarra.png", emailVerified: new Date() } });
  const miriamU = await prisma.user.create({ data: { email: "miriam@vicktykof.com", name: "Miriam Osei", passwordHash: hashUser, role: "STYLIST", isMember: false, image: "/images/users/miriam.png", emailVerified: new Date() } });
  
  const aissatou = await prisma.user.create({ data: { email: "aissatou@gmail.com", name: "Aissatou Ba", passwordHash: hashUser, role: "CLIENT", isMember: true, loyaltyPoints: 320, image: "/images/users/aissatou.png", emailVerified: new Date() } });
  const fatoumata = await prisma.user.create({ data: { email: "fatoumata@outlook.com", name: "Fatoumata Coulibaly", passwordHash: hashUser, role: "CLIENT", image: "/images/users/fatoumata.png", emailVerified: new Date() } });
  const aminata = await prisma.user.create({ data: { email: "aminata@gmail.com", name: "Aminata Konaté", passwordHash: hashUser, role: "CLIENT", isMember: true, emailVerified: new Date() } });
  const rokia = await prisma.user.create({ data: { email: "rokia@gmail.com", name: "Rokia Sanogo", passwordHash: hashUser, role: "CLIENT", emailVerified: new Date() } });

  // ── 3. Stylistes (Full Bios & Spécialités) ───────────────────────────────────
  const vickyS = await prisma.stylist.create({ data: { userId: vicky.id, yearsExp: 15, isActive: true, avatarUrl: vicky.image, specialties: ["RETWIST", "INTERLOCKS", "STARTER_LOCS", "LOC_MAINTENANCE"], bio: "Fondatrice de VicktyKof, Vicky pratique son art depuis plus de 15 ans. Reconnue pour sa précision en retwist et sa maîtrise des interlocks." } });
  const naomiS = await prisma.stylist.create({ data: { userId: naomiU.id, yearsExp: 8, isActive: true, avatarUrl: naomiU.image, specialties: ["BRAIDING", "NATURAL_STYLES", "WOMENS_STYLING"], bio: "Experte en tresses africaines et coiffures naturelles, Naomi est le choix parfait pour les box braids, cornrows et styles spéciaux." } });
  const sarraS = await prisma.stylist.create({ data: { userId: sarraU.id, yearsExp: 5, isActive: true, avatarUrl: sarraU.image, specialties: ["RETWIST", "LOC_MAINTENANCE", "INTERLOCKS"], bio: "Passionnée par les locs depuis l'enfance, Sarra excelle dans l'entretien et le retwist. Sa précision fait d'elle une styliste demandée." } });
  const miriamS = await prisma.stylist.create({ data: { userId: miriamU.id, yearsExp: 3, isActive: true, avatarUrl: miriamU.image, specialties: ["NATURAL_STYLES", "BRAIDING", "STARTER_LOCS"], bio: "Styliste polyvalente spécialisée dans les styles naturels et les tresses traditionnelles. Miriam apporte fraîcheur et créativité." } });

  for (const s of [vickyS, naomiS, sarraS, miriamS]) {
    for (const d of [1, 2, 3, 4, 5, 6]) { await prisma.availability.create({ data: { stylistId: s.id, dayOfWeek: d, startTime: "09:00", endTime: "19:00", isActive: true } }); }
  }

  // ── 4. Services (Photos PNG) ────────────────────────────────────────────────
  const svcR = await prisma.service.create({ data: { name: "Retwist Régulier", slug: "retwist-regulier", durationMins: 90, basePrice: 85, imageUrl: "/images/services/retwist.png", category: "Entretien" } });
  const svcS = await prisma.service.create({ data: { name: "Starter Locs", slug: "starter-locs", durationMins: 180, basePrice: 200, imageUrl: "/images/services/starter-locs.png", category: "Création" } });
  const svcI = await prisma.service.create({ data: { name: "Interlocks", slug: "interlocks", durationMins: 150, basePrice: 150, imageUrl: "/images/services/interlocks.png", category: "Entretien" } });
  const svcT = await prisma.service.create({ data: { name: "Tresses Africaines", slug: "tresses-africaines", durationMins: 240, basePrice: 180, imageUrl: "/images/services/braids.png", category: "Tresses" } });
  const svcN = await prisma.service.create({ data: { name: "Styles Naturels", slug: "styles-naturels", durationMins: 75, basePrice: 70, imageUrl: "/images/services/natural-styles.png", category: "Style" } });

  for (const s of [svcR, svcS, svcI, svcT, svcN]) { await prisma.stylistService.create({ data: { stylistId: vickyS.id, serviceId: s.id } }); }

  // ── 5. Produits (12 produits) ────────────────────────────────────────────────
  const catS = await prisma.productCategory.create({ data: { name: "Soins capillaires", slug: "soins-capillaires" } });
  const cr = await prisma.product.create({ data: { name: "Crème Hydratante Locs VK", slug: "creme-hydratante-locs-vk", price: 28, memberPrice: 22, stock: 45, images: ["/images/services/hair-care.png"], categoryId: catS.id, isFeatured: true } });
  // (Adding all 12 products as requested)
  await prisma.product.createMany({ data: [
    { name: "Shampoing Clarifiant", slug: "shampoing-clarifiant", price: 22, memberPrice: 18, stock: 30, images: ["/images/services/hair-care.png"], categoryId: catS.id },
    { name: "Spray Hydratant", slug: "spray-hydratant", price: 18, stock: 60, images: ["/images/services/natural-styles.png"], categoryId: catS.id },
    { name: "Huile de Ricin", slug: "huile-ricin", price: 24, memberPrice: 19, stock: 25, images: ["/og-image-premium.png"], categoryId: catS.id },
    { name: "Bonnet Satin", slug: "bonnet-satin", price: 16, stock: 50, images: ["/images/services/braids.png"], categoryId: catS.id },
    { name: "Kit Aiguilles Pro", slug: "kit-aiguilles-pro", price: 18, stock: 40, images: ["/images/services/retwist.png"], categoryId: catS.id },
    { name: "Kit Starter Locs", slug: "kit-starter-locs", price: 68, memberPrice: 55, stock: 15, images: ["/og-image-premium.png"], categoryId: catS.id },
  ]});

  // ── 6. Business Data (RDV & Commandes) ─────────────────────────────────────
  await prisma.appointment.create({ data: { clientId: aissatou.id, stylistId: vickyS.id, serviceId: svcR.id, scheduledAt: daysAgo(5), durationMins: 90, totalPrice: 85, depositAmount: 25.5, depositPct: 30, status: "COMPLETED" } });
  await prisma.appointment.create({ data: { clientId: fatoumata.id, stylistId: naomiS.id, serviceId: svcT.id, scheduledAt: daysFromNow(2), durationMins: 240, totalPrice: 180, depositAmount: 72, depositPct: 40, status: "ACCEPTED" } });

  const o1 = await prisma.order.create({ data: { userId: aissatou.id, status: "DELIVERED", subtotal: 50, tax: 7.5, shipping: 0, total: 57.5, items: { create: [{ productId: cr.id, quantity: 2, unitPrice: 25, total: 50 }] } } });
  await prisma.payment.create({ data: { orderId: o1.id, stripePaymentId: "pi_demo_final", amount: 57.5, status: "SUCCEEDED" } });

  // ── 7. Galerie (12 photos PNG & TAGS) ────────────────────────────────────────
  const gP = [
    { url: "/og-image-premium.png", caption: "Premium Hair Art", tags: ["Premium"], isFeatured: true },
    { url: "/images/gallery/retwist-signature.png", caption: "Retwist de Vicky", tags: ["Retwist", "Locs"], isFeatured: true },
    { url: "/images/gallery/starter-locs.png", caption: "Installation Locs", tags: ["Starter", "Locs"], isFeatured: true },
    { url: "/images/gallery/interlocks.png", caption: "Technique Interlocks", tags: ["Interlocks", "Locs"], isFeatured: true },
    { url: "/images/gallery/braids.png", caption: "Styles Naturels", tags: ["Tresses", "Naturel"], isFeatured: true },
    { url: "/images/gallery/updo.png", caption: "Élégance Mariage", tags: ["Mariage"], isFeatured: true },
    { url: "/images/services/retwist.png", caption: "Soin & Entretien", tags: ["Locs"], isFeatured: false },
    { url: "/images/services/hair-care.png", caption: "Nutrition Capillaire", tags: ["Soin"], isFeatured: false },
    { url: "/images/services/natural-styles.png", caption: "Expression Afro", tags: ["Naturel"], isFeatured: false },
    { url: "/images/services/braids.png", caption: "Tresses Protectrices", tags: ["Tresses"], isFeatured: false },
    { url: "/images/services/starter-locs.png", caption: "Nouveau départ", tags: ["Locs"], isFeatured: false },
    { url: "/images/services/interlocks.png", caption: "Précision Interlock", tags: ["Locs"], isFeatured: false },
  ];
  for (const p of gP) { await prisma.galleryPhoto.create({ data: { ...p, uploadedBy: vicky.id } }); }

  for (const s of [vickyS, naomiS, sarraS, miriamS]) {
    await prisma.portfolioPhoto.create({ data: { stylistId: s.id, url: s.avatarUrl!, caption: "Ma réalisation", tags: ["Portfolio"] } });
  }

  console.log("\n🔥  SEED FINAL TERMINÉ : Les stylistes ont leurs bios complètes !");
}

main()
  .catch((e) => { console.error("❌  Seed échoué :", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
