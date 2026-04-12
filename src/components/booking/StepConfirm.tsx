"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, CreditCard, Calendar, User, Scissors, Clock, AlertCircle } from "lucide-react";
import { formatPrice, calculateDeposit } from "@/lib/utils";
import type { BookingState } from "./BookingWizard";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Props {
  booking: BookingState;
  onBack: () => void;
}

export function StepConfirm({ booking, onBack }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "INTERAC">("CARD");

  const totalCents = Math.round(booking.servicePrice * 100);
  const depositCents = calculateDeposit(totalCents, booking.depositPct);
  const remainingCents = totalCents - depositCents;

  const handleCheckout = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/booking`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: booking.serviceId,
          stylistId: booking.stylistId === "any" ? null : booking.stylistId,
          scheduledAt: new Date(
            `${format(booking.date!, "yyyy-MM-dd")}T${booking.timeSlot}:00`
          ).toISOString(),
          notes: booking.notes,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Erreur lors de la création du rendez-vous");
      }

      const data = await res.json() as { checkoutUrl?: string; success?: boolean; appointmentId: string };
      if (data.success || !data.checkoutUrl) {
        router.push(`/booking/success?appointmentId=${data.appointmentId}`);
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-brand-beige text-center">
        Confirmer votre rendez-vous
      </h2>

      {/* Summary card */}
      <div className="card border-brand-gold/20">
        <h3 className="font-semibold text-brand-gold mb-4">Récapitulatif</h3>
        <dl className="space-y-3">
          <div className="flex items-center gap-3">
            <Scissors className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <dt className="text-sm text-brand-muted w-28">Service</dt>
            <dd className="text-sm text-brand-beige font-medium">{booking.serviceName}</dd>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <dt className="text-sm text-brand-muted w-28">Styliste</dt>
            <dd className="text-sm text-brand-beige font-medium">{booking.stylistName}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <dt className="text-sm text-brand-muted w-28">Date</dt>
            <dd className="text-sm text-brand-beige font-medium">
              {booking.date
                ? format(booking.date, "EEEE d MMMM yyyy", { locale: fr })
                : ""}
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-brand-gold flex-shrink-0" />
            <dt className="text-sm text-brand-muted w-28">Heure</dt>
            <dd className="text-sm text-brand-beige font-medium">{booking.timeSlot}</dd>
          </div>
        </dl>

        <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Prix total du service</span>
            <span className="text-brand-beige">{formatPrice(booking.servicePrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Dépôt requis ({booking.depositPct}%)</span>
            <span className="text-brand-gold font-semibold">{formatPrice(depositCents / 100)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Solde au salon</span>
            <span className="text-brand-beige">{formatPrice(remainingCents / 100)}</span>
          </div>
        </div>
      </div>

      {/* Deposit notice */}
      <div className="flex gap-3 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
        <AlertCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
        <div className="text-sm text-brand-muted">
          <p className="text-brand-beige font-medium mb-1">Dépôt de réservation</p>
          <p>
            Un dépôt de <strong className="text-brand-gold">{formatPrice(depositCents / 100)}</strong> est
            requis pour confirmer votre rendez-vous. Ce montant sera déduit de votre facture finale.
            En cas d&apos;annulation moins de 24h avant le rendez-vous, le dépôt ne sera pas remboursé.
          </p>
        </div>
      </div>

      {/* Auth notice */}
      {status === "unauthenticated" && (
        <div className="flex gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <p className="text-sm text-brand-muted">
            Vous devez être{" "}
            <button
              onClick={() => router.push("/login?callbackUrl=/booking")}
              className="text-brand-gold underline"
            >
              connecté(e)
            </button>{" "}
            pour finaliser votre réservation.
          </p>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">
          Mode de paiement du dépôt
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod("CARD")}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
              paymentMethod === "CARD"
                ? "border-brand-gold bg-brand-gold/10"
                : "border-white/5 bg-brand-black/40 hover:border-brand-gold/20"
            }`}
          >
            <CreditCard className={`w-8 h-8 ${paymentMethod === "CARD" ? "text-brand-gold" : "text-brand-muted"}`} />
            <div className="text-center">
              <p className="font-semibold text-brand-beige">Carte de crédit</p>
              <p className="text-[10px] text-brand-muted mt-1 uppercase">Stripe sécurisé</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod("INTERAC")}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
              paymentMethod === "INTERAC"
                ? "border-brand-gold bg-brand-gold/10"
                : "border-white/5 bg-brand-black/40 hover:border-brand-gold/20"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold font-bold text-xs">
              $
            </div>
            <div className="text-center">
              <p className="font-semibold text-brand-beige">Virement Interac</p>
              <p className="text-[10px] text-brand-muted mt-1 uppercase">VictyKof@yahoo.fr</p>
            </div>
          </button>
        </div>

        {paymentMethod === "INTERAC" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl"
          >
            <p className="text-xs text-brand-muted leading-relaxed">
              <strong className="text-brand-gold">Instructions :</strong> Veuillez envoyer votre dépôt de <strong className="text-brand-beige">{formatPrice(depositCents / 100)}</strong> à l&apos;adresse <strong className="text-brand-beige">VictyKof@yahoo.fr</strong> après avoir confirmé. Votre rendez-vous sera validé manuellement dès réception.
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="btn-ghost gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn-primary gap-2 px-8"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
              Chargement...
            </span>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Payer le dépôt — {formatPrice(depositCents / 100)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
