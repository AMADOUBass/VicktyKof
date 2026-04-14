"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, Scissors, CalendarPlus, ShoppingBag, Menu, X, User, LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/services", label: "Services", icon: Scissors },
  { href: "/booking", label: "Réserver", icon: CalendarPlus, isSpecial: true },
  { href: "/shop", label: "Boutique", icon: ShoppingBag },
  { href: "#", label: "Menu", icon: Menu },
];

const menuLinks = [
  { href: "/gallery", label: "Galerie", description: "Découvrez nos réalisations" },
  { href: "/team", label: "L'équipe", description: "Faites connaissance avec nos stylistes" },
  { href: "/faq", label: "FAQ", description: "Réponses à vos questions" },
  { href: "/contact", label: "Contact", description: "Besoin de nous parler ?" },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-brand-black/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around h-16 md:h-20 px-2 flex-wrap">
          {tabs.map((tab) => {
            const isActive = tab.href !== "#" && pathname === tab.href;
            const Icon = tab.icon;

            if (tab.isSpecial) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="relative -mt-6 flex flex-col items-center"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    pathname === tab.href 
                      ? "bg-brand-gold text-brand-black scale-110 shadow-brand-gold/40" 
                      : "bg-brand-gold text-brand-black"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold mt-1 uppercase tracking-tighter",
                    pathname === tab.href ? "text-brand-gold" : "text-brand-muted"
                  )}>
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={tab.label}
                onClick={() => {
                  if (tab.href === "#") {
                    setMenuOpen(true);
                  } else {
                    window.location.href = tab.href;
                  }
                }}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full relative group transition-colors",
                  isActive ? "text-brand-gold" : "text-brand-muted hover:text-brand-beige"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className={cn(
                  "text-[9px] font-medium mt-0.5",
                  isActive ? "text-brand-gold font-bold" : "text-brand-muted"
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="tabUnderline"
                    className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-brand-gold rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Full screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-brand-black p-6 lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">Navigation</span>
                <h2 className="font-display text-3xl font-bold text-brand-beige">Menu</h2>
              </div>
              <button 
                onClick={() => setMenuOpen(false)} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-brand-beige group-hover:text-brand-gold transition-colors">{link.label}</span>
                    <span className="text-xs text-brand-muted">{link.description}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-brand-gold opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-gold/5 border border-brand-gold/10">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xl">
                      {session.user.name?.[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-brand-beige font-semibold">{session.user.name}</span>
                      <span className="text-xs text-brand-muted">{session.user.email}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {session.user.role === "ADMIN" && (
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-sm font-medium text-brand-beige">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-sm font-medium text-brand-beige">
                      <User className="w-4 h-4" /> Mon Compte
                    </Link>
                    <button 
                      onClick={() => { setMenuOpen(false); signOut(); }}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium col-span-2"
                    >
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-center py-4">Connexion</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-center py-4">Inscription</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
