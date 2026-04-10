import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Retours & Échanges" };

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-brand-beige mb-2">Retours & Échanges</h1>
        <p className="text-brand-muted mb-8">Politique en vigueur depuis janvier 2025</p>

        <div className="space-y-8 text-brand-muted leading-relaxed">
          <section className="card">
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">Produits — 14 jours</h2>
            <p>
              Vous disposez de <strong className="text-brand-beige">14 jours</strong> à compter de la
              réception pour retourner un produit non ouvert et en parfait état. Les produits ouverts
              ou utilisés ne peuvent être retournés pour des raisons d&apos;hygiène.
            </p>
            <h3 className="font-semibold text-brand-beige mt-4 mb-2">Procédure :</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Contactez-nous à vicktykoff@gmail.com avec votre numéro de commande</li>
              <li>Attendez notre confirmation de retour sous 48h</li>
              <li>Expédiez le produit à vos frais à notre adresse</li>
              <li>Remboursement sous 5-10 jours ouvrables après réception</li>
            </ol>
          </section>

          <section className="card">
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">Échanges</h2>
            <p>
              Les échanges sont possibles pour les produits défectueux ou si vous avez reçu
              le mauvais article. Contactez-nous dans les 48h suivant la réception.
            </p>
          </section>

          <section className="card">
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">Services — Non remboursables</h2>
            <p>
              Les services de coiffure ne sont pas remboursables une fois réalisés. Les dépôts
              de réservation sont remboursables uniquement si le rendez-vous est annulé plus de
              24h à l&apos;avance par le salon.
            </p>
          </section>

          <p className="text-sm">
            Des questions ?{" "}
            <Link href="/contact" className="text-brand-gold hover:underline">Contactez-nous</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
