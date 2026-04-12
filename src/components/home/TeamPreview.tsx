"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { UserAvatar } from "../ui/UserAvatar";

interface Stylist {
  id: string;
  user: { name: string | null; image: string | null };
  bio: string | null;
  yearsExp: number;
  specialties: string[];
}

export function TeamPreview() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stylists")
      .then((r) => r.json())
      .then((data) => {
        setStylists(data.slice(0, 3)); // Show top 3
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  return (
    <section className="py-24 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">L&apos;Équipe</p>
          <h2 className="section-title">Des expertes à votre service</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse opacity-50" />
            ))
          ) : stylists.length === 0 ? (
            <div className="col-span-full text-center py-12 text-brand-muted">
              Profils à venir prochainement.
            </div>
          ) : (
            stylists.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card-hover text-center group"
              >
                {/* Avatar photo */}
                <div className="flex justify-center mb-5">
                  <UserAvatar 
                    src={member.user.image} 
                    name={member.user.name} 
                    size="2xl" 
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-display text-xl font-semibold text-brand-beige">{member.user.name}</h3>
                <p className="text-sm text-brand-gold mt-1">Expert Styliste</p>
                <p className="text-xs text-brand-muted mt-1">{member.yearsExp} ans d&apos;expérience</p>

                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {member.specialties.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full"
                    >
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
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
