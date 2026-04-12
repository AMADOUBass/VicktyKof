"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Scissors, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-flex p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-8"
        >
          <Scissors className="w-12 h-12 text-brand-gold" />
        </motion.div>

        {/* Artistic 404 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-[120px] md:text-[180px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-brand-gold via-brand-gold/50 to-brand-black select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-beige mb-4">
            Un style perdu dans l&apos;espace ?
          </h2>
          <p className="text-brand-muted mb-10 max-w-md mx-auto text-lg">
            La page que vous recherchez n&apos;existe pas ou a été déplacée. 
            Laissez-nous vous ramener vers la beauté.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/" className="btn-primary gap-2 text-base px-10 py-4 w-full sm:w-auto">
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline text-base px-10 py-4 gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-brand-gold/20" />
            <span className="text-xs text-brand-gold uppercase tracking-[0.2em] font-medium">Suggestions</span>
            <div className="h-px w-12 bg-brand-gold/20" />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: "/booking", label: "Réserver un soin", icon: Sparkles },
              { href: "/shop", label: "Boutique en ligne" },
              { href: "/gallery", label: "Nos réalisations" },
              { href: "/services", label: "Nos tarifs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 text-sm text-brand-beige hover:text-brand-gold border border-brand-charcoal hover:border-brand-gold/40 px-6 py-3 rounded-xl bg-brand-charcoal/30 transition-all duration-300 backdrop-blur-sm"
              >
                {link.icon && <link.icon className="w-4 h-4 text-brand-gold" />}
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute text-brand-gold/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
