"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Placeholder grid — replace with real DB images
const placeholders = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: ["Starter Locs", "Retwist", "Interlocks", "Updo", "Braids", "Natural Style"][i] ?? "Style",
}));

export function GalleryPreview() {
  return (
    <section className="py-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Galerie</p>
          <h2 className="section-title">Nos créations</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {placeholders.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-xl border border-white/5 group cursor-pointer
                         ${i === 0 ? "md:row-span-2" : ""}`}
            >
              <div
                className={`bg-gradient-to-br from-brand-charcoal to-brand-black flex items-center justify-center
                           ${i === 0 ? "h-full min-h-[300px]" : "aspect-square"}`}
              >
                <span className="font-display text-brand-gold/30 text-lg italic">{item.label}</span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-all duration-300 flex items-end p-4">
                <span className="text-brand-gold font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/gallery" className="btn-outline gap-2 inline-flex">
            Voir toute la galerie <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
