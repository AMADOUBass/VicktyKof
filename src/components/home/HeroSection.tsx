"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { ArrowRight, Star, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-brand-black">
        {/* Decorative gold gradient overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-2 mb-8"
          >
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span className="text-sm text-brand-gold font-medium">
              Plus de 15 ans d&apos;expertise en locs & coiffures afro
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-beige leading-[1.1] text-balance"
          >
            L&apos;art des{" "}
            <span className="text-brand-gold italic">locs</span>
            {" "}à votre service
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed max-w-lg"
          >
            Salon premium spécialisé en locs, interlocks et coiffures afro à Québec.
            Vicky et son équipe vous accueillent dans un espace élégant dédié à votre beauté naturelle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/booking" className="btn-primary w-full sm:w-auto justify-center gap-2 text-base px-8 py-4">
              <Calendar className="w-5 h-5" />
              Réserver maintenant
            </Link>
            <Link href="/gallery" className="btn-outline w-full sm:w-auto justify-center text-base px-8 py-4">
              Voir la galerie <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 sm:mt-16 grid grid-cols-2 sm:flex sm:flex-wrap gap-8 sm:gap-10"
          >
            {[
              { value: 15, suffix: "+", label: "Années d'expérience" },
              { value: 500, suffix: "+", label: "Clientes satisfaites" },
              { value: 4, suffix: "", label: "Stylistes expertes" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-brand-gold">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-brand-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Hero salon photo */}
          <div className="relative w-full aspect-[4/5] max-w-lg ml-auto rounded-2xl overflow-hidden border border-brand-gold/20">
            <Image
              src="/images/home/hero-luxury.png"
              alt="Salon VicktyKof — ambiance et expertise"
              fill
              className="object-cover"
              quality={90}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent" />
          </div>

          {/* Floating card — next appointment */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-12 top-1/4 glass rounded-2xl p-5 shadow-gold max-w-[200px]"
          >
            <Calendar className="w-8 h-8 text-brand-gold mb-2" />
            <p className="text-sm font-semibold text-brand-beige">Prochain créneau</p>
            <p className="text-xs text-brand-gold mt-1">Disponible aujourd&apos;hui</p>
          </motion.div>

          {/* Floating rating card */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -right-8 bottom-1/4 glass rounded-2xl p-5 shadow-gold"
          >
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <p className="text-sm font-semibold text-brand-beige">4.7 / 5</p>
            <p className="text-xs text-brand-muted">Avis clients</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-brand-muted uppercase tracking-widest">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-brand-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
