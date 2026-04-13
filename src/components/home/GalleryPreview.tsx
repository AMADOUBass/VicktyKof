"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GalleryPhoto {
  id: string;
  url: string;
  caption: string | null;
  isFeatured: boolean;
}

export function GalleryPreview() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos.slice(0, 5)); // Keep the 5-grid layout
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          {loading ? (
             [...Array(5)].map((_, i) => (
               <div key={i} className={`bg-brand-charcoal animate-pulse rounded-xl ${i === 0 ? "col-span-2 md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-[520px]" : "aspect-square"}`} />
             ))
          ) : photos.length === 0 ? (
            <p className="col-span-full text-center text-brand-muted py-12">Aucune création à afficher pour le moment.</p>
          ) : (
            photos.map((photo, i) => {
              const isFirst = i === 0;
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className={`relative overflow-hidden rounded-xl border border-white/5 group cursor-pointer
                             ${isFirst ? "col-span-2 md:col-span-1 md:row-span-2" : ""}`}>
                  <div
                    className={
                      isFirst
                        ? "relative h-full min-h-[300px] md:min-h-[520px]"
                        : "relative aspect-square"
                    }>
                    <Image
                      src={photo.url}
                      alt={photo.caption || "Création VicktyKof"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/30 transition-all duration-300 flex items-end p-4">
                    <span className="text-brand-beige font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-gold/80 px-3 py-1 rounded-full">
                      {photo.caption || "Voir détails"}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
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
