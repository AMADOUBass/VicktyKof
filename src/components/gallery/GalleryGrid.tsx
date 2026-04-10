"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  altText: string | null;
  tags: string[];
  isFeatured: boolean;
}

interface Props {
  photos: Photo[];
  tags: string[];
}

export function GalleryGrid({ photos, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const filtered = activeTag ? photos.filter((p) => p.tags.includes(activeTag)) : photos;

  return (
    <div>
      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
            !activeTag
              ? "bg-brand-gold border-brand-gold text-brand-black"
              : "border-white/20 text-brand-muted hover:border-brand-gold/40"
          )}
        >
          Tout voir
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize",
              activeTag === tag
                ? "bg-brand-gold border-brand-gold text-brand-black"
                : "border-white/20 text-brand-muted hover:border-brand-gold/40"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {photos.length === 0 ? (
        <div className="text-center py-24 text-brand-muted">
          <p>La galerie sera disponible prochainement.</p>
        </div>
      ) : (
        <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4">
          <AnimatePresence>
            {filtered.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="break-inside-avoid mb-4 cursor-pointer group"
                onClick={() => setLightbox(photo)}
              >
                <div className="relative overflow-hidden rounded-xl border border-white/5">
                  <Image
                    src={photo.url}
                    alt={photo.altText ?? photo.caption ?? "VicktyKof création"}
                    width={400}
                    height={500}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-all duration-300 flex items-end p-3">
                      <p className="text-brand-beige text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-brand-charcoal rounded-full flex items-center justify-center text-brand-beige hover:text-brand-gold"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-h-[90vh] max-w-4xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.url}
                alt={lightbox.altText ?? ""}
                width={1200}
                height={900}
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
              {lightbox.caption && (
                <p className="text-center text-brand-muted text-sm mt-3">{lightbox.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
