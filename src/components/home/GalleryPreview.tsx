"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const photos = [
  {
    src: "/images/gallery/starter-locs.png",
    label: "Starter Locs",
    span: true,
  },
  { src: "/images/gallery/braids.png", label: "Box Braids", span: false },
  { src: "/images/salon-interior.png", label: "Notre Salon", span: false },
  { src: "/images/gallery/interlocks.png", label: "Interlocks", span: false },
  { src: "/images/gallery/updo.png", label: "Up-do", span: false },
];

export function GalleryPreview() {
  return (
    <section className="py-24 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">
            Galerie
          </p>
          <h2 className="section-title">Nos créations</h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-xl border border-white/5 group cursor-pointer
                         ${photo.span ? "md:row-span-2" : ""}`}>
              <div
                className={
                  photo.span
                    ? "relative h-full min-h-[300px] md:min-h-[520px]"
                    : "relative aspect-square"
                }>
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/30 transition-all duration-300 flex items-end p-4">
                <span className="text-brand-beige font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-gold/80 px-3 py-1 rounded-full">
                  {photo.label}
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
