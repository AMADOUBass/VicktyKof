"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-gold/3 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-display text-[10rem] md:text-[12rem] font-bold leading-none bg-gold-gradient bg-clip-text text-transparent select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-brand-beige mb-3">
            Page introuvable
          </h2>
          <p className="text-brand-muted mb-10 max-w-md mx-auto">
            Oups ! La page que vous cherchez n&apos;existe pas ou a été déplacée.
            Pas de panique, retrouvez votre chemin ci-dessous.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/" className="btn-primary gap-2 text-base px-8 py-4">
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline text-base px-8 py-4 gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          <p className="text-xs text-brand-muted uppercase tracking-widest mb-4">
            Liens populaires
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: "/booking", label: "Réserver" },
              { href: "/shop", label: "Boutique" },
              { href: "/gallery", label: "Galerie" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-brand-gold/70 hover:text-brand-gold border border-brand-gold/20 hover:border-brand-gold/40 px-4 py-2 rounded-full transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
