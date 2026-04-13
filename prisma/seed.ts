/**
 * VicktyKof — Seed de Production
 * Initialise le compte administrateur officiel, les services, les produits et la galerie.
 * Supprime toutes les données de test (comptes fictifs, rendez-vous, commandes).
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" }); // Charge .env.local (URL Neon)
config();                        // Repli vers .env

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱  Initialisation de la base de données de production...\n");

  // ── 1. Nettoyage ──────────────────────────────────────────────────────────────
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
  console.log("✅  Tables vidées (Nettoyage de pré-production terminé)");

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
      image: "/images/team/vicky.svg",
    },
  });

  const vickyStylist = await prisma.stylist.create({
    data: {
      userId: vicky.id,
      bio: "Fondatrice de VicktyKof, Vicky pratique son art depuis plus de 15 ans. Reconnue pour sa précision en retwist et sa maîtrise des interlocks, elle accompagne chaque cliente vers des locs saines et élégantes.",
      yearsExp: 15,
      isActive: true,
      avatarUrl: vicky.image,
      specialties: ["RETWIST", "INTERLOCKS", "STARTER_LOCS", "LOC_MAINTENANCE"],
    },
  });
  console.log("✅  Compte Administrateur (Vicky) créé");

  // ── 3. Disponibilités de Vicky ────────────────────────────────────────────────
  // Lundi au Vendredi (9h - 18h)
  for (const day of [1, 2, 3, 4, 5]) {
    await prisma.availability.create({
      data: { stylistId: vickyStylist.id, dayOfWeek: day, startTime: "09:00", endTime: "18:00", isActive: true },
    });
  }
  console.log("✅  Disponibilités de base configurées");

  // ── 4. Services ──────────────────────────────────────────────────────────────
  const svcRetwist = await prisma.service.create({ data: {
    name: "Retwist Régulier", slug: "retwist-regulier",
    description: "Entretien complet de vos locs avec retwist professionnel pour un résultat net et durable. Inclut lavage et séchage.",
    durationMins: 90, basePrice: 85, depositPct: 30, category: "Entretien",
    imageUrl: "https://images.unsplash.com/photo-1556760544-74068565f05c?w=400&q=80",
  }});

  const svcRetwistSoin = await prisma.service.create({ data: {
    name: "Retwist + Soin Profond", slug: "retwist-soin",
    description: "Retwist accompagné d'un masque hydratant en profondeur à base d'huiles naturelles. Locs nourries et brillantes.",
    durationMins: 120, basePrice: 120, depositPct: 30, category: "Entretien",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  }});

  const svcStarterLocs = await prisma.service.create({ data: {
    name: "Starter Locs", slug: "starter-locs",
    description: "Création de vos locs de zéro : consultation, nettoyage, installation professionnelle. Inclut suivi 1 mois.",
    durationMins: 180, basePrice: 200, depositPct: 40, category: "Création",
    imageUrl: "https://images.unsplash.com/photo-1604480133435-25b86862d276?w=400&q=80",
  }});

  const svcInterlocks = await prisma.service.create({ data: {
    name: "Interlocks", slug: "interlocks",
    description: "Technique interlocking pour un entretien à long terme. Résultat structuré, tenue parfaite.",
    durationMins: 150, basePrice: 150, depositPct: 30, category: "Entretien",
    imageUrl: "https://images.unsplash.com/photo-1562887009-28b5a9e84c63?w=400&q=80",
  }});

  const svcTresses = await prisma.service.create({ data: {
    name: "Tresses Africaines", slug: "tresses-africaines",
    description: "Tresses traditionnelles africaines et box braids réalisées avec soin et précision. Extensions disponibles.",
    durationMins: 240, basePrice: 180, depositPct: 40, category: "Tresses",
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
  }});

  const svcCoiffure = await prisma.service.create({ data: {
    name: "Coiffure Style & Occasion", slug: "coiffure-style",
    description: "Mise en beauté, up-do ou style créatif pour mariage, graduation, événement. Consultation incluse.",
    durationMins: 90, basePrice: 95, depositPct: 30, category: "Style",
    imageUrl: "https://images.unsplash.com/photo-1583334648893-7b3a3a5c0c0f?w=400&q=80",
  }});

  const svcNaturel = await prisma.service.create({ data: {
    name: "Styles Naturels", slug: "styles-naturels",
    description: "Valorisez votre texture naturelle : twist out, wash and go, bantu knots, flexi rods.",
    durationMins: 75, basePrice: 70, depositPct: 30, category: "Style",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
  }});

  // Associer tous les services à Vicky
  const services = [svcRetwist, svcRetwistSoin, svcStarterLocs, svcInterlocks, svcTresses, svcCoiffure, svcNaturel];
  for (const service of services) {
    await prisma.stylistService.create({ data: { stylistId: vickyStylist.id, serviceId: service.id } });
  }
  console.log("✅  7 services créés et associés à Vicky");

  // ── 5. Catégories & Produits ─────────────────────────────────────────────────
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
        name: "Shampoing Clarifiant Naturel", slug: "shampoing-clarifiant-naturel",
        description: "Nettoyage en douceur sans sulfates agressifs. Élimine les résidus et hydrate le cuir chevelu.",
        price: 22, memberPrice: 18, stock: 30, sku: "VK-SCN-002",
        images: ["/images/products/apres-shampoing.svg"],
        categoryId: catSoins.id, isFeatured: false,
      },
      {
        name: "Huile de Ricin Extra-Pure", slug: "huile-ricin-extra-pure",
        description: "Huile de ricin 100% pure, pressée à froid. Stimule la croissance et renforce les locs.",
        price: 24, comparePrice: 30, memberPrice: 19, stock: 25, sku: "VK-HRP-005",
        images: ["/images/products/huile-ricin.svg"],
        categoryId: catHuiles.id, isFeatured: true,
      },
      {
        name: "Bonnet en Satin Luxe", slug: "bonnet-satin-luxe",
        description: "Bonnet de nuit en satin double couche. Protège vos locs pendant le sommeil.",
        price: 16, memberPrice: 12, stock: 50, sku: "VK-BSL-008",
        images: ["/images/products/bonnet-satin.svg"],
        categoryId: catAccessoires.id, isFeatured: false,
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
  console.log("✅  Produits et catégories de base créés");

  // ── 6. Galerie Photo ─────────────────────────────────────────────────────────
  const galleryPhotos = [
    { url: "/images/gallery/retwist.svg", caption: "Retwist en beauté", isFeatured: true },
    { url: "/images/gallery/box-braids.svg", caption: "Box braids travaillées", isFeatured: true },
    { url: "/images/gallery/starter-locs.svg", caption: "Starter locs installation", isFeatured: true },
    { url: "/images/gallery/coiffure-mariage.svg", caption: "Style mariage élégant", isFeatured: true },
    { url: "/images/gallery/goddess-locs.svg", caption: "Goddess locs volumineuses", isFeatured: true },
    { url: "/images/gallery/braids.svg", caption: "Styles naturels", isFeatured: true },
  ];

  for (const photo of galleryPhotos) {
    await prisma.galleryPhoto.create({ data: { ...photo, uploadedBy: vicky.id, altText: photo.caption } });
  }
  console.log("✅  Galerie initialisée");

  // ── 7. Portfolio Vicky ───────────────────────────────────────────────────────
  await prisma.portfolioPhoto.createMany({
    data: [
      { stylistId: vickyStylist.id, url: "/images/portfolio/vicky-1.svg", caption: "Maîtrise du retwist", tags: ["retwist"] },
      { stylistId: vickyStylist.id, url: "/images/portfolio/vicky-2.svg", caption: "Installation Starter Locs", tags: ["starter-locs"] },
      { stylistId: vickyStylist.id, url: "/images/portfolio/vicky-3.svg", caption: "Entretien de locs matures", tags: ["locs"] },
    ],
  });
  console.log("✅  Portfolio de Vicky créé");

  console.log("\n🚀  BASE DE DONNÉES PRÊTE POUR LA PRODUCTION !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  UTILISATEUR ADMIN");
  console.log("  Email    : vicktykoff@gmail.com");
  console.log("  Password : VicktyKof2026!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => { console.error("❌  Seed échoué :", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
