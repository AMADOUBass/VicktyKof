"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";

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
                className="card-hover p-0 overflow-hidden group flex flex-col h-full"
              >
                {/* Portrait photo */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-brand-charcoal flex items-center justify-center">
                  {member.user.image ? (
                    <Image 
                      src={member.user.image} 
                      alt={member.user.name || "Member"} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <User className="w-20 h-20 text-brand-gold/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Years Exp Badge */}
                  <div className="absolute top-4 right-4 bg-brand-black/60 backdrop-blur-md border border-brand-gold/20 px-3 py-1 rounded-full z-10">
                    <p className="text-[10px] text-brand-gold font-medium">{member.yearsExp} ans d&apos;exp.</p>
                  </div>
                </div>

                <div className="p-6 text-center flex-1 flex flex-col">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-brand-beige group-hover:text-brand-gold transition-colors">
                    {member.user.name}
                  </h3>
                  <p className="text-sm text-brand-gold/80 mt-1 uppercase tracking-widest font-medium">Expert Styliste</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-5 mb-2">
                    {member.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-brand-gold/5 border border-brand-gold/20 text-brand-gold px-2.5 py-1 rounded-full"
                      >
                        {s.replace("_", " ")}
                      </span>
                    ))}
                  </div>
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
