"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@prisma/client";

interface Props {
  categories: ProductCategory[];
}

export function ShopFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set("category", slug);
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
    setMobileOpen(false);
  };

  const activeLabel = categories.find((c) => c.slug === activeCategory)?.name ?? "Tous les produits";

  const filterList = (
    <nav className="space-y-1">
      <button
        onClick={() => setCategory("")}
        className={cn(
          "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
          !activeCategory
            ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
            : "text-brand-muted hover:text-brand-beige hover:bg-white/5"
        )}
      >
        Tous les produits
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.slug)}
          className={cn(
            "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
            activeCategory === cat.slug
              ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
              : "text-brand-muted hover:text-brand-beige hover:bg-white/5"
          )}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* ── Mobile: dropdown pill ──────────────────────────────────────── */}
      <div className="sm:hidden w-full mb-4">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-charcoal border border-brand-charcoal rounded-xl text-sm text-brand-beige"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
            {activeLabel}
          </span>
          <ChevronDown className={cn("w-4 h-4 text-brand-muted transition-transform", mobileOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 bg-brand-charcoal rounded-xl border border-white/5">
                {filterList}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tablet (sm–lg): horizontal pill row ───────────────────────── */}
      <div className="hidden sm:flex lg:hidden flex-wrap gap-2 mb-6 w-full">
        <button
          onClick={() => setCategory("")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
            !activeCategory
              ? "bg-brand-gold text-brand-black border-brand-gold"
              : "border-brand-charcoal text-brand-muted hover:border-brand-gold/50 hover:text-brand-beige"
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              activeCategory === cat.slug
                ? "bg-brand-gold text-brand-black border-brand-gold"
                : "border-brand-charcoal text-brand-muted hover:border-brand-gold/50 hover:text-brand-beige"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Desktop: vertical sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:block w-48 flex-shrink-0">
        <h3 className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-4">Catégories</h3>
        {filterList}
      </aside>
    </>
  );
}
