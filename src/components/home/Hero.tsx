"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

const ROTATING_WORDS = ["Patrimonio", "Inteligencia", "Black"] as const;

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

// Duplicamos la lista para el efecto de loop infinito del marquee
const MARQUEE = [...VALUES, ...VALUES];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(
      () => setWordIndex((p) => (p + 1) % ROTATING_WORDS.length),
      3500,
    );
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <section
      className="scroll-snap-section relative min-h-[100dvh] flex items-center overflow-hidden bg-[#050505]"
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
              <span className="text-[9px] sm:text-[11px] tracking-[0.22em] uppercase text-white/75 font-semibold">
                Inversión inmobiliaria · Tijuana
              </span>
            </motion.div>

            {/* Massive title */}
            <h1 className="text-[clamp(2rem,8.5vw,7rem)] sm:text-[clamp(3rem,8.5vw,7rem)] font-light leading-[0.98] tracking-[-0.04em] text-white mb-4 sm:mb-12">
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
                      className="metallic-gold-static gold-glow inline-block"
                      aria-live="polite"
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
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-transparent"
                  />
                </span>
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(0.875rem,1.4vw,1.25rem)] sm:text-[clamp(1.0625rem,1.4vw,1.25rem)] text-white/75 leading-[1.6] sm:leading-[1.95] max-w-xl mb-5 sm:mb-14 font-light tracking-[0.005em]"
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
                className="brushed-gold group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-9 py-3 sm:py-4 text-[13px] sm:text-sm font-bold tracking-[0.06em] rounded-full hover:scale-[1.015] transition-all duration-300"
              >
                <span>Explorar Propiedades</span>
                <span aria-hidden="true" className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contacto"
                className="btn-ghost-gold inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-9 py-3 sm:py-4 bg-white/[0.04] border border-white/35 text-white text-[13px] sm:text-sm font-semibold tracking-[0.06em] rounded-full transition-colors duration-300 hover:border-[#D4AF37] hover:bg-white/[0.06]"
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
              {/* The visual: video with poster fallback */}
              <video
                autoPlay
                muted
                loop
                playsInline
                poster="/hero-poster.svg"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/hero.webm" type="video/webm" />
              </video>

              {/* Layered dark overlays for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#050505]/70" />

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
              className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-[#050505]/95 border border-white/10 px-2 sm:px-5 py-1.5 sm:py-3 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-[0.22em] uppercase text-white/80 font-semibold">
                  Live · Mercado
                </span>
              </div>
            </motion.div>

            {/* Vertical "01" stamp (desktop only) */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.4 }}
              className="hidden lg:flex absolute -right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-3"
              aria-hidden="true"
            >
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-[var(--color-accent)]/50" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-semibold [writing-mode:vertical-rl] rotate-180">
                Black · 01
              </span>
              <div className="w-px h-12 bg-gradient-to-t from-transparent to-[var(--color-accent)]/50" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ BOTTOM: City marquee (slow, gold diamonds) ═══════ */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="gold-divider-solid" />
        <div
          className="flex overflow-hidden whitespace-nowrap py-3 sm:py-5 bg-[#050505]/85 backdrop-blur-md"
          role="presentation"
          aria-hidden="true"
        >
          {/* Two duplicated strips, each animating from 0 → -100% for seamless loop */}
          <div className="animate-marquee inline-flex shrink-0">
            {VALUES.map((v, i) => (
              <span key={`a-${v}-${i}`} className="inline-flex items-center shrink-0">
                <span className="px-3 sm:px-10 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.28em] uppercase text-white/75 font-semibold whitespace-nowrap">
                  {v}
                </span>
                <span className="text-[#D4AF37] text-sm select-none" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
          <div className="animate-marquee inline-flex shrink-0">
            {VALUES.map((v, i) => (
              <span key={`b-${v}-${i}`} className="inline-flex items-center shrink-0">
                <span className="px-3 sm:px-10 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.28em] uppercase text-white/75 font-semibold whitespace-nowrap">
                  {v}
                </span>
                <span className="text-[#D4AF37] text-sm select-none" aria-hidden="true">
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
