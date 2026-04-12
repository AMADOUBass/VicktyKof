import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-brand-beige mb-2">Politique de confidentialité</h1>
        <p className="text-brand-muted mb-8">Dernière mise à jour : avril 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-brand-muted leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">1. Collecte des données</h2>
            <p>VicktyKof collecte les informations suivantes lors de votre utilisation de notre service :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nom, email et numéro de téléphone (lors de l&apos;inscription)</li>
              <li>Informations de paiement (traitées par Stripe, non stockées par nous)</li>
              <li>Historique des rendez-vous et commandes</li>
              <li>Photos téléchargées (galerie personnelle)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Gérer vos réservations et commandes</li>
              <li>Vous envoyer des confirmations et rappels par email</li>
              <li>Améliorer nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">3. Partage des données</h2>
            <p>
              Nous ne vendons pas vos données. Elles peuvent être partagées uniquement avec nos
              fournisseurs de service (Stripe pour les paiements, services d&apos;email) dans le cadre
              strict de notre fonctionnement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">4. Vos droits</h2>
            <p>
              Conformément à la loi 25 du Québec (LPRPDE), vous avez le droit d&apos;accéder,
              corriger ou supprimer vos données personnelles. Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:victykoff@gmail.com" className="text-brand-gold hover:underline">
                victykoff@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">5. Cookies</h2>
            <p>
              Nous utilisons des cookies essentiels pour le fonctionnement du site (session,
              authentification) et des cookies analytiques anonymisés pour améliorer l&apos;expérience.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">6. Contact</h2>
            <p>
              VicktyKof · 2177 rue du Carrousel, Québec G2B 5B5<br />
              Email : victykoff@gmail.com · Tél : (581) 745-7409
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
