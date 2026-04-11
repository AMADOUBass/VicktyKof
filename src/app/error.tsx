"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-beige mb-3">
            Quelque chose s&apos;est mal passé
          </h1>
          <p className="text-brand-muted mb-10 max-w-md mx-auto">
            Une erreur inattendue est survenue. Veuillez réessayer ou revenir à
            la page d&apos;accueil.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button onClick={reset} className="btn-primary gap-2 text-base px-8 py-4">
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </button>
          <Link href="/" className="btn-outline text-base px-8 py-4 gap-2">
            <Home className="w-5 h-5" />
            Page d&apos;accueil
          </Link>
        </motion.div>

        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-xs text-brand-muted/50 font-mono"
          >
            Réf: {error.digest}
          </motion.p>
        )}
      </div>
    </div>
  );
}
