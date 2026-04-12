import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Réserver un rendez-vous", href: "/booking" },
    { label: "Nos services", href: "/#services" },
    { label: "L'équipe", href: "/team" },
    { label: "Galerie", href: "/gallery" },
  ],
  boutique: [
    { label: "Produits", href: "/shop" },
    { label: "Kits pour locs", href: "/shop?category=kits" },
    { label: "Soins capillaires", href: "/shop?category=soins" },
    { label: "Accessoires", href: "/shop?category=accessoires" },
  ],
  legal: [
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Retours & Échanges", href: "/returns" },
    { label: "Politique de remboursement", href: "/refunds" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-charcoal border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-3xl font-bold text-brand-gold">
              VicktyKof
            </Link>
            <p className="mt-4 text-brand-muted text-sm leading-relaxed max-w-xs">
              Salon premium spécialisé en locs et coiffures afro. Plus de 15 ans d&apos;expertise
              avec Vicky et son équipe passionnée.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="https://maps.google.com/?q=2177+rue+du+Carrousel+Quebec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-brand-muted hover:text-brand-gold transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-gold" />
                2177 rue du Carrousel, Québec, G2B 5B5
              </a>
              <a
                href="tel:+15817457409"
                className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-gold transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-brand-gold" />
                (581) 745-7409
              </a>
              <a
                href="mailto:victykoff@gmail.com"
                className="flex items-center gap-3 text-sm text-brand-muted hover:text-brand-gold transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-brand-gold" />
                victykoff@gmail.com
              </a>
            </div>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/vicktykof_beaute_locks_quebec/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/Victykofhairbeauty/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@vicktykof"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.36-.54.38-.89.98-1.01 1.64-.13.96.2 2.02 1 2.67.63.56 1.53.73 2.36.5 1.1-.38 1.83-1.44 1.84-2.6.02-3.76-.04-7.52.02-11.28z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-4">
              Boutique
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.boutique.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-4">
              Légal
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} VicktyKof. Tous droits réservés.
          </p>
          <p className="text-xs text-brand-muted">
            Conçu avec passion pour les coiffures afro
          </p>
        </div>
      </div>
    </footer>
  );
}
