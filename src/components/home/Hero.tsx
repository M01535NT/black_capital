"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const ROTATING_WORDS = ["Estrategia", "Disciplina", "Transparencia"] as const;

const VALUES = [
  "Honestidad",
  "Compromiso",
  "Disciplina",
  "Conocimiento",
  "Transparencia",
  "Experiencia",
  "Integridad",
  "Resultados",
];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(
      () => setWordIndex((p) => (p + 1) % ROTATING_WORDS.length),
      4500,
    );
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <section
      className="scroll-snap-section relative min-h-[100svh] flex items-center overflow-hidden bg-background pt-16 lg:pt-20 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Inicio"
    >
      {/* ── Top hairline (gold accent, 1px) ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent z-30" />

      {/* ── Main content grid (12-col asymmetric) ── */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[68vh]">
          {/* ═══════ LEFT: Title block (cols 1-7) ═══════ */}
          <div className="lg:col-span-7 relative">
            {/* Vertical hairline (desktop only) */}
            <div className="hidden lg:block absolute -left-8 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent" />

            {/* Eyebrow tag */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center gap-3 mb-3 sm:mb-10"
            >
              <span className="h-px w-6 sm:w-10 bg-[var(--color-accent)]/60" />
              <span className="text-caption text-white/75">
                Inversión inmobiliaria · Tijuana
              </span>
            </motion.div>

            {/* Massive title */}
            <h1 className="text-display-1 text-white mb-4 sm:mb-12 text-balance">
              <motion.span
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 32, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Invertir
              </motion.span>
              <motion.span
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 32, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                con{" "}
                <span className="relative inline-block min-w-[11ch]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={ROTATING_WORDS[wordIndex]}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16, filter: "blur(4px)" }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block text-[var(--color-accent)] gold-glow"
                      aria-live="off"
                    >
                      {ROTATING_WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-accent via-accent-end to-transparent"
                  />
                </span>
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-body text-white/75 leading-relaxed max-w-xl mb-5 sm:mb-14"
            >
              Estructuramos, curamos y gestionamos activos residenciales, comerciales e industriales en Tijuana. Con análisis financiero claro, directo y sin rodeos.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4"
            >
              <Link
                href="/inventario"
                className="brushed-gold premium-cta group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 hover:scale-[1.015] transition-all duration-300 min-h-[48px]"
              >
                <span>Explorar Propiedades</span>
                <span aria-hidden="true" className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contacto"
                className="btn-ghost-gold premium-cta inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-white/[0.04] border border-white/35 transition-colors duration-300 hover:border-accent hover:bg-white/[0.06]"
              >
                <span>Hablar con un Asesor</span>
              </Link>
            </motion.div>
          </div>

          {/* ═══════ RIGHT: Visual (cols 8-12) ═══════ */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative aspect-[16/9] sm:aspect-[4/5] lg:aspect-[3/4] max-h-[35vh] sm:max-h-[80vh] max-w-sm mx-auto sm:max-w-none sm:mx-0 order-first lg:order-last"
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* LCP layer: static WebP loads instantly, video enhances if supported */}
              <Image
                src="/hero-poster.webp"
                alt="Black Capital — Inversión inmobiliaria en Tijuana"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/hero-poster.webp"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/hero.webm" type="video/webm" />
              </video>

              {/* Layered dark overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/70" />

              {/* Subtle grain */}
              <div className="grain-overlay" />

              {/* Gold micro-borders (1px) */}
              <div className="absolute inset-0 border border-[var(--color-accent)]/15" />
              <div className="absolute top-0 right-0 w-14 h-14 border-t border-r border-[var(--color-accent)]/50" />
              <div className="absolute bottom-0 left-0 w-14 h-14 border-b border-l border-[var(--color-accent)]/50" />
            </div>

            {/* Floating micro-label (live indicator) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-background/95 border border-white/10 px-2 sm:px-5 py-1.5 sm:py-3 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                <span className="property-tag-type text-white/80">
                  Live · Mercado
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ BOTTOM: City marquee (slow, gold diamonds) ═══════ */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="gold-divider-solid" />
        <div
          className="flex overflow-hidden whitespace-nowrap py-2 sm:py-5 bg-background/85 backdrop-blur-md"
          role="presentation"
          aria-hidden="true"
        >
          {/* Two duplicated strips, each animating from 0 → -100% for seamless loop */}
          <div className="animate-marquee inline-flex shrink-0">
            {VALUES.map((v, i) => (
              <span key={`a-${v}-${i}`} className="inline-flex items-center shrink-0">
                <span className="property-tag-type px-2.5 sm:px-10 whitespace-nowrap">
                  {v}
                </span>
                <span className="text-[var(--color-accent)] text-sm select-none" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
          <div className="animate-marquee inline-flex shrink-0">
            {VALUES.map((v, i) => (
              <span key={`b-${v}-${i}`} className="inline-flex items-center shrink-0">
                <span className="property-tag-type px-2.5 sm:px-10 whitespace-nowrap">
                  {v}
                </span>
                <span className="text-[var(--color-accent)] text-sm select-none" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
