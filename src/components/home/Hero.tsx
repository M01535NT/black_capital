"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

const WORDS = ["Patrimonio", "Futuro", "Capital"];

export function Hero() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % WORDS.length), 4000);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || shouldReduceMotion) return;
    v.play().catch(() => {});
  }, [shouldReduceMotion]);

  return (
    <section className="scroll-snap-section relative min-h-[100dvh] flex items-center bg-[#0A0A0A] overflow-hidden" aria-label="Inicio">
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.svg"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.20]"
          style={{ filter: "brightness(0.8) contrast(1.05)" }}
        >
          <source src="/hero.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/65 to-[#0A0A0A]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8 sm:mb-10"
          >
            <span className="h-px w-10 bg-white/20" />
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/70 font-semibold">
              Inversión Inmobiliaria &middot; México
            </span>
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-white mb-6 sm:mb-8"
          >
            Invertir{" "}
            <span className="font-light">con</span>
            <br />
            <span className="inline-block min-w-[1em]">
              {shouldReduceMotion ? (
                <span className="metallic-gold-static">{WORDS[index]}</span>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={WORDS[index]}
                    initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="metallic-gold"
                  >
                    {WORDS[index]}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-[clamp(0.9375rem,1.5vw,1.125rem)] text-white/80 leading-relaxed max-w-lg mb-10 sm:mb-12 font-light"
          >
            Inversión inmobiliaria sin barreras. Presencia que respalda, experiencia que construye.
            Para quienes saben que su patrimonio merece un lugar.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              href="/inventario"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 brushed-gold text-sm font-bold tracking-wide rounded-2xl hover:brightness-105 hover:scale-[1.02] transition-all duration-300"
            >
              Explorar Propiedades
              <span className="text-base leading-none">&rarr;</span>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/15 text-white text-sm font-semibold tracking-wide rounded-2xl hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent-light)] hover:scale-[1.02] transition-all duration-300"
            >
              Hablar con un Asesor
            </Link>
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-14 sm:mt-18 text-[11px] tracking-[0.12em] uppercase text-white/60 font-semibold"
          >
            Más de 12 años &middot; CDMX &middot; Monterrey &middot; Guadalajara &middot; Tijuana
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 border-t border-white/[0.04]">
        <div className="flex overflow-hidden whitespace-nowrap py-3.5">
          <div className="animate-marquee inline-flex gap-10 sm:gap-14">
            {["Presencia", "Confianza", "Respaldo", "Experiencia", "Resultados"].map((v, i) => (
              <span key={i} className="text-[10px] tracking-[0.18em] uppercase text-white/50 font-semibold whitespace-nowrap">
                {v}
              </span>
            ))}
          </div>
          <div className="animate-marquee inline-flex gap-10 sm:gap-14">
            {["Presencia", "Confianza", "Respaldo", "Experiencia", "Resultados"].map((v, i) => (
              <span key={i} className="text-[10px] tracking-[0.18em] uppercase text-white/50 font-semibold whitespace-nowrap">
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
