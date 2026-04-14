"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import { X, ShieldCheck, Cookie } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("vicktykof_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vicktykof_cookie_consent", "accepted");
    posthog.opt_in_capturing();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("vicktykof_cookie_consent", "declined");
    posthog.opt_out_capturing();
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto glass border border-brand-gold/20 shadow-gold-lg rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-brand-gold" />
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-brand-beige font-display text-xl font-bold mb-2">
                  Respect de votre vie privée
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et assurer la sécurité de vos transactions. En cliquant sur &quot;Accepter&quot;, vous nous aidez à améliorer VicktyKof. Vous pouvez consulter notre <Link href="/privacy" className="text-brand-gold underline hover:no-underline">Politique de confidentialité</Link> pour plus de détails.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={handleDecline}
                  className="btn-outline px-6 py-2.5 text-sm whitespace-nowrap order-2 sm:order-1"
                >
                  Continuer sans accepter
                </button>
                <button
                  onClick={handleAccept}
                  className="btn-primary px-8 py-2.5 text-sm whitespace-nowrap order-1 sm:order-2"
                >
                  Tout accepter
                </button>
              </div>

              <button 
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 text-brand-muted hover:text-brand-gold transition-colors p-1"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
