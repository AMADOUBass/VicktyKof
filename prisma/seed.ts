/**
 * VicktyKof — Seed complet
 * Rôles : Vicky (ADMIN + Styliste principale), 3 Stylistes, 4 Clientes
 * Données : services, produits, rendez-vous, commandes, galerie, avis, portfolios
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" }); // load .env.local first (Neon URL)
config();                        // fallback to .env

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
  console.log("🌱  Début du seed VicktyKof...\n");

  // ── 1. Nettoyer ──────────────────────────────────────────────────────────────
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
  console.log("✅  Tables vidées");

  // ── 2. Utilisateurs ──────────────────────────────────────────────────────────

  // Admin + styliste principale
  const vicky = await prisma.user.create({
    data: {
      email: "vicky@vicktykof.com",
      name: "Vicky Koffi",
      phone: "418-555-0100",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("VickyAdmin2024!", 12),
      role: "ADMIN",
      isMember: true,
      memberSince: new Date("2020-01-01"),
      loyaltyPoints: 500,
      image: "/images/team/vicky.svg",
    },
  });

  const naomiUser = await prisma.user.create({
    data: {
      email: "naomi@vicktykof.com",
      name: "Naomi Traoré",
      phone: "418-555-0101",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Naomi2024!", 12),
      role: "STYLIST",
      isMember: true,
      memberSince: new Date("2021-03-15"),
      loyaltyPoints: 200,
      image: "/images/team/naomi.svg",
    },
  });

  const sarraUser = await prisma.user.create({
    data: {
      email: "sarra@vicktykof.com",
      name: "Sarra Diallo",
      phone: "418-555-0102",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Sarra2024!", 12),
      role: "STYLIST",
      isMember: true,
      memberSince: new Date("2022-06-01"),
      loyaltyPoints: 150,
      image: "/images/team/sarra.svg",
    },
  });

  const miriamUser = await prisma.user.create({
    data: {
      email: "miriam@vicktykof.com",
      name: "Miriam Osei",
      phone: "418-555-0103",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Miriam2024!", 12),
      role: "STYLIST",
      isMember: false,
      loyaltyPoints: 80,
      image: "/images/team/miriam.svg",
    },
  });

  // Clientes
  const aissatou = await prisma.user.create({
    data: {
      email: "aissatou@gmail.com",
      name: "Aissatou Ba",
      phone: "418-555-0200",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Cliente2024!", 12),
      role: "CLIENT",
      isMember: true,
      memberSince: new Date("2023-01-10"),
      loyaltyPoints: 320,
      image: "/images/team/aissatou.svg",
    },
  });

  const fatoumata = await prisma.user.create({
    data: {
      email: "fatoumata@outlook.com",
      name: "Fatoumata Coulibaly",
      phone: "418-555-0201",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Cliente2024!", 12),
      role: "CLIENT",
      isMember: false,
      loyaltyPoints: 90,
    },
  });

  const aminata = await prisma.user.create({
    data: {
      email: "aminata@gmail.com",
      name: "Aminata Konaté",
      phone: "418-555-0202",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Cliente2024!", 12),
      role: "CLIENT",
      isMember: true,
      memberSince: new Date("2023-09-05"),
      loyaltyPoints: 175,
    },
  });

  const rokia = await prisma.user.create({
    data: {
      email: "rokia@gmail.com",
      name: "Rokia Sanogo",
      phone: "418-555-0203",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Cliente2024!", 12),
      role: "CLIENT",
      isMember: false,
      loyaltyPoints: 40,
    },
  });

  console.log("✅  8 utilisateurs créés (1 admin, 3 stylistes, 4 clientes)");

  // ── 3. Profils stylistes ─────────────────────────────────────────────────────

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

  const naomiStylist = await prisma.stylist.create({
    data: {
      userId: naomiUser.id,
      bio: "Experte en tresses africaines et coiffures naturelles, Naomi est le choix parfait pour les box braids, cornrows et styles spéciaux pour occasions.",
      yearsExp: 8,
      isActive: true,
      avatarUrl: naomiUser.image,
      specialties: ["BRAIDING", "NATURAL_STYLES", "WOMENS_STYLING"],
    },
  });

  const sarraStylist = await prisma.stylist.create({
    data: {
      userId: sarraUser.id,
      bio: "Passionnée par les locs depuis l'enfance, Sarra excelle dans l'entretien et le retwist. Sa précision et son soin du détail font d'elle une styliste très demandée.",
      yearsExp: 5,
      isActive: true,
      avatarUrl: sarraUser.image,
      specialties: ["RETWIST", "LOC_MAINTENANCE", "INTERLOCKS"],
    },
  });

  const miriamStylist = await prisma.stylist.create({
    data: {
      userId: miriamUser.id,
      bio: "Styliste polyvalente spécialisée dans les styles naturels et les tresses traditionnelles. Miriam apporte fraîcheur et créativité à chaque coiffure.",
      yearsExp: 3,
      isActive: true,
      avatarUrl: miriamUser.image,
      specialties: ["NATURAL_STYLES", "BRAIDING", "STARTER_LOCS"],
    },
  });

  console.log("✅  4 profils stylistes créés");

  // ── 4. Disponibilités ────────────────────────────────────────────────────────

  // Vicky & Sarra : Lun–Ven
  for (const stylist of [vickyStylist, sarraStylist]) {
    for (const day of [1, 2, 3, 4, 5]) {
      await prisma.availability.create({
        data: { stylistId: stylist.id, dayOfWeek: day, startTime: "09:00", endTime: "18:00", isActive: true },
      });
    }
  }

  // Naomi & Miriam : Mar–Sam
  for (const stylist of [naomiStylist, miriamStylist]) {
    for (const day of [2, 3, 4, 5, 6]) {
      await prisma.availability.create({
        data: { stylistId: stylist.id, dayOfWeek: day, startTime: "10:00", endTime: "19:00", isActive: true },
      });
    }
  }

  console.log("✅  Disponibilités créées");

  // ── 5. Services ──────────────────────────────────────────────────────────────

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

  // Associer services aux stylistes
  const map = [
    { stylist: vickyStylist,  services: [svcRetwist, svcRetwistSoin, svcStarterLocs, svcInterlocks] },
    { stylist: naomiStylist,  services: [svcTresses, svcCoiffure, svcNaturel] },
    { stylist: sarraStylist,  services: [svcRetwist, svcRetwistSoin, svcInterlocks] },
    { stylist: miriamStylist, services: [svcNaturel, svcTresses, svcStarterLocs] },
  ];
  for (const { stylist, services } of map) {
    for (const service of services) {
      await prisma.stylistService.create({ data: { stylistId: stylist.id, serviceId: service.id } });
    }
  }

  console.log("✅  7 services créés et associés aux stylistes");

  // ── 6. Rendez-vous ───────────────────────────────────────────────────────────

  // Passés — COMPLETED
  const pastAppts = await Promise.all([
    prisma.appointment.create({ data: {
      clientId: aissatou.id, stylistId: vickyStylist.id, serviceId: svcRetwist.id,
      scheduledAt: daysAgo(30, 10), durationMins: 90, totalPrice: 85, depositAmount: 25.50, depositPct: 30,
      status: "COMPLETED", notes: "Cliente habituelle, locs de 2 ans. Résultat impeccable.",
    }}),
    prisma.appointment.create({ data: {
      clientId: fatoumata.id, stylistId: naomiStylist.id, serviceId: svcTresses.id,
      scheduledAt: daysAgo(22, 14), durationMins: 240, totalPrice: 180, depositAmount: 72, depositPct: 40,
      status: "COMPLETED", notes: "Box braids moyennes, longueur épaules",
    }}),
    prisma.appointment.create({ data: {
      clientId: aminata.id, stylistId: sarraStylist.id, serviceId: svcRetwistSoin.id,
      scheduledAt: daysAgo(15, 11), durationMins: 120, totalPrice: 120, depositAmount: 36, depositPct: 30,
      status: "COMPLETED", notes: "Soin à l'huile de ricin demandé. Locs très sèches.",
    }}),
    prisma.appointment.create({ data: {
      clientId: rokia.id, stylistId: miriamStylist.id, serviceId: svcStarterLocs.id,
      scheduledAt: daysAgo(10, 9), durationMins: 180, totalPrice: 200, depositAmount: 80, depositPct: 40,
      status: "COMPLETED",
    }}),
    prisma.appointment.create({ data: {
      clientId: aissatou.id, stylistId: vickyStylist.id, serviceId: svcInterlocks.id,
      scheduledAt: daysAgo(5, 13), durationMins: 150, totalPrice: 150, depositAmount: 45, depositPct: 30,
      status: "COMPLETED", adminNotes: "Excellent résultat. Cliente très satisfaite.",
    }}),
  ]);

  // À venir — ACCEPTED / CONFIRMED
  const futureAppts = await Promise.all([
    prisma.appointment.create({ data: {
      clientId: fatoumata.id, stylistId: vickyStylist.id, serviceId: svcRetwist.id,
      scheduledAt: daysFromNow(3, 10), durationMins: 90, totalPrice: 85, depositAmount: 25.50, depositPct: 30,
      status: "ACCEPTED", notes: "Première visite chez Vicky — référée par Aissatou",
    }}),
    prisma.appointment.create({ data: {
      clientId: aminata.id, stylistId: naomiStylist.id, serviceId: svcCoiffure.id,
      scheduledAt: daysFromNow(5, 14), durationMins: 90, totalPrice: 95, depositAmount: 28.50, depositPct: 30,
      status: "CONFIRMED", notes: "Mariage samedi — up-do élégant, inspiration jointe par courriel",
    }}),
    prisma.appointment.create({ data: {
      clientId: rokia.id, stylistId: sarraStylist.id, serviceId: svcRetwistSoin.id,
      scheduledAt: daysFromNow(7, 11), durationMins: 120, totalPrice: 120, depositAmount: 36, depositPct: 30,
      status: "ACCEPTED",
    }}),
    prisma.appointment.create({ data: {
      clientId: aissatou.id, stylistId: miriamStylist.id, serviceId: svcNaturel.id,
      scheduledAt: daysFromNow(12, 15), durationMins: 75, totalPrice: 70, depositAmount: 21, depositPct: 30,
      status: "CONFIRMED",
    }}),
  ]);

  // En attente — PENDING (pas encore payé)
  await prisma.appointment.create({ data: {
    clientId: fatoumata.id, stylistId: naomiStylist.id, serviceId: svcTresses.id,
    scheduledAt: daysFromNow(18, 10), durationMins: 240, totalPrice: 180, depositAmount: 72, depositPct: 40,
    status: "PENDING",
  }});

  // DECLINED pour demo
  await prisma.appointment.create({ data: {
    clientId: rokia.id, stylistId: vickyStylist.id, serviceId: svcStarterLocs.id,
    scheduledAt: daysAgo(3, 9), durationMins: 180, totalPrice: 200, depositAmount: 80, depositPct: 40,
    status: "DECLINED", adminNotes: "Créneau non disponible — cliente recontactée pour reprogrammer",
  }});

  console.log("✅  11 rendez-vous créés (5 complétés, 4 confirmés/acceptés, 1 en attente, 1 refusé)");

  // Paiements dépôts
  for (const [appt, stripeId] of [
    ...pastAppts.map((a, i) => [a, `pi_dep_past_00${i + 1}`] as const),
    [futureAppts[0], "pi_dep_fut_001"] as const,
    [futureAppts[2], "pi_dep_fut_003"] as const,
  ]) {
    await prisma.payment.create({
      data: {
        appointmentId: appt.id,
        stripePaymentId: stripeId,
        amount: parseFloat(appt.depositAmount.toString()),
        currency: "cad",
        status: "SUCCEEDED",
      },
    });
  }

  console.log("✅  Paiements de dépôts créés");

  // ── 7. Catégories & Produits ─────────────────────────────────────────────────

  const catSoins = await prisma.productCategory.create({ data: { name: "Soins capillaires", slug: "soins-capillaires" } });
  const catHuiles = await prisma.productCategory.create({ data: { name: "Huiles & Beurres", slug: "huiles-beurres" } });
  const catAccessoires = await prisma.productCategory.create({ data: { name: "Accessoires", slug: "accessoires" } });
  const catKits = await prisma.productCategory.create({ data: { name: "Kits & Coffrets", slug: "kits-coffrets" } });

  const cremeHydratante = await prisma.product.create({ data: {
    name: "Crème Hydratante Locs VK", slug: "creme-hydratante-locs-vk",
    description: "Formule exclusive VicktyKof à base d'aloe vera et beurre de karité. Hydrate en profondeur, définit et donne de l'éclat à vos locs. Sans silicone ni paraben.",
    price: 28, comparePrice: 35, memberPrice: 22, stock: 45, sku: "VK-CHL-001",
    images: ["/images/products/shampoing-locs.svg"],
    categoryId: catSoins.id, isFeatured: true,
  }});

  const shampoingClarifiant = await prisma.product.create({ data: {
    name: "Shampoing Clarifiant Naturel", slug: "shampoing-clarifiant-naturel",
    description: "Nettoyage en douceur sans sulfates agressifs. Élimine les résidus, hydrate le cuir chevelu et prépare vos locs pour le retwist.",
    price: 22, memberPrice: 18, stock: 30, sku: "VK-SCN-002",
    images: ["/images/products/apres-shampoing.svg"],
    categoryId: catSoins.id, isFeatured: false,
  }});

  const sprayHydratant = await prisma.product.create({ data: {
    name: "Spray Hydratant Quotidien", slug: "spray-hydratant-quotidien",
    description: "Spray léger à l'eau de rose et à l'huile de jojoba. Idéal le matin pour rafraîchir et hydrater vos locs sans les alourdir.",
    price: 18, stock: 60, sku: "VK-SHQ-003",
    images: ["/images/products/spray-refresh.svg"],
    categoryId: catSoins.id, isFeatured: true,
  }});

  const cirePalmier = await prisma.product.create({ data: {
    name: "Cire de Palmier Naturelle", slug: "cire-palmier-naturelle",
    description: "Cire légère pour styler et définir vos locs sans résidu. À base de cire de palmier biologique certifiée.",
    price: 19, stock: 3, sku: "VK-CPN-004", // Stock faible pour démo admin
    images: ["/images/products/cire-palmier.svg"],
    categoryId: catSoins.id, isFeatured: false,
  }});

  const huileRicin = await prisma.product.create({ data: {
    name: "Huile de Ricin Extra-Pure", slug: "huile-ricin-extra-pure",
    description: "Huile de ricin 100% pure, pressée à froid. Stimule la croissance, renforce les locs et nourrit le cuir chevelu. Certifiée biologique.",
    price: 24, comparePrice: 30, memberPrice: 19, stock: 25, sku: "VK-HRP-005",
    images: ["/images/products/huile-ricin.svg"],
    categoryId: catHuiles.id, isFeatured: true,
  }});

  const beurreKarite = await prisma.product.create({ data: {
    name: "Beurre de Karité Brut", slug: "beurre-karite-brut",
    description: "Beurre de karité non raffiné d'origine africaine (Burkina Faso). Scelle l'hydratation, protège les pointes et adoucit vos locs.",
    price: 20, memberPrice: 16, stock: 35, sku: "VK-BKB-006",
    images: ["/images/products/beurre-karite.svg"],
    categoryId: catHuiles.id, isFeatured: false,
  }});

  const melangeHuiles = await prisma.product.create({ data: {
    name: "Synergie d'Huiles Essentielles Locs", slug: "synergie-huiles-essentielles-locs",
    description: "Mélange exclusif VicktyKof : tea tree, romarin et lavande. Purifie le cuir chevelu, réduit les démangeaisons et stimule la croissance.",
    price: 32, comparePrice: 40, memberPrice: 26, stock: 20, sku: "VK-SHE-007",
    images: ["/images/products/huile-argan.svg"],
    categoryId: catHuiles.id, isFeatured: true,
  }});

  const bonnetSatin = await prisma.product.create({ data: {
    name: "Bonnet en Satin Luxe", slug: "bonnet-satin-luxe",
    description: "Bonnet de nuit en satin double couche, or et noir. Protège vos locs pendant le sommeil, réduit la friction et l'évaporation de l'humidité.",
    price: 16, memberPrice: 12, stock: 50, sku: "VK-BSL-008",
    images: ["/images/products/bonnet-satin.svg"],
    categoryId: catAccessoires.id, isFeatured: false,
  }});

  const aiguilleInterlocks = await prisma.product.create({ data: {
    name: "Kit Aiguilles à Interlocks Pro", slug: "kit-aiguilles-interlocks-pro",
    description: "Set professionnel de 3 aiguilles en acier inoxydable pour la technique interlocking. Tailles S, M, L avec pochette de rangement.",
    price: 18, stock: 40, sku: "VK-KAI-009",
    images: ["/images/products/aiguille-interlocks.svg"],
    categoryId: catAccessoires.id, isFeatured: false,
  }});

  const elastiques = await prisma.product.create({ data: {
    name: "Élastiques Sans Métal (200 pcs)", slug: "elastiques-sans-metal",
    description: "Élastiques doux en coton, sans métal. Parfaits pour attacher vos locs sans les endommager ni laisser de marques.",
    price: 8, stock: 100, sku: "VK-ESM-010",
    images: ["/images/products/elastiques-satin.svg"],
    categoryId: catAccessoires.id, isFeatured: false,
  }});

  const kitStarter = await prisma.product.create({ data: {
    name: "Kit Starter Locs Complet", slug: "kit-starter-locs-complet",
    description: "Tout ce qu'il faut pour démarrer vos locs du bon pied : crème hydratante, shampoing, huile de ricin et bonnet. Valeur 90$. Livret de conseils inclus.",
    price: 68, comparePrice: 90, memberPrice: 55, stock: 15, sku: "VK-KSL-011",
    images: ["/images/products/coffret-entretien.svg"],
    categoryId: catKits.id, isFeatured: true,
  }});

  const coffretEntretien = await prisma.product.create({ data: {
    name: "Coffret Entretien Mensuel Membre", slug: "coffret-entretien-mensuel",
    description: "Coffret exclusif réservé aux membres VicktyKof : spray quotidien, beurre de karité et synergie d'huiles. Tout pour entretenir vos locs un mois.",
    price: 58, comparePrice: 70, memberPrice: 45, stock: 10, sku: "VK-CEM-012",
    images: ["/images/products/huile-coco.svg"],
    categoryId: catKits.id, isFeatured: true, isMemberOnly: true,
  }});

  console.log("✅  12 produits créés (4 catégories)");

  // ── 8. Commandes ─────────────────────────────────────────────────────────────

  // Commande livrée — Aissatou (membre, prix membres)
  const order1 = await prisma.order.create({
    data: {
      userId: aissatou.id, status: "DELIVERED",
      subtotal: 59, tax: 8.84, shipping: 0, total: 67.84,
      shippingAddress: { name: "Aissatou Ba", address: { line1: "123 Rue des Locs", city: "Québec", state: "QC", postal_code: "G1R 1A1", country: "CA" } },
      items: { create: [
        { productId: cremeHydratante.id, quantity: 1, unitPrice: 22, total: 22 },
        { productId: huileRicin.id, quantity: 1, unitPrice: 19, total: 19 },
        { productId: sprayHydratant.id, quantity: 1, unitPrice: 18, total: 18 },
      ]},
    },
  });
  await prisma.payment.create({ data: { orderId: order1.id, stripePaymentId: "pi_ord_001", amount: 67.84, currency: "cad", status: "SUCCEEDED" } });

  // Commande livrée — Aminata (membre)
  const order2 = await prisma.order.create({
    data: {
      userId: aminata.id, status: "DELIVERED",
      subtotal: 111, tax: 16.62, shipping: 0, total: 127.62,
      shippingAddress: { name: "Aminata Konaté", address: { line1: "789 Boul. Charest", city: "Québec", state: "QC", postal_code: "G1K 3A1", country: "CA" } },
      items: { create: [
        { productId: kitStarter.id, quantity: 1, unitPrice: 55, total: 55 },
        { productId: melangeHuiles.id, quantity: 1, unitPrice: 26, total: 26 },
        { productId: beurreKarite.id, quantity: 2, unitPrice: 16, total: 32 },
      ]},
    },
  });
  await prisma.payment.create({ data: { orderId: order2.id, stripePaymentId: "pi_ord_002", amount: 127.62, currency: "cad", status: "SUCCEEDED" } });

  // Commande expédiée — Fatoumata (avec aiguilles interlocks)
  const order3 = await prisma.order.create({
    data: {
      userId: fatoumata.id, status: "SHIPPED",
      subtotal: 56, tax: 8.39, shipping: 0, total: 64.39,
      trackingNumber: "CA123456789CA",
      shippingAddress: { name: "Fatoumata Coulibaly", address: { line1: "456 Ave Laurier", city: "Québec", state: "QC", postal_code: "G1R 2B2", country: "CA" } },
      items: { create: [
        { productId: shampoingClarifiant.id, quantity: 1, unitPrice: 22, total: 22 },
        { productId: bonnetSatin.id, quantity: 1, unitPrice: 16, total: 16 },
        { productId: aiguilleInterlocks.id, quantity: 1, unitPrice: 18, total: 18 },
      ]},
    },
  });
  await prisma.payment.create({ data: { orderId: order3.id, stripePaymentId: "pi_ord_003", amount: 64.39, currency: "cad", status: "SUCCEEDED" } });

  // Commande en attente — Rokia (avec cire palmier et coffret membre)
  await prisma.order.create({
    data: {
      userId: rokia.id, status: "PENDING",
      subtotal: 85, tax: 12.73, shipping: 0, total: 97.73,
      items: { create: [
        { productId: cirePalmier.id, quantity: 1, unitPrice: 19, total: 19 },
        { productId: elastiques.id, quantity: 1, unitPrice: 8, total: 8 },
        { productId: coffretEntretien.id, quantity: 1, unitPrice: 58, total: 58 },
      ]},
    },
  });

  console.log("✅  4 commandes créées (2 livrées, 1 expédiée, 1 en attente)");

  // ── 9. Avis produits ─────────────────────────────────────────────────────────

  await prisma.review.createMany({
    data: [
      { userId: aissatou.id, productId: cremeHydratante.id, rating: 5, body: "Produit incroyable ! Mes locs n'ont jamais été aussi hydratées. Texture parfaite, sent divinement bon. Je recommande à toutes.", isPublic: true },
      { userId: aminata.id, productId: cremeHydratante.id, rating: 5, body: "La meilleure crème que j'ai testée pour mes locs depuis des années. Résultat visible dès la première application.", isPublic: true },
      { userId: fatoumata.id, productId: cremeHydratante.id, rating: 4, body: "Très bonne crème, bien hydratante. Je lui enlève une étoile car le couvercle est un peu difficile à fermer.", isPublic: true },
      { userId: aissatou.id, productId: huileRicin.id, rating: 5, body: "Pure et efficace. Mes locs ont clairement poussé plus vite depuis que j'utilise cette huile. Qualité au rendez-vous.", isPublic: true },
      { userId: aminata.id, productId: kitStarter.id, rating: 5, body: "Kit parfait pour débuter les locs ! Tout est de qualité et le livret de conseils est une vraie valeur ajoutée.", isPublic: true },
      { userId: rokia.id, productId: sprayHydratant.id, rating: 4, body: "Spray léger et agréable. L'odeur à la rose est douce, parfait le matin. Un peu cher mais la qualité est là.", isPublic: true },
      { userId: fatoumata.id, productId: melangeHuiles.id, rating: 5, body: "Enfin une solution naturelle pour mes démangeaisons ! Le tea tree fait des merveilles. Mon cuir chevelu respire.", isPublic: true },
      { userId: aminata.id, productId: beurreKarite.id, rating: 5, body: "Karité pur, ça se sent tout de suite. Mes locs sont souples et nourries. Commande déjà passée pour une 2e fois !", isPublic: true },
    ],
  });

  console.log("✅  8 avis produits créés");

  // ── 10. Galerie ──────────────────────────────────────────────────────────────

  const galleryPhotos = [
    { url: "/images/gallery/retwist.svg",          caption: "Retwist en beauté — résultat final",      altText: "Locs retwistées, résultat net et brillant",        tags: ["locs", "retwist", "avant-après"],       isFeatured: true },
    { url: "/images/gallery/box-braids.svg",        caption: "Box braids longues — travail de Naomi",  altText: "Box braids longues élaborées",                    tags: ["tresses", "box-braids", "naomi"],       isFeatured: true },
    { url: "/images/gallery/starter-locs.svg",      caption: "Starter locs — 3 mois après installation", altText: "Locs débutantes après 3 mois",                tags: ["locs", "starter-locs", "résultat"],     isFeatured: true },
    { url: "/images/gallery/coiffure-mariage.svg",  caption: "Style Up-do pour mariage",               altText: "Coiffure de mariage élégante",                    tags: ["coiffure", "style", "mariage"],         isFeatured: true },
    { url: "/images/gallery/interlocks.svg",        caption: "Interlocks précis — par Sarra",          altText: "Technique interlocking professionnelle",           tags: ["interlocks", "sarra", "précision"],     isFeatured: false },
    { url: "/images/gallery/locs-matures.svg",      caption: "Locs matures — 5 ans de croissance",    altText: "Locs longues et matures",                         tags: ["locs", "mature", "long"],               isFeatured: false },
    { url: "/images/gallery/goddess-locs.svg",      caption: "Goddess locs — style bohème",            altText: "Goddess locs volumineuses",                       tags: ["goddess-locs", "style", "volume"],      isFeatured: true },
    { url: "/images/gallery/protective-style.svg",  caption: "VicktyKof — protective style",           altText: "Protective style élaboré au salon VicktyKof",     tags: ["salon", "protective", "style"],         isFeatured: false },
    { url: "/images/gallery/faux-locs.svg",         caption: "Faux locs bohème — résultat naturel",    altText: "Faux locs bohème après installation",             tags: ["faux-locs", "bohème", "naturel"],       isFeatured: false },
    { url: "/images/gallery/updo.svg",              caption: "Up-do élégant — occasion spéciale",      altText: "Coiffure up-do pour occasion",                    tags: ["updo", "élégant", "occasion"],          isFeatured: false },
    { url: "/images/gallery/locs-color.svg",        caption: "Locs colorés — nuances caramel",         altText: "Locs avec reflets caramel",                       tags: ["locs", "couleur", "caramel"],           isFeatured: false },
    { url: "/images/gallery/braids.svg",            caption: "Style afro — liberté et fierté",         altText: "Tresses afro style naturel",                      tags: ["naturel", "afro", "tresses"],           isFeatured: true },
  ];

  for (const photo of galleryPhotos) {
    await prisma.galleryPhoto.create({ data: { ...photo, uploadedBy: vicky.id } });
  }

  console.log("✅  12 photos de galerie créées (6 en vedette)");

  // ── 11. Portfolios stylistes ─────────────────────────────────────────────────

  const portfolioData = [
    { stylistId: vickyStylist.id, photos: [
      { url: "/images/portfolio/vicky-1.svg", caption: "Retwist signature — ma spécialité", tags: ["retwist"] },
      { url: "/images/portfolio/vicky-2.svg", caption: "Starter locs — installation 2024",  tags: ["starter-locs"] },
      { url: "/images/portfolio/vicky-3.svg", caption: "Locs matures 5 ans",                tags: ["locs", "mature"] },
      { url: "/images/gallery/interlocks.svg", caption: "Interlocks — finition parfaite",   tags: ["interlocks"] },
    ]},
    { stylistId: naomiStylist.id, photos: [
      { url: "/images/portfolio/naomi-1.svg", caption: "Box braids — 6h de travail minutieux", tags: ["box-braids"] },
      { url: "/images/portfolio/naomi-2.svg", caption: "Coiffure de mariage élaborée",         tags: ["mariage"] },
      { url: "/images/portfolio/naomi-3.svg", caption: "Goddess locs volumineuses",            tags: ["goddess-locs"] },
    ]},
    { stylistId: sarraStylist.id, photos: [
      { url: "/images/portfolio/sarra-1.svg", caption: "Retwist précis — mon travail",      tags: ["retwist"] },
      { url: "/images/portfolio/sarra-2.svg", caption: "Soin + retwist — résultat brillant",tags: ["retwist", "soin"] },
      { url: "/images/portfolio/sarra-3.svg", caption: "Locs entretenues — 2 ans",          tags: ["locs"] },
    ]},
    { stylistId: miriamStylist.id, photos: [
      { url: "/images/portfolio/miriam-1.svg", caption: "Tresses africaines classiques",    tags: ["tresses"] },
      { url: "/images/portfolio/miriam-2.svg", caption: "Style naturel — protective style", tags: ["naturel"] },
    ]},
  ];

  for (const { stylistId, photos } of portfolioData) {
    for (const photo of photos) {
      await prisma.portfolioPhoto.create({ data: { stylistId, ...photo } });
    }
  }

  console.log("✅  12 photos de portfolio créées (4 stylistes)");

  // ── 12. Résumé ───────────────────────────────────────────────────────────────

  console.log("\n🎉  Seed terminé avec succès !\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  COMPTES DE TEST");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ADMIN    vicky@vicktykof.com         VickyAdmin2024!");
  console.log("  STYLIST  naomi@vicktykof.com         Naomi2024!");
  console.log("  STYLIST  sarra@vicktykof.com         Sarra2024!");
  console.log("  STYLIST  miriam@vicktykof.com        Miriam2024!");
  console.log("  CLIENT   aissatou@gmail.com          Cliente2024!   ★ Membre");
  console.log("  CLIENT   fatoumata@outlook.com       Cliente2024!");
  console.log("  CLIENT   aminata@gmail.com           Cliente2024!   ★ Membre");
  console.log("  CLIENT   rokia@gmail.com             Cliente2024!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  7 services · 12 produits · 4 catégories");
  console.log("  11 RDV (5 complétés, 4 confirmés, 1 en attente, 1 refusé)");
  console.log("  4 commandes · 8 avis · 12 photos galerie · 12 portfolio");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => { console.error("❌  Seed échoué :", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
