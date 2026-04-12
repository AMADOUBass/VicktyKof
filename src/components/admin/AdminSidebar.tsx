"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Package, Users, Scissors, Image, Settings, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",             label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/appointments", label: "Rendez-vous",   icon: Calendar },
  { href: "/dashboard/products",     label: "Produits",      icon: Package },
  { href: "/dashboard/users",        label: "Clientes",      icon: Users },
  { href: "/dashboard/stylists",     label: "Stylistes",     icon: Scissors },
  { href: "/dashboard/gallery",      label: "Galerie",       icon: Image },
  { href: "/dashboard/settings",     label: "Paramètres",    icon: Settings },
];

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="font-display text-xl font-bold text-brand-gold" onClick={onClose}>
          VicktyKof
        </Link>
        <p className="text-xs text-brand-muted mt-0.5">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                  : "text-brand-muted hover:text-brand-beige hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-brand-gold/20 border border-brand-gold/40 rounded-full flex items-center justify-center text-brand-gold font-bold overflow-hidden shrink-0">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                session.user.name?.[0]?.toUpperCase() ?? "A"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-beige truncate">{session.user.name}</p>
              <p className="text-xs text-brand-muted truncate">{session.user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          Déconnexion
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (always visible lg+) ───────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-brand-charcoal border-r border-white/5 flex-col z-40">
        <NavContent />
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-charcoal border-b border-white/5 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-brand-muted hover:text-brand-beige hover:bg-white/5 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="font-display text-lg font-bold text-brand-gold">
          VicktyKof
        </Link>
        <span className="text-xs text-brand-muted ml-1">Admin</span>
      </div>

      {/* ── Mobile sidebar drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-brand-black/70 z-50"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-brand-charcoal border-r border-white/5 flex flex-col z-50"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-brand-muted hover:text-brand-beige transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
