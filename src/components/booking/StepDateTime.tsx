"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfDay, isBefore, isToday, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingState } from "./BookingWizard";

interface Props {
  booking: BookingState;
  updateBooking: (u: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDateTime({ booking, updateBooking, onNext, onBack }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = startOfDay(new Date());

  // Generate 7-day window
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i + weekOffset * 7));

  const selectedDate = booking.date ?? null;

  // Fetch available slots for selected date + stylist
  const { data: slots = [], isLoading: loadingSlots } = useQuery<string[]>({
    queryKey: ["slots", booking.stylistId, selectedDate?.toISOString()],
    queryFn: () =>
      fetch(
        `/api/availability?stylistId=${booking.stylistId}&date=${format(selectedDate!, "yyyy-MM-dd")}&duration=${booking.serviceDuration}`
      ).then((r) => r.json()),
    enabled: !!selectedDate && !!booking.stylistId,
  });

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-semibold text-brand-beige text-center">
        Choisissez une date
      </h2>

      {/* Calendar week navigator */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
            disabled={weekOffset === 0}
            className="btn-ghost p-2 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-brand-beige capitalize">
            {format(days[0]!, "MMMM yyyy", { locale: fr })}
          </span>
          <button onClick={() => setWeekOffset((o) => o + 1)} className="btn-ghost p-2">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const past = isBefore(day, today) && !isToday(day);
            const selected = selectedDate ? isSameDay(day, selectedDate) : false;
            return (
              <button
                key={day.toISOString()}
                disabled={past}
                onClick={() => updateBooking({ date: day, timeSlot: "" })}
                className={cn(
                  "flex flex-col items-center py-3 px-1 rounded-xl text-xs transition-all duration-200 border",
                  past
                    ? "opacity-30 cursor-not-allowed border-transparent"
                    : selected
                    ? "bg-brand-gold border-brand-gold text-brand-black font-semibold"
                    : "border-white/5 text-brand-muted hover:border-brand-gold/30 hover:text-brand-gold"
                )}
              >
                <span className="text-[10px] uppercase mb-1 opacity-70">
                  {format(day, "EEE", { locale: fr })}
                </span>
                <span className="text-base font-semibold">{format(day, "d")}</span>
                {isToday(day) && (
                  <span className={cn("text-[9px] mt-0.5", selected ? "text-brand-black/70" : "text-brand-gold")}>
                    Auj.
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h3 className="text-sm font-medium text-brand-muted mb-4">
            Créneaux disponibles — {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </h3>
          {loadingSlots ? (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-brand-charcoal animate-pulse" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">
              Aucun créneau disponible ce jour. Veuillez choisir une autre date.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => updateBooking({ timeSlot: slot })}
                  className={cn(
                    "py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-200",
                    booking.timeSlot === slot
                      ? "bg-brand-gold border-brand-gold text-brand-black"
                      : "border-white/10 text-brand-muted hover:border-brand-gold/30 hover:text-brand-gold"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {booking.timeSlot && (
        <div>
          <label className="label">Notes (optionnel)</label>
          <textarea
            className="input min-h-24 resize-none"
            placeholder="Informations supplémentaires, allergies, préférences..."
            value={booking.notes}
            onChange={(e) => updateBooking({ notes: e.target.value })}
          />
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn-ghost gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <button
          onClick={onNext}
          disabled={!booking.date || !booking.timeSlot}
          className={cn(
            "btn-primary gap-2",
            (!booking.date || !booking.timeSlot) && "opacity-50 cursor-not-allowed"
          )}
        >
          Continuer <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
