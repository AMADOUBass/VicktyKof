import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Calendar, Home } from "lucide-react";

export const metadata: Metadata = { title: "Réservation confirmée" };

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="font-display text-3xl font-bold text-brand-beige mb-3">
          Dépôt reçu !
        </h1>
        <p className="text-brand-muted mb-8">
          Votre dépôt a été encaissé avec succès. Notre équipe va confirmer votre
          rendez-vous et vous enverrez un email de confirmation sous peu.
        </p>

        <div className="card border-brand-gold/20 mb-8">
          <p className="text-sm text-brand-muted">
            Vous recevrez un email de confirmation à l&apos;adresse associée à votre compte.
            En cas de question, contactez-nous au{" "}
            <a href="tel:+15817457409" className="text-brand-gold">(581) 745-7409</a>.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-ghost gap-2">
            <Home className="w-4 h-4" /> Accueil
          </Link>
          <Link href="/booking" className="btn-primary gap-2">
            <Calendar className="w-4 h-4" /> Nouveau rendez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
