import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Achetez nos produits capillaires premium pour locs et cheveux afro. Kits, huiles, accessoires.",
};

export default async function ShopPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Boutique</p>
            <h1 className="section-title">Produits capillaires</h1>
            <div className="divider-gold" />
            <p className="mt-4 text-brand-muted max-w-xl mx-auto">
              Produits soigneusement sélectionnés pour l&apos;entretien de vos locs et cheveux naturels.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile & tablet: filters above grid. Desktop: sidebar + grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          <Suspense fallback={<div className="w-48 h-10 rounded-xl bg-brand-charcoal animate-pulse" />}>
            <ShopFilters categories={categories} />
          </Suspense>
          <div className="flex-1 min-w-0">
            <Suspense fallback={
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-xl bg-brand-charcoal animate-pulse" />)}
              </div>
            }>
              <ShopGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
