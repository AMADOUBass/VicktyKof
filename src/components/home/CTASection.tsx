"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-brand-charcoal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-4">Prête ?</p>
          <h2 className="section-title mb-6">
            Réservez votre moment<br />
            <span className="text-brand-gold italic">de beauté</span>
          </h2>
          <p className="text-brand-muted mb-10 max-w-xl mx-auto">
            Offrez-vous l'expertise VicktyKof. Réservez en ligne avec un dépôt sécurisé
            ou appelez-nous directement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-primary w-full sm:w-auto text-base px-8 py-4 gap-2">
              <Calendar className="w-5 h-5" />
              Réserver en ligne
            </Link>
            <a href="tel:+15817457409" className="btn-outline w-full sm:w-auto text-base px-8 py-4 gap-2">
              <Phone className="w-5 h-5" />
              (581) 745-7409
            </a>
          </div>

          <p className="mt-8 text-xs text-brand-muted">
            2177 rue du Carrousel, Québec, G2B 5B5 · victykoff@gmail.com
          </p>
        </motion.div>
      </div>
    </section>
  );
}
