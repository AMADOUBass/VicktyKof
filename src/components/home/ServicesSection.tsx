"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, RefreshCw, Crown, Sparkles, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Crown,
    title: "Starter Locs",
    description: "Création de locs depuis zéro avec différentes techniques adaptées à votre texture de cheveux.",
    duration: "3–5 h",
    price: "À partir de 150 CAD",
  },
  {
    icon: RefreshCw,
    title: "Retwist",
    description: "Entretien de vos locs pour un look soigné et une croissance saine. Recommandé toutes les 4–6 semaines.",
    duration: "1,5–3 h",
    price: "À partir de 80 CAD",
  },
  {
    icon: Scissors,
    title: "Interlocks",
    description: "Technique de verrouillage des racines pour une tenue longue durée, idéale pour les cheveux fins.",
    duration: "2–4 h",
    price: "À partir de 100 CAD",
  },
  {
    icon: Sparkles,
    title: "Coiffures Femmes",
    description: "Tresses, updo's, styles protecteurs et coiffures afro naturelles pour toutes occasions.",
    duration: "1–4 h",
    price: "À partir de 60 CAD",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Nos Services</p>
          <h2 className="section-title">L&apos;expertise au service<br />de votre beauté</h2>
          <div className="divider-gold" />
          <p className="mt-4 text-brand-muted max-w-2xl mx-auto">
            Chaque service est réalisé avec soin par nos stylistes certifiées, spécialisées dans les
            techniques afro et la santé capillaire.
          </p>
        </div>

        {/* Service cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={cardVariants} className="card-hover group">
                <div className="w-12 h-12 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-gold/20 transition-colors">
                  <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-brand-beige mb-2">{service.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed mb-4">{service.description}</p>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-brand-muted">Durée : {service.duration}</p>
                  <p className="text-sm font-semibold text-brand-gold mt-1">{service.price}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/booking" className="btn-primary gap-2 inline-flex">
            Réserver un service <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
