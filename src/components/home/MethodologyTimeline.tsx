"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Gem, FileSignature, KeyRound, type LucideIcon } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

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
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();

  return (
    <Section ref={containerRef} id="metodologia" label="Metodología" containerWidth="wide">
      <SectionHeader
        eyebrow="Metodología"
        title={<>Cuatro fases que <span className="metallic-gold-static">estructuran</span> cada operación.</>}
        description="Sin improvisación. Entregables definidos en cada etapa, con hitos claros y comunicación directa."
      />

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
                        className="w-14 h-14 rounded-full border border-accent/40 bg-background flex items-center justify-center group-hover:border-accent transition-colors duration-500"
                        aria-hidden="true"
                      >
                        <Icon className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={1.5} />
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
                        <span className="property-tag-type text-[var(--color-accent)]">
                          {step.number}
                        </span>
                        <span className="h-px flex-1 bg-white/[0.08] lg:hidden" />
                      </div>
                      <h3 className="text-display-4 font-semibold text-white tracking-snug mb-3">
                        {step.title}
                      </h3>
                      <p className="text-body-sm text-white/60 leading-relaxed max-w-xs">
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
    </Section>
  );
}

