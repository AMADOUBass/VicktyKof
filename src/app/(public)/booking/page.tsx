import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Réserver un rendez-vous",
  description: "Réservez votre rendez-vous chez VicktyKof. Choisissez votre service, votre styliste et payez votre dépôt en ligne.",
};

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Réservation</p>
          <h1 className="section-title">Prenez rendez-vous</h1>
          <div className="divider-gold" />
          <p className="mt-4 text-brand-muted max-w-xl mx-auto">
            Un dépôt est requis pour confirmer votre rendez-vous.
            Le solde sera réglé au salon.
          </p>
        </div>

        <BookingWizard />

        {/* Preparation Guide */}
        <div className="mt-16 card bg-brand-gold/5 border-brand-gold/20 p-6 max-w-2xl mx-auto">
          <h2 className="font-display text-lg font-bold text-brand-beige mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold text-xs">!</span>
            Guide de préparation
          </h2>
          <ul className="text-sm text-brand-muted space-y-3">
            <li className="flex gap-2">
              <span className="text-brand-gold">•</span>
              <span><strong>Arrivée :</strong> Merci de vous présenter avec les cheveux démêlés pour faciliter le début du service.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">•</span>
              <span><strong>Services longs :</strong> Pour les prestations de plus de 3h (Starter Locs, Tresses), nous vous conseillons de prévoir un encas ou de la lecture.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-gold">•</span>
              <span><strong>Politique :</strong> Le dépôt garantit votre créneau. En cas d'annulation moins de 24h avant, le dépôt est conservé à titre de dédommagement.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
