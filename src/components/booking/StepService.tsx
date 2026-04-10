"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { BookingState } from "./BookingWizard";

interface Props {
  booking: BookingState;
  updateBooking: (u: Partial<BookingState>) => void;
  onNext: () => void;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  basePrice: string;
  depositPct: number;
  category: string;
}

export function StepService({ booking, updateBooking, onNext }: Props) {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => fetch("/api/services").then((r) => r.json()),
  });

  const select = (service: Service) => {
    updateBooking({
      serviceId: service.id,
      serviceName: service.name,
      serviceDuration: service.durationMins,
      servicePrice: parseFloat(service.basePrice),
      depositPct: service.depositPct,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-brand-beige text-center">
        Choisissez votre service
      </h2>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-brand-charcoal animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {services?.map((service) => (
            <button
              key={service.id}
              onClick={() => select(service)}
              className={cn(
                "card-hover text-left transition-all duration-200 border-2",
                booking.serviceId === service.id
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-transparent"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-brand-beige">{service.name}</h3>
                {booking.serviceId === service.id && (
                  <div className="w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-black text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-brand-muted mb-4 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {service.durationMins >= 60
                    ? `${Math.floor(service.durationMins / 60)}h${service.durationMins % 60 > 0 ? service.durationMins % 60 + "m" : ""}`
                    : `${service.durationMins}m`}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-gold">
                    {formatPrice(parseFloat(service.basePrice))}
                  </p>
                  <p className="text-xs text-brand-muted">
                    Dépôt: {formatPrice(parseFloat(service.basePrice) * service.depositPct / 100)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!booking.serviceId}
          className={cn(
            "btn-primary gap-2",
            !booking.serviceId && "opacity-50 cursor-not-allowed"
          )}
        >
          Continuer <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
