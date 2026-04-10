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

interface Props {
  booking: BookingState;
  onBack: () => void;
}

export function StepConfirm({ booking, onBack }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Erreur lors de la création du rendez-vous");
      }

      const { checkoutUrl } = await res.json() as { checkoutUrl: string };
      window.location.href = checkoutUrl;
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
