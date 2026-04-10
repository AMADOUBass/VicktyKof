"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { StepService } from "./StepService";
import { StepStylist } from "./StepStylist";
import { StepDateTime } from "./StepDateTime";
import { StepConfirm } from "./StepConfirm";
import { cn } from "@/lib/utils";

export type BookingState = {
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  depositPct: number;
  stylistId: string;
  stylistName: string;
  date: Date | null;
  timeSlot: string;
  notes: string;
};

const INITIAL_STATE: BookingState = {
  serviceId: "",
  serviceName: "",
  serviceDuration: 0,
  servicePrice: 0,
  depositPct: 30,
  stylistId: "",
  stylistName: "",
  date: null,
  timeSlot: "",
  notes: "",
};

const steps = [
  { label: "Service" },
  { label: "Styliste" },
  { label: "Date & Heure" },
  { label: "Confirmation" },
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300",
                  index < currentStep
                    ? "bg-brand-gold border-brand-gold text-brand-black"
                    : index === currentStep
                    ? "border-brand-gold text-brand-gold bg-brand-gold/10"
                    : "border-white/20 text-brand-muted bg-transparent"
                )}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium",
                  index === currentStep ? "text-brand-gold" : "text-brand-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 md:w-24 h-px mx-2 mb-5 transition-all duration-500",
                  index < currentStep ? "bg-brand-gold" : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <StepService booking={booking} updateBooking={updateBooking} onNext={next} />
          )}
          {currentStep === 1 && (
            <StepStylist booking={booking} updateBooking={updateBooking} onNext={next} onBack={prev} />
          )}
          {currentStep === 2 && (
            <StepDateTime booking={booking} updateBooking={updateBooking} onNext={next} onBack={prev} />
          )}
          {currentStep === 3 && (
            <StepConfirm booking={booking} onBack={prev} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
