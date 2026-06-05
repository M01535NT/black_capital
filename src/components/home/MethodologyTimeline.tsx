"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Search, Gem, FileSignature, KeyRound, type LucideIcon } from "lucide-react";

interface Step {
  number: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Diagnóstico",
    body: "Reunión inicial confidencial. Mapeamos objetivos, horizonte, tolerancia al riesgo y estructura fiscal para definir el perfil de búsqueda.",
    icon: Search,
  },
  {
    number: "02",
    title: "Curación",
    body: "Acceso a inventario On-Market y Off-Market curado por verticales —Luxury, Business, Industrial— con análisis estructurado por activo.",
    icon: Gem,
  },
  {
    number: "03",
    title: "Estructuración",
    body: "Coordinación con notaría, fiduciario y asesores legales. Modelado de escenarios de salida, yield objetivo y estructura de capital.",
    icon: FileSignature,
  },
  {
    number: "04",
    title: "Cierre",
    body: "Acompañamiento hasta la firma. Después: gestión post-venta, reportes trimestrales y revendedores estratégicos cuando aplica.",
    icon: KeyRound,
  },
];

export function MethodologyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();

  return (
    <section
      ref={containerRef}
      id="metodologia"
      className="scroll-snap-section relative py-24 sm:py-32 lg:py-40 bg-[#050505] border-t border-white/[0.04]"
      aria-labelledby="metodologia-title"
    >
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ── Header ── */}
        <div className="max-w-2xl mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--color-accent)]/60" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
              Metodología
            </span>
          </div>
          <h2
            id="metodologia-title"
            className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light text-white leading-[1.05] tracking-[-0.03em] mb-5"
          >
            Cuatro fases que <span className="metallic-gold-static">estructuran</span> cada operación.
          </h2>
          <p className="text-[clamp(0.9375rem,1.2vw,1.0625rem)] text-white/65 leading-[1.7] font-light">
            Sin improvisación. Entregables definidos en cada etapa, con hitos claros y comunicación directa.
          </p>
        </div>

        {/* ── Timeline (desktop: horizontal, mobile: vertical) ── */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[28px] left-0 right-0 h-px overflow-hidden" aria-hidden="true">
            {/* Base line */}
            <div className="absolute inset-0 bg-white/[0.08]" />
            {/* Gold progressive line */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--color-accent-deep)] via-[var(--color-accent)] to-[var(--color-accent-light)]"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>

          {/* Steps grid */}
          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-6 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.number}
                  initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {/* Node (desktop) / Top mark (mobile) */}
                  <div className="flex items-start gap-5 lg:flex-col lg:items-start lg:gap-0">
                    {/* Node circle */}
                    <div className="relative shrink-0 lg:mb-10">
                      <div
                        className="w-14 h-14 rounded-full border border-[var(--color-accent)]/40 bg-[#050505] flex items-center justify-center group-hover:border-[var(--color-accent)] transition-colors duration-500"
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={1.25} />
                      </div>
                      {/* Inner dot, animates in */}
                      <motion.div
                        className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-[var(--color-accent)]"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.15, ease: "easeOut" }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 lg:pt-2">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-accent)] font-semibold">
                          {step.number}
                        </span>
                        <span className="h-px flex-1 bg-white/[0.08] lg:hidden" />
                      </div>
                      <h3 className="text-[clamp(1.125rem,1.6vw,1.375rem)] font-semibold text-white tracking-[-0.01em] mb-3">
                        {step.title}
                      </h3>
                      <p className="text-[13px] text-white/60 leading-[1.7] font-light max-w-xs">
                        {step.body}
                      </p>
                    </div>
                  </div>

                  {/* Vertical connector (mobile only) */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="lg:hidden absolute left-7 top-14 bottom-[-48px] w-px bg-white/[0.08]"
                      aria-hidden="true"
                    />
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
