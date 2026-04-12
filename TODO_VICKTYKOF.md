# 📋 TODO : Lancement VicktyKof

Ce document récapitule l'état d'avancement du projet.

## 1. Optimisation Mobile (UX/UI) ✅

- [x] **ServicesSection** : Design "Full-Card" avec images en arrière-plan (Luxe).
- [x] **GalleryPreview** : Harmonisation des ratios et suppression des espaces vides.
- [x] **TeamPreview** : Portraits lifestyle (rectangulaires) pour un aspect premium.
- [x] **Navigation** : Boutons CTA empilés verticalement et menu hautement visible.

## 2. Emails & Paiements ✅

- [x] **Relais SMTP** : Configuration Gmail effectuée et testée.
- [x] **Flux Interac** : Création de l'email automatique d'instructions.
- [x] **Tests complets** : Validation du parcours client du RDV à la confirmation.
- [x] **Encodage** : Nettoyage de tous les caractères spéciaux (accents) dans les emails.

## 3. Visibilité & SEO ✨

- [x] **Meta Tags** : Titres et descriptions optimisés pour chaque page.
- [x] **OpenGraph** : Nouvelle image de marque premium pour les partages.
- [x] **Données Structurées** : Intégration JSON-LD (LocalBusiness).
- [x] **Fichiers Techniques** : Génération de `sitemap.xml` et `robots.txt`.

## 4. Configuration Finale & Remise (À faire) 🚀

- [ ] CONFIGURATION GOOGLE AUTH (Production)
    - [ ] **Google Cloud Console** :
        - [ ] Ajouter `https://vicktykof.com` aux **Authorized Origins**.
        - [ ] Ajouter `https://vicktykof.com/api/auth/callback/google` aux **Authorized Redirect URIs**.
    - [ ] **Variables d'Environnement Vercel** :
        - [ ] `AUTH_GOOGLE_ID`
        - [ ] `AUTH_GOOGLE_SECRET`
        - [ ] `AUTH_SECRET` (Clé de sécurité générée)
- [ ] CONFIGURATION EMAILS CLIENT (A faire avec Vicky)
    - [ ] Obtenir un "App Password" pour son compte Gmail (si 2FA activé)
    - [ ] Mettre à jour les variables SMTP_USER et SMTP_PASS dans Vercel
    - [ ] Valider l'adresse email de réception des virements Interac (Yahoo ou Gmail ?).
- [ ] **LANCEMENT LIVE**
  - [ ] Configurer les clés Stripe "Live" dans Vercel.
  - [ ] Connecter le domaine final `vicktykof.com`.
- [ ] **REMISE CLIENTE**
  - [ ] Démo du Dashboard Admin à Vicky.
  - [ ] Partager les [RECOMMANDATIONS_TECHNIQUES.html](file:///c:/Dev/VicktyKof/RECOMMANDATIONS_TECHNIQUES.html).
  - [ ] Enregistrement Google My Business.

---

_💡 Astuce : Le site est maintenant techniquement prêt pour le succès !_
