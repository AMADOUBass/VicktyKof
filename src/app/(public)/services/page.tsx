import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, DollarSign, ChevronRight, Scissors, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Nos Services | VicktyKof",
  description: "Découvrez tous nos services de coiffure afro à Québec — retwist, tresses, loc maintenance et plus encore.",
};

const CATEGORY_LABELS: Record<string, string> = {
  locks: "Locs & Retwist",
  braids: "Tresses",
  natural: "Styles naturels",
  treatment: "Soins capillaires",
  other: "Autres services",
};

const CATEGORY_ORDER = ["locks", "braids", "natural", "treatment", "other"];

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { basePrice: "asc" }],
    include: {
      stylistServices: {
        include: { stylist: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  // Group by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof services>>(
    (acc, cat) => {
      const items = services.filter((s) => s.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {}
  );

  // Add any uncategorized
  const known = new Set(CATEGORY_ORDER);
  services.forEach((s) => {
    if (!known.has(s.category)) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category]!.push(s);
    }
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-brand-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">
              Expertise capillaire
            </p>
            <h1 className="section-title">Nos Services</h1>
            <div className="divider-gold" />
            <p className="text-brand-muted max-w-xl mx-auto mt-4 text-sm leading-relaxed">
              Des soins capillaires soigneusement élaborés pour sublimer votre
              beauté naturelle. Chaque service est réalisé avec passion et
              expertise.
            </p>
          </div>
        </ScrollReveal>

        {/* Category groups */}
        <div className="space-y-16">
          {Object.entries(grouped).map(([cat, items]) => (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-gold/10 border border-brand-gold/20 rounded-lg flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-brand-gold" />
                </div>
                <h2 className="font-display text-2xl font-bold text-brand-beige">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <div className="flex-1 h-px bg-brand-gold/20 ml-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((service) => {
                  const priceNum = parseFloat(service.basePrice.toString());
                  const depositAmt = (priceNum * service.depositPct) / 100;
                  return (
                    <article
                      key={service.id}
                      className="card card-hover group flex flex-col"
                    >
                      {/* Image or placeholder */}
                      {service.imageUrl ? (
                        <div className="relative h-44 -mx-5 -mt-5 mb-5 overflow-hidden rounded-t-2xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-24 bg-brand-gold/5 rounded-xl mb-4 border border-brand-gold/10">
                          <Sparkles className="w-8 h-8 text-brand-gold/40" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold text-brand-beige group-hover:text-brand-gold transition-colors">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-sm text-brand-muted mt-2 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-brand-charcoal flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-brand-gold font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {formatPrice(priceNum)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                            <Clock className="w-3.5 h-3.5" />
                            {service.durationMins} min · Dépôt{" "}
                            {formatPrice(depositAmt)}
                          </div>
                        </div>
                        <Link
                          href={`/booking?serviceId=${service.id}`}
                          className="btn-primary text-xs px-4 py-2 flex items-center gap-1"
                        >
                          Réserver <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center card max-w-2xl mx-auto">
          <Sparkles className="w-10 h-10 text-brand-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-brand-beige mb-2">
            Besoin d&apos;un conseil ?
          </h2>
          <p className="text-brand-muted text-sm mb-6">
            Notre équipe est disponible pour vous guider vers le service le
            mieux adapté à vos cheveux.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-outline">
              Nous contacter
            </Link>
            <Link href="/booking" className="btn-primary">
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
