import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de remboursement" };

export default function RefundsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-brand-beige mb-2">Politique de remboursement</h1>
        <p className="text-brand-muted mb-8">En vigueur depuis janvier 2025</p>

        <div className="space-y-6 text-brand-muted leading-relaxed">
          <section className="card border-brand-gold/10">
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">Dépôts de réservation</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-2 text-brand-beige font-medium">Situation</th>
                  <th className="pb-2 text-brand-beige font-medium">Remboursement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Annulation par le salon", "100% sous 5 jours ouvrables"],
                  ["Annulation client (+48h avant)", "100% sous 5 jours ouvrables"],
                  ["Annulation client (24-48h avant)", "50% sous 5 jours ouvrables"],
                  ["Annulation client (-24h avant)", "Non remboursable"],
                  ["No-show (absence sans prévenir)", "Non remboursable"],
                ].map(([situation, remb]) => (
                  <tr key={situation}>
                    <td className="py-3 pr-4">{situation}</td>
                    <td className={`py-3 font-medium ${remb!.includes("Non") ? "text-red-400" : "text-green-400"}`}>
                      {remb}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">Produits</h2>
            <p>
              Les produits retournés conformément à notre politique de retour sont remboursés intégralement
              (hors frais de livraison) sous 5-10 jours ouvrables par le même moyen de paiement.
            </p>
          </section>

          <section className="card">
            <h2 className="font-display text-xl font-semibold text-brand-gold mb-3">Comment demander un remboursement</h2>
            <p>Contactez-nous par email à{" "}
              <a href="mailto:vicktykoff@gmail.com" className="text-brand-gold hover:underline">vicktykoff@gmail.com</a>
              {" "}avec votre numéro de réservation ou de commande. Nous traitons toutes les demandes sous 48h.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
