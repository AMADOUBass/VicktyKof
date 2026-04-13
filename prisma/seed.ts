/**
 * VicktyKof — Seed de Production (Restauration Photos IA Nanobana)
 * Initialise le compte administrateur officiel et les visuels premium générés.
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
  console.log("🌱  Restauration des visuels PREMIUM (IA Nanobana)...\n");

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

  // ── 2. Administrateur Unique (Vicky) ──────────────────────────────────────────
  const vicky = await prisma.user.create({
    data: {
      email: "vicktykoff@gmail.com",
      name: "Vicky Koffi",
      phone: "(581) 745-7409",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("VicktyKof2026!", 12),
      role: "ADMIN",
      isMember: true,
      memberSince: new Date(),
      loyaltyPoints: 0,
      image: "/images/vicky-portrait.png", 
    },
  });

  const vickyStylist = await prisma.stylist.create({
    data: {
      userId: vicky.id,
      bio: "Fondatrice de VicktyKof, Vicky pratique son art depuis plus de 15 ans. Reconnue pour sa précision en retwist et sa maîtrise des interlocks, elle accompagne chaque cliente vers des locs saines et élégantes.",
      yearsExp: 15,
      isActive: true,
      avatarUrl: "/images/vicky-portrait.png",
      specialties: ["RETWIST", "INTERLOCKS", "STARTER_LOCS", "LOC_MAINTENANCE"],
    },
  });

  for (const day of [1, 2, 3, 4, 5]) {
    await prisma.availability.create({
      data: { stylistId: vickyStylist.id, dayOfWeek: day, startTime: "09:00", endTime: "18:00", isActive: true },
    });
  }

  // ── 4. Services (IMAGES IA) ──────────────────────────────────────────────────
  const svcRetwist = await prisma.service.create({ data: {
    name: "Retwist Régulier", slug: "retwist-regulier",
    description: "Entretien complet de vos locs avec retwist professionnel pour un résultat net et durable. Inclut lavage et séchage.",
    durationMins: 90, basePrice: 85, depositPct: 30, category: "Entretien",
    imageUrl: "/images/services/retwist.png",
  }});

  const svcRetwistSoin = await prisma.service.create({ data: {
    name: "Retwist + Soin Profond", slug: "retwist-soin",
    description: "Retwist accompagné d'un masque hydratant en profondeur à base d'huiles naturelles. Locs nourries et brillantes.",
    durationMins: 120, basePrice: 120, depositPct: 30, category: "Entretien",
    imageUrl: "/images/services/hair-care.png",
  }});

  const svcStarterLocs = await prisma.service.create({ data: {
    name: "Starter Locs", slug: "starter-locs",
    description: "Création de vos locs de zéro : consultation, nettoyage, installation professionnelle. Inclut suivi 1 mois.",
    durationMins: 180, basePrice: 200, depositPct: 40, category: "Création",
    imageUrl: "/images/services/starter-locs.png",
  }});

  const svcInterlocks = await prisma.service.create({ data: {
    name: "Interlocks", slug: "interlocks",
    description: "Technique interlocking pour un entretien à long terme. Résultat structuré, tenue parfaite.",
    durationMins: 150, basePrice: 150, depositPct: 30, category: "Entretien",
    imageUrl: "/images/services/interlocks.png",
  }});

  const svcTresses = await prisma.service.create({ data: {
    name: "Tresses Africaines", slug: "tresses-africaines",
    description: "Tresses traditionnelles africaines et box braids réalisées avec soin et précision. Extensions disponibles.",
    durationMins: 240, basePrice: 180, depositPct: 40, category: "Tresses",
    imageUrl: "/images/services/braids.png",
  }});

  const svcCoiffure = await prisma.service.create({ data: {
    name: "Coiffure Style & Occasion", slug: "coiffure-style",
    description: "Mise en beauté, up-do ou style créatif pour mariage, graduation, événement. Consultation incluse.",
    durationMins: 90, basePrice: 95, depositPct: 30, category: "Style",
    imageUrl: "/images/gallery/updo.png",
  }});

  const svcNaturel = await prisma.service.create({ data: {
    name: "Styles Naturels", slug: "styles-naturels",
    description: "Valorisez votre texture naturelle : twist out, wash and go, bantu knots, flexi rods.",
    durationMins: 75, basePrice: 70, depositPct: 30, category: "Style",
    imageUrl: "/images/services/natural-styles.png",
  }});

  const services = [svcRetwist, svcRetwistSoin, svcStarterLocs, svcInterlocks, svcTresses, svcCoiffure, svcNaturel];
  for (const service of services) {
    await prisma.stylistService.create({ data: { stylistId: vickyStylist.id, serviceId: service.id } });
  }

  // ── 5. Produits ──────────────────────────────────────────────────────────────
  const catSoins = await prisma.productCategory.create({ data: { name: "Soins capillaires", slug: "soins-capillaires" } });
  const catHuiles = await prisma.productCategory.create({ data: { name: "Huiles & Beurres", slug: "huiles-beurres" } });
  const catAccessoires = await prisma.productCategory.create({ data: { name: "Accessoires", slug: "accessoires" } });
  const catKits = await prisma.productCategory.create({ data: { name: "Kits & Coffrets", slug: "kits-coffrets" } });

  await prisma.product.createMany({
    data: [
      {
        name: "Crème Hydratante Locs VK", slug: "creme-hydratante-locs-vk",
        description: "Formule exclusive VicktyKof à base d'aloe vera et beurre de karité. Hydrate en profondeur, définit et donne de l'éclat à vos locs.",
        price: 28, comparePrice: 35, memberPrice: 22, stock: 45, sku: "VK-CHL-001",
        images: ["/images/products/shampoing-locs.svg"],
        categoryId: catSoins.id, isFeatured: true,
      },
      {
        name: "Huile de Ricin Extra-Pure", slug: "huile-ricin-extra-pure",
        description: "Huile de ricin 100% pure, pressée à froid. Stimule la croissance et renforce les locs.",
        price: 24, comparePrice: 30, memberPrice: 19, stock: 25, sku: "VK-HRP-005",
        images: ["/images/products/huile-ricin.svg"],
        categoryId: catHuiles.id, isFeatured: true,
      },
      {
        name: "Kit Starter Locs Complet", slug: "kit-starter-locs-complet",
        description: "Tout ce qu'il faut pour démarrer vos locs : crème, shampoing, huile et bonnet.",
        price: 68, comparePrice: 90, memberPrice: 55, stock: 15, sku: "VK-KSL-011",
        images: ["/images/products/coffret-entretien.svg"],
        categoryId: catKits.id, isFeatured: true,
      },
    ],
  });

  // ── 6. Galerie (IMAGES IA) ──────────────────────────────────────────────────
  const galleryPhotos = [
    { url: "/images/gallery/retwist-signature.png", caption: "Retwist Signature", isFeatured: true },
    { url: "/images/gallery/starter-locs.png", caption: "Installation Starter Locs", isFeatured: true },
    { url: "/images/gallery/interlocks.png", caption: "Finition Interlocks", isFeatured: true },
    { url: "/images/gallery/braids.png", caption: "Styles Naturels", isFeatured: true },
    { url: "/images/gallery/updo.png", caption: "Style Coiffure Up-do", isFeatured: true },
    { url: "/images/services/hair-care.png", caption: "Soin Profond", isFeatured: true },
  ];

  for (const photo of galleryPhotos) {
    await prisma.galleryPhoto.create({ data: { ...photo, uploadedBy: vicky.id, altText: photo.caption } });
  }

  // ── 7. Portfolio Vicky (IMAGES IA) ──────────────────────────────────────────
  await prisma.portfolioPhoto.createMany({
    data: [
      { stylistId: vickyStylist.id, url: "/images/services/retwist.png", caption: "Maîtrise du retwist", tags: ["retwist"] },
      { stylistId: vickyStylist.id, url: "/images/services/starter-locs.png", caption: "Installation Professionnelle", tags: ["starter-locs"] },
      { stylistId: vickyStylist.id, url: "/images/services/interlocks.png", caption: "Entretien Interlocks", tags: ["interlocks"] },
    ],
  });

  console.log("\n🚀  BASE DE DONNÉES RESTAURÉE AVEC LES VISUELS PREMIUM !");
}

main()
  .catch((e) => { console.error("❌  Seed échoué :", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
