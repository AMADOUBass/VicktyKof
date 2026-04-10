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
            Un dépôt de 30% est requis pour confirmer votre rendez-vous.
            Le solde sera réglé au salon.
          </p>
        </div>

        <BookingWizard />
      </div>
    </div>
  );
}
