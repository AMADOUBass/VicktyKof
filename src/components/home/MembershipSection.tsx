"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";

const memberBenefits = [
  "10% de réduction sur tous les services",
  "15% de réduction sur les produits boutique",
  "Accès prioritaire aux nouveaux créneaux",
  "Produits exclusifs membres",
  "Offres anniversaire personnalisées",
  "Rappels automatiques d'entretien",
];

export function MembershipSection() {
  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gold-gradient opacity-5" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="card border-brand-gold/30"
        >
          <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-brand-gold" />
          </div>

          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Adhésion Premium</p>
          <h2 className="section-title mb-2">Rejoignez le Club VicktyKof</h2>
          <div className="divider-gold" />
          <p className="text-brand-muted mt-4 mb-8 max-w-xl mx-auto">
            Accédez à des avantages exclusifs, des tarifs préférentiels et une expérience salon
            premium réservée à nos membres.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-10 text-left max-w-lg mx-auto">
            {memberBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-brand-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-gold" />
                </div>
                <span className="text-sm text-brand-beige/80">{benefit}</span>
              </div>
            ))}
          </div>

          <Link href="/signup" className="btn-primary text-base px-10 py-4 inline-flex">
            Devenir membre — Gratuit
          </Link>
          <p className="text-xs text-brand-muted mt-4">
            Inscription gratuite. Avantages activés après votre premier rendez-vous.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
