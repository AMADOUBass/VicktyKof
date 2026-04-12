"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingState } from "./BookingWizard";

import { UserAvatar } from "../ui/UserAvatar";

interface Props {
  booking: BookingState;
  updateBooking: (u: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Stylist {
  id: string;
  user: { name: string | null; image: string | null };
  bio: string | null;
  yearsExp: number;
  specialties: string[];
  avatarUrl: string | null;
}

const SPECIALTY_LABELS: Record<string, string> = {
  RETWIST: "Retwist",
  INTERLOCKS: "Interlocks",
  WOMENS_STYLING: "Styles femmes",
  STARTER_LOCS: "Starter Locs",
  LOC_MAINTENANCE: "Entretien Locs",
  BRAIDING: "Tresses",
  NATURAL_STYLES: "Styles naturels",
};

export function StepStylist({ booking, updateBooking, onNext, onBack }: Props) {
  const { data: stylists, isLoading } = useQuery<Stylist[]>({
    queryKey: ["stylists", booking.serviceId],
    queryFn: () => fetch(`/api/stylists?serviceId=${booking.serviceId}`).then((r) => r.json()),
    enabled: !!booking.serviceId,
  });

  const select = (stylist: Stylist) => {
    updateBooking({
      stylistId: stylist.id,
      stylistName: stylist.user.name ?? "Styliste",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-brand-beige text-center">
        Choisissez votre styliste
      </h2>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-brand-charcoal animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {stylists?.map((stylist) => (
            <button
              key={stylist.id}
              onClick={() => select(stylist)}
              className={cn(
                "card-hover text-left border-2 transition-all duration-200",
                booking.stylistId === stylist.id
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-transparent"
              )}
            >
              <div className="flex items-center gap-4 mb-3">
                <UserAvatar 
                  src={stylist.user.image ?? stylist.avatarUrl} 
                  name={stylist.user.name} 
                  size="lg" 
                />
                <div>
                  <p className="font-semibold text-brand-beige">{stylist.user.name}</p>
                  <p className="text-xs text-brand-muted">{stylist.yearsExp} ans d&apos;expérience</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                </div>
              </div>
              {stylist.bio && (
                <p className="text-sm text-brand-muted mb-3 line-clamp-2">{stylist.bio}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {stylist.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full"
                  >
                    {SPECIALTY_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No preference option */}
      <button
        onClick={() => updateBooking({ stylistId: "any", stylistName: "Disponible" })}
        className={cn(
          "w-full card border-2 text-left transition-all duration-200",
          booking.stylistId === "any" ? "border-brand-gold bg-brand-gold/5" : "border-transparent"
        )}
      >
        <p className="font-semibold text-brand-beige">Pas de préférence</p>
        <p className="text-sm text-brand-muted mt-1">La première styliste disponible sera assignée</p>
      </button>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-ghost gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <button
          onClick={onNext}
          disabled={!booking.stylistId}
          className={cn("btn-primary gap-2", !booking.stylistId && "opacity-50 cursor-not-allowed")}
        >
          Continuer <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
