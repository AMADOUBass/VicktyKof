import type { Metadata } from "next";
import Link from "next/link";
import { CookieResetButton } from "@/components/ui/CookieResetButton";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-brand-beige mb-2">Politique de confidentialité</h1>
        <p className="text-brand-muted mb-8">Dernière mise à jour : 23 avril 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-brand-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">1. Responsable du traitement</h2>
            <p>
              <strong className="text-brand-beige">VicktyKof</strong><br />
              Propriétaire et responsable de la protection des renseignements personnels : <strong className="text-brand-beige">Vicky Koffi</strong><br />
              2177 rue du Carrousel, Québec (QC) G2B 5B5<br />
              Courriel : <a href="mailto:vicktykoff@gmail.com" className="text-brand-gold hover:underline">vicktykoff@gmail.com</a><br />
              Téléphone : (581) 745-7409
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">2. Données collectées</h2>
            <p>Nous collectons les renseignements personnels suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom complet et adresse courriel (inscription)</li>
              <li>Numéro de téléphone (optionnel, pour les rappels)</li>
              <li>Historique des rendez-vous et commandes</li>
              <li>Adresse de livraison (pour les commandes boutique)</li>
              <li>Photos téléchargées dans votre espace personnel</li>
              <li>Données de navigation anonymisées (pages visitées, durée de session)</li>
            </ul>
            <p className="mt-3">
              <strong className="text-brand-beige">Données de paiement :</strong> Nous ne stockons jamais vos informations de carte bancaire.
              Tous les paiements sont traités directement par Stripe, certifié PCI DSS Niveau 1.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">3. Finalités et base légale</h2>
            <div className="space-y-3">
              <div>
                <p><strong className="text-brand-beige">Gestion des réservations</strong> — Base : exécution du contrat de service</p>
              </div>
              <div>
                <p><strong className="text-brand-beige">Traitement des commandes boutique</strong> — Base : exécution du contrat de vente</p>
              </div>
              <div>
                <p><strong className="text-brand-beige">Envoi de confirmations et rappels par courriel</strong> — Base : exécution du contrat</p>
              </div>
              <div>
                <p><strong className="text-brand-beige">Communications marketing</strong> — Base : consentement explicite (vous pouvez retirer votre consentement en tout temps)</p>
              </div>
              <div>
                <p><strong className="text-brand-beige">Analyses d&apos;utilisation du site</strong> — Base : intérêt légitime (amélioration du service), avec votre consentement aux cookies analytiques</p>
              </div>
              <div>
                <p><strong className="text-brand-beige">Obligations légales</strong> — Base : obligation légale (conservation des données comptables)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">4. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-brand-beige">Compte utilisateur :</strong> Tant que le compte est actif, puis 12 mois après la dernière connexion</li>
              <li><strong className="text-brand-beige">Historique des rendez-vous :</strong> 2 ans</li>
              <li><strong className="text-brand-beige">Données de paiement et factures :</strong> 7 ans (obligation fiscale québécoise)</li>
              <li><strong className="text-brand-beige">Données de navigation :</strong> 13 mois maximum</li>
              <li><strong className="text-brand-beige">Journaux d&apos;envoi de courriels :</strong> 6 mois</li>
            </ul>
            <p className="mt-3">
              À l&apos;expiration de ces délais, vos données sont anonymisées ou supprimées de façon sécurisée.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">5. Tiers et prestataires</h2>
            <p>Vos données peuvent être transmises aux prestataires suivants, dans le cadre strict de leur mission :</p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>
                <strong className="text-brand-beige">Stripe</strong> (États-Unis) — Traitement des paiements en ligne.{" "}
                <a href="https://stripe.com/en-ca/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Politique de confidentialité Stripe</a>
              </li>
              <li>
                <strong className="text-brand-beige">Google (OAuth)</strong> (États-Unis) — Connexion via compte Google.{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Politique Google</a>
              </li>
              <li>
                <strong className="text-brand-beige">Neon / PostgreSQL</strong> (États-Unis) — Hébergement de la base de données, chiffrée au repos et en transit
              </li>
              <li>
                <strong className="text-brand-beige">Vercel</strong> (États-Unis) — Hébergement de l&apos;application web.{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Politique Vercel</a>
              </li>
              <li>
                <strong className="text-brand-beige">UploadThing</strong> (États-Unis) — Stockage des photos et fichiers téléversés
              </li>
              <li>
                <strong className="text-brand-beige">PostHog</strong> (États-Unis / EU) — Analyse d&apos;utilisation anonymisée, uniquement si vous avez accepté les cookies analytiques
              </li>
              <li>
                <strong className="text-brand-beige">Sentry</strong> (États-Unis) — Surveillance des erreurs techniques (aucune donnée personnelle sensible n&apos;est enregistrée)
              </li>
            </ul>
            <p className="mt-3">
              Tous ces prestataires sont liés par des engagements contractuels de confidentialité et opèrent selon des cadres reconnus (Standard Contractual Clauses ou équivalent).
            </p>
            <p className="mt-2">
              <strong className="text-brand-beige">Transferts internationaux :</strong> Certains prestataires (Stripe, Google, Vercel) sont établis aux États-Unis.
              Ces transferts sont encadrés par les clauses contractuelles types de l&apos;UE et respectent les exigences de la Loi 25 du Québec.
              Nous ne vendons jamais vos données à des tiers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">6. Vos droits</h2>
            <p>Conformément à la Loi 25 (Loi modernisant des dispositions législatives en matière de protection des renseignements personnels), vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-brand-beige">Accès :</strong> Obtenir une copie des données que nous détenons sur vous</li>
              <li><strong className="text-brand-beige">Rectification :</strong> Corriger des informations inexactes</li>
              <li><strong className="text-brand-beige">Suppression :</strong> Demander l&apos;effacement de votre compte et de vos données (hors obligations légales)</li>
              <li><strong className="text-brand-beige">Portabilité :</strong> Recevoir vos données dans un format structuré et lisible par machine</li>
              <li><strong className="text-brand-beige">Retrait du consentement :</strong> Retirer à tout moment votre consentement aux communications marketing</li>
            </ul>
            <p className="mt-3">
              <strong className="text-brand-beige">Comment exercer vos droits :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Depuis votre compte : <Link href="/account" className="text-brand-gold hover:underline">Mon profil → Zone de suppression</Link></li>
              <li>Par courriel : <a href="mailto:vicktykoff@gmail.com" className="text-brand-gold hover:underline">vicktykoff@gmail.com</a></li>
              <li>Par courrier : 2177 rue du Carrousel, Québec (QC) G2B 5B5</li>
            </ul>
            <p className="mt-3">
              Nous répondrons à votre demande dans un délai de 30 jours. En cas de litige non résolu, vous pouvez contacter la{" "}
              <a href="https://www.cai.gouv.qc.ca/" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">
                Commission d&apos;accès à l&apos;information du Québec (CAI)
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">7. Communications marketing (LCAP / CASL)</h2>
            <p>
              Conformément à la Loi canadienne anti-pourriel (LCAP/CASL), nous envoyons des courriels marketing
              uniquement si vous avez donné votre consentement explicite lors de l&apos;inscription.
            </p>
            <p className="mt-2">
              Chaque courriel marketing contient un lien de désabonnement. Vous pouvez également gérer vos préférences depuis{" "}
              <Link href="/account/notifications" className="text-brand-gold hover:underline">votre espace compte</Link>.
              Le désabonnement prend effet dans un délai de 10 jours ouvrables.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">8. Cookies et technologies de suivi</h2>
            <p>Nous utilisons les types de cookies suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong className="text-brand-beige">Essentiels :</strong> Session, authentification, panier — toujours actifs, nécessaires au fonctionnement</li>
              <li><strong className="text-brand-beige">Analytiques :</strong> PostHog (comportement de navigation anonymisé) — activés uniquement avec votre consentement</li>
              <li><strong className="text-brand-beige">Performance :</strong> Vercel Speed Insights, Vercel Analytics — données agrégées et anonymisées</li>
            </ul>
            <p className="mt-3">
              Vous pouvez modifier vos préférences de cookies à tout moment en utilisant le lien{" "}
              <CookieResetButton />.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              chiffrement SSL/TLS en transit, chiffrement au repos, contrôle d&apos;accès strict, et surveillance des erreurs
              via Sentry. Les mots de passe sont hachés avec bcrypt et ne sont jamais stockés en clair.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">10. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique ponctuellement. En cas de modification significative,
              nous vous en informerons par courriel ou par une bannière visible sur le site.
              La date de dernière mise à jour est toujours indiquée en haut de cette page.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
