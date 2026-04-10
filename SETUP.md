# VicktyKof — Guide de démarrage

## Prérequis

- Node.js 22+ (LTS)
- PostgreSQL 17+
- Compte Stripe (test ou production)
- Compte UploadThing (fichiers)
- Gmail avec App Password (emails)

---

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# Remplir toutes les valeurs dans .env.local

# 3. Créer la base de données PostgreSQL
createdb vicktykof

# 4. Appliquer le schéma
npm run db:push

# 5. Générer le client Prisma
npm run db:generate

# 6. Seed (données de départ)
npm run db:seed

# 7. Lancer le serveur de développement
npm run dev
```

Ouvrir http://localhost:3000

---

## Comptes par défaut (après seed)

| Email | Mot de passe | Rôle |
|---|---|---|
| vicktykoff@gmail.com | VicktyKof2025! | ADMIN |
| styliste2@vicktykof.com | Styliste2025! | STYLIST |

> **Changer les mots de passe immédiatement en production !**

---

## Stripe — Configuration Webhook

```bash
# Installation Stripe CLI
stripe listen --forward-to localhost:3000/api/payments/webhook

# Copier le webhook secret affiché dans .env.local
# STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Structure des dossiers

```
src/
├── app/
│   ├── (auth)/        # Login, Signup
│   ├── (public)/      # Pages publiques
│   ├── (admin)/       # Dashboard admin
│   ├── (stylist)/     # Portail styliste
│   └── api/           # Routes API
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── home/          # Sections homepage
│   ├── booking/       # Wizard de réservation
│   ├── shop/          # E-commerce
│   ├── gallery/       # Galerie photos
│   └── admin/         # Dashboard components
├── lib/
│   ├── auth.ts        # NextAuth v5
│   ├── prisma.ts      # Client Prisma
│   ├── stripe.ts      # Stripe helpers
│   ├── email.ts       # Nodemailer + templates
│   └── utils.ts       # Utilitaires
├── hooks/
│   └── useCartStore.ts # Zustand cart
└── types/
    └── next-auth.d.ts  # Type extensions
prisma/
├── schema.prisma       # Modèle de données
└── seed.ts             # Données initiales
```

---

## Déploiement Vercel

1. Pousser le code sur GitHub
2. Importer le projet dans Vercel
3. Configurer les variables d'environnement
4. Ajouter le webhook Stripe en production : `https://votre-domaine.com/api/payments/webhook`
5. Mettre à jour `NEXT_PUBLIC_APP_URL`

---

## Variables d'environnement requises

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL |
| `AUTH_SECRET` | Secret NextAuth (32+ chars) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `SMTP_*` | Configuration email |
| `UPLOADTHING_*` | Upload de fichiers |

---

## Fonctionnalités implémentées

- [x] Système de réservation 4 étapes (service → styliste → date → paiement)
- [x] Paiement de dépôt Stripe Checkout
- [x] Webhook Stripe (dépôts + commandes)
- [x] Authentification NextAuth v5 (email + Google OAuth)
- [x] Dashboard admin complet
- [x] E-commerce avec panier Zustand persistant
- [x] Galerie avec lightbox et filtres par tags
- [x] Système de membres avec prix exclusifs
- [x] Emails transactionnels (confirmation, acceptation, refus, rappel)
- [x] Remboursement automatique si rendez-vous refusé
- [x] Middleware de protection des routes
- [x] Gestion des disponibilités dynamique
- [x] Détection de conflits de créneaux
- [x] Pages légales (CGU, confidentialité, retours, remboursements)
- [x] SEO complet (metadata, OpenGraph, Twitter Cards)
- [x] Design premium noir/or/beige avec animations Framer Motion
- [x] TypeScript strict mode

---

## Prochaines étapes recommandées

1. **Photos réelles** — Remplacer les placeholders par de vraies photos du salon
2. **UploadThing** — Configurer l'upload d'images pour la galerie et les produits
3. **SMS rappels** — Intégrer Twilio pour les rappels par SMS
4. **Google Maps** — Intégrer la carte Google Maps dans la page contact
5. **Analytics** — Ajouter Vercel Analytics ou Plausible
6. **Tests** — Ajouter Vitest + Playwright E2E
7. **IA** — Système de recommandation de styles selon profil
