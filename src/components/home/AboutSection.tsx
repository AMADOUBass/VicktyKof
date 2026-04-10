"use client";

import { motion } from "framer-motion";
import { Award, Heart, Shield } from "lucide-react";

const values = [
  { icon: Award, title: "Excellence", description: "15+ ans d'expertise en locs et coiffures afro." },
  { icon: Heart, title: "Passion", description: "Chaque cliente reçoit une attention personnalisée." },
  { icon: Shield, title: "Qualité", description: "Produits naturels et techniques douces certifiées." },
];

export function AboutSection() {
  return (
    <section className="py-24 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-brand-gold/20 bg-gradient-to-br from-brand-gold/10 to-brand-black flex items-center justify-center">
            <span className="font-display text-3xl text-brand-gold/30 italic">Vicky</span>
          </div>
          {/* Gold accent border */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-brand-gold/20 rounded-2xl -z-10" />
          {/* Experience badge */}
          <div className="absolute -top-6 -left-6 bg-brand-gold rounded-2xl p-5 shadow-gold-lg">
            <p className="font-display text-3xl font-bold text-brand-black">15+</p>
            <p className="text-xs text-brand-black/70 font-medium mt-0.5">ans d&apos;expérience</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">À propos</p>
          <h2 className="section-title mb-6">
            Rencontrez <span className="text-brand-gold italic">Vicky</span>,<br />
            Maître Loctician
          </h2>
          <div className="divider-gold mx-0 mb-6 w-16" />
          <p className="text-brand-muted leading-relaxed mb-4">
            Passionnée par la beauté naturelle africaine depuis plus de 15 ans, Vicky a fondé VicktyKof
            avec une vision claire : offrir à chaque cliente un espace où son identité et sa beauté sont
            célébrées.
          </p>
          <p className="text-brand-muted leading-relaxed mb-8">
            Spécialisée dans les locs, interlocks et coiffures afro, elle forme également une équipe
            d&apos;expertes partageant sa passion pour l&apos;excellence et le soin capillaire naturel.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="text-center p-4 bg-brand-black/40 rounded-xl border border-white/5">
                  <Icon className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                  <p className="text-sm font-semibold text-brand-beige">{v.title}</p>
                  <p className="text-xs text-brand-muted mt-1">{v.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
