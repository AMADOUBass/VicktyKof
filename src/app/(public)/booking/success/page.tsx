import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Calendar, Home, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Réservation confirmée" };

export default async function BookingSuccessPage(props: { searchParams: Promise<{ appointmentId?: string }> }) {
  const searchParams = await props.searchParams;
  const appointmentId = searchParams.appointmentId;

  const appointment = appointmentId
    ? await prisma.appointment.findUnique({
        where: { id: appointmentId },
      })
    : null;

  const isInterac = appointment?.paymentMethod === "INTERAC";
  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="font-display text-3xl font-bold text-brand-beige mb-3">
          {isInterac ? "Réservation demandée !" : "Dépôt reçu !"}
        </h1>
        <p className="text-brand-muted mb-8">
          {isInterac ? (
            <>
              Votre rendez-vous a été pré-réservé. Veuillez envoyer votre dépôt par{" "}
              <span className="text-brand-gold font-semibold">Virement Interac</span> pour confirmer
              votre place.
            </>
          ) : (
            "Votre dépôt a été encaissé avec succès. Notre équipe va confirmer votre rendez-vous et vous enverrez un email de confirmation sous peu."
          )}
        </p>

        {isInterac && appointment && (
          <div className="card bg-brand-gold/5 border-brand-gold/30 mb-8 text-left">
            <h3 className="flex items-center gap-2 text-brand-gold font-bold mb-4 uppercase tracking-widest text-xs">
              <Mail className="w-4 h-4" /> Instructions Interac
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-brand-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-brand-muted uppercase">Montant du dépôt</span>
                <span className="text-brand-gold font-bold">{formatPrice(Number(appointment.depositAmount))}</span>
              </div>
              <div className="flex justify-between items-center bg-brand-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-brand-muted uppercase">Virement par SMS</span>
                <span className="text-brand-gold font-bold">(581) 745-7409</span>
              </div>
              <div className="flex justify-between items-center bg-brand-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-brand-muted uppercase">Virement par Courriel</span>
                <span className="text-brand-gold font-bold">vicktykoff@gmail.com</span>
              </div>
              <div className="p-3 bg-brand-gold/5 border border-brand-gold/10 rounded-lg text-xs text-brand-muted leading-relaxed">
                Le dépôt automatique est activé sur les deux options. Votre rendez-vous sera validé dès réception du virement.
              </div>
            </div>
          </div>
        )}

        <div className="card border-brand-gold/20 mb-8">
          <p className="text-sm text-brand-muted">
            {isInterac
              ? "Une fois le virement reçu, vous recevrez un email de confirmation."
              : "Vous recevrez un email de confirmation à l'adresse associée à votre compte."}
            {" "}En cas de question, contactez-nous au{" "}
            <a href="tel:+15817457409" className="text-brand-gold">
              (581) 745-7409
            </a>
            .
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
