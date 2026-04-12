"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/hooks/useCartStore";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/booking", label: "Réserver" },
  { href: "/shop", label: "Boutique" },
  { href: "/gallery", label: "Galerie" },
  { href: "/team", label: "L'équipe" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-brand-black/95 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-bold text-brand-gold tracking-wide">
          VicktyKof
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 relative group",
                  pathname === link.href ? "text-brand-gold" : "text-brand-beige/70 hover:text-brand-gold"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Cart */}
          <Link href="/shop/cart" className="relative btn-ghost p-2">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-black text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 btn-ghost px-3 py-2 rounded-lg"
              >
                <div className="w-8 h-8 bg-brand-gold/20 border border-brand-gold/40 rounded-full flex items-center justify-center text-brand-gold text-sm font-semibold overflow-hidden">
                  {session.user.image ? (
                    <Image src={session.user.image} alt="" width={32} height={32} className="object-cover w-full h-full" />
                  ) : (
                    session.user.name?.[0]?.toUpperCase() ?? "?"
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-brand-muted" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-12 w-52 bg-brand-charcoal border border-white/10 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-brand-beige">{session.user.name}</p>
                      <p className="text-xs text-brand-muted truncate">{session.user.email}</p>
                    </div>
                    <div className="py-1">
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-beige hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      )}
                      {(session.user.role === "STYLIST" || session.user.role === "ADMIN") && (
                        <Link
                          href="/portal"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-beige hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                        >
                          <Scissors className="w-4 h-4" /> Mon portail
                        </Link>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-beige hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                      >
                        <User className="w-4 h-4" /> Mon compte
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-ghost text-sm">Connexion</Link>
              <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">Inscription</Link>
            </div>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <Link href="/shop/cart" className="relative btn-ghost p-2" onClick={() => setMobileOpen(false)}>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-black text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-black/98 backdrop-blur-md border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center text-base font-medium py-3 px-2 rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-brand-gold bg-brand-gold/5"
                      : "text-brand-beige/80 hover:text-brand-gold hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-white/10 space-y-1">
                {session ? (
                  <>
                    {/* User info */}
                    <div className="px-2 py-2 mb-2">
                      <p className="text-sm font-medium text-brand-beige">{session.user.name}</p>
                      <p className="text-xs text-brand-muted">{session.user.email}</p>
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-2 py-3 rounded-lg text-base text-brand-beige hover:text-brand-gold hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                      </Link>
                    )}
                    {(session.user.role === "STYLIST" || session.user.role === "ADMIN") && (
                      <Link href="/portal" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-2 py-3 rounded-lg text-base text-brand-beige hover:text-brand-gold hover:bg-white/5 transition-colors">
                        <Scissors className="w-5 h-5" /> Mon portail
                      </Link>
                    )}
                    <Link href="/account" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-2 py-3 rounded-lg text-base text-brand-beige hover:text-brand-gold hover:bg-white/5 transition-colors">
                      <User className="w-5 h-5" /> Mon profil
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); void signOut({ callbackUrl: "/" }); }}
                      className="flex items-center gap-3 w-full px-2 py-3 rounded-lg text-base text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" /> Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-outline w-full text-center">
                      Connexion
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
