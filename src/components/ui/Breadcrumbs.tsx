"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  booking: "Réserver",
  shop: "Boutique",
  gallery: "Galerie",
  team: "L'équipe",
  contact: "Contact",
  services: "Services",
  faq: "FAQ",
  account: "Mon Compte",
  privacy: "Confidentialité",
  terms: "Conditions",
  returns: "Retours",
  refunds: "Remboursements",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/post-login") return null;

  const paths = pathname.split("/").filter((p) => p);

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-brand-muted mb-8 overflow-hidden whitespace-nowrap">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-brand-gold transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Accueil</span>
      </Link>

      {paths.map((p, i) => {
        const href = `/${paths.slice(0, i + 1).join("/")}`;
        const label = ROUTE_LABELS[p] ?? p;
        const isLast = i === paths.length - 1;

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-brand-charcoal shrink-0" />
            {isLast ? (
              <span className="text-brand-gold truncate max-w-[150px] sm:max-w-none px-2 py-0.5 bg-brand-gold/5 border border-brand-gold/10 rounded-md">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-brand-gold transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
