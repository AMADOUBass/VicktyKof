"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const team = [
  {
    name: "Vicky",
    title: "Fondatrice & Maître Loctician",
    specialties: ["Starter Locs", "Interlocks", "Retwist"],
    yearsExp: 15,
  },
  {
    name: "Styliste 2",
    title: "Spécialiste Retwist & Styles Femmes",
    specialties: ["Retwist", "Tresses", "Updo"],
    yearsExp: 8,
  },
  {
    name: "Styliste 3",
    title: "Experte Interlocks",
    specialties: ["Interlocks", "Loc Maintenance"],
    yearsExp: 6,
  },
];

export function TeamPreview() {
  return (
    <section className="py-24 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">L&apos;Équipe</p>
          <h2 className="section-title">Des expertes à votre service</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card-hover text-center"
            >
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-charcoal border-2 border-brand-gold/30 flex items-center justify-center">
                <span className="font-display text-2xl text-brand-gold font-bold">
                  {member.name[0]}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold text-brand-beige">{member.name}</h3>
              <p className="text-sm text-brand-gold mt-1">{member.title}</p>
              <p className="text-xs text-brand-muted mt-1">{member.yearsExp} ans d&apos;expérience</p>

              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {member.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/team" className="btn-outline gap-2 inline-flex">
            Rencontrer l&apos;équipe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
