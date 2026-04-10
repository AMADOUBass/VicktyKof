"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aïsha M.",
    text: "Vicky est une vraie artiste ! Mes locs n'ont jamais été aussi belles. Le salon est magnifique et l'accueil est chaleureux.",
    rating: 5,
    service: "Starter Locs",
  },
  {
    name: "Claudette R.",
    text: "Je fais mes retwist chez VicktyKof depuis 3 ans. La qualité est toujours au rendez-vous. Je ne changerais pour rien au monde !",
    rating: 5,
    service: "Retwist",
  },
  {
    name: "Fatima D.",
    text: "Service impeccable, ambiance luxueuse et résultat parfait. L'équipe est professionnelle et à l'écoute. Je recommande fortement.",
    rating: 5,
    service: "Interlocks",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Témoignages</p>
          <h2 className="section-title">Ce que disent nos clientes</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="card relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-gold/10" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <p className="text-brand-muted text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-beige text-sm">{t.name}</p>
                  <p className="text-xs text-brand-gold">{t.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
