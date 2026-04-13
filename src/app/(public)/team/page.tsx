import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";

export const metadata: Metadata = {
  title: "L'Équipe | VicktyKof",
  description: "Rencontrez les stylistes expertes de VicktyKof. Spécialistes en locs, interlocks et coiffures afro à Québec.",
};

const SPECIALTY_LABELS: Record<string, string> = {
  RETWIST: "Retwist",
  INTERLOCKS: "Interlocks",
  WOMENS_STYLING: "Styles femmes",
  STARTER_LOCS: "Starter Locs",
  LOC_MAINTENANCE: "Entretien Locs",
  BRAIDING: "Tresses",
  NATURAL_STYLES: "Styles naturels",
};

export default async function TeamPage() {
  const stylists = await prisma.stylist.findMany({
    where: { isActive: true },
    include: {
      user: { select: { name: true, image: true } },
      portfolio: { take: 3, orderBy: { createdAt: "desc" } },
    },
    orderBy: { yearsExp: "desc" },
  });

  return (
    <div className="min-h-screen pt-24 pb-16 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-3">Notre Équipe</p>
          <h1 className="section-title">Des expertes passionnées</h1>
          <div className="divider-gold" />
          <p className="mt-4 text-brand-muted max-w-xl mx-auto">
            Chaque styliste est spécialisée et certifiée dans son domaine.
            Choisissez la professionnelle qui correspond à vos besoins.
          </p>
        </div>

        {stylists.length === 0 ? (
          <p className="text-center text-brand-muted py-12">Profils à venir.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stylists.map((stylist) => (
              <div key={stylist.id} className="card-hover">
                {/* Avatar */}
                <div className="flex justify-center -mt-12 mb-6">
                  <UserAvatar 
                    src={stylist.user.image ?? stylist.avatarUrl} 
                    name={stylist.user.name} 
                    size="2xl" 
                    className="w-32 h-32 border-4 border-brand-black shadow-2xl"
                  />
                </div>

                <h2 className="font-display text-2xl font-semibold text-brand-beige">{stylist.user.name}</h2>
                <p className="text-brand-gold text-sm mt-1">{stylist.yearsExp} ans d&apos;expérience</p>

                {stylist.bio && (
                  <p className="text-brand-muted text-sm mt-3 leading-relaxed line-clamp-3">{stylist.bio}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {stylist.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-3 py-1 rounded-full"
                    >
                      {SPECIALTY_LABELS[s] ?? s}
                    </span>
                  ))}
                </div>

                {/* Portfolio preview */}
                {stylist.portfolio.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {stylist.portfolio.map((photo) => (
                      <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-brand-charcoal">
                        <Image src={photo.url} alt={photo.caption ?? ""} width={100} height={100}
                          className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/booking?stylistId=${stylist.id}`}
                  className="btn-outline w-full text-center mt-5 gap-2 inline-flex justify-center"
                >
                  <Calendar className="w-4 h-4" /> Réserver avec {stylist.user.name?.split(" ")[0]}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
