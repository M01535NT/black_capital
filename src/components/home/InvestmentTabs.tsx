"use client";

import { useState } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

import brandLuxury from "../../../public/brand-luxury.png";
import brandLuxuryWebp from "../../../public/brand-luxury.webp";
import brandBusiness from "../../../public/brand-business.png";
import brandBusinessWebp from "../../../public/brand-business.webp";
import brandIndustrial from "../../../public/brand-industrial.png";
import brandIndustrialWebp from "../../../public/brand-industrial.webp";

interface Linea {
  id: string;
  number: string;
  name: string;
  href: string;
  description: string;
  longDescription: string;
  highlights: string[];
  image: StaticImageData;
  imageWebp: StaticImageData;
  badge: string;
  metric: { value: string; label: string }[];
}

const LINEAS: Linea[] = [
  {
    id: "luxury",
    number: "01",
    name: "Black Luxury",
    href: "/black-luxury",
    description: "Residencias y propiedades de alto valor con ubicación privilegiada.",
    longDescription:
      "Curaduría selecta de activos residenciales de alto valor. Cada propiedad incluye análisis financiero estructurado, due diligence legal completo y potencial de plusvalía verificado.",
    highlights: [
      "Off-market exclusivo",
      "Análisis comparativo de mercado",
      "Estructura fiscal para HNWI",
      "Concierge post-venta",
    ],
    image: brandLuxury,
    imageWebp: brandLuxuryWebp,
    badge: "Residencial",
    metric: [
      { value: "24+", label: "Activos bajo curaduría" },
      { value: "$180M", label: "Volumen operado" },
      { value: "11.8%", label: "Yield promedio" },
    ],
  },
  {
    id: "business",
    number: "02",
    name: "Black Business",
    href: "/black-business",
    description: "Oficinas, locales y activos corporativos con potencial real.",
    longDescription:
      "Selección rigurosa de activos comerciales con potencial de generación de flujo. Cada propiedad incluye análisis financiero estructurado, modelado de TIR a 10 años y contratos con inquilinos verificados.",
    highlights: [
      "Cap rate estabilizado",
      "TIR proyectada a 10 años",
      "Inquilinos AAA verificados",
      "Modelos de salida definidos",
    ],
    image: brandBusiness,
    imageWebp: brandBusinessWebp,
    badge: "Comercial",
    metric: [
      { value: "16+", label: "Activos bajo curaduría" },
      { value: "$140M", label: "Volumen operado" },
      { value: "9.2%", label: "Cap rate promedio" },
    ],
  },
  {
    id: "industrial",
    number: "03",
    name: "Black Industrial",
    href: "/black-industrial",
    description: "Naves, bodegas y terrenos para operaciones que mueven la economía.",
    longDescription:
      "Selección curada de naves logísticas, parques industriales y terrenos con uso de suelo garantizado. Cada activo incluye análisis de conectividad, modelado financiero y opciones de build-to-suit.",
    highlights: [
      "Uso de suelo verificado",
      "Conectividad logística",
      "Build-to-suit disponible",
      "Contratos triple net",
    ],
    image: brandIndustrial,
    imageWebp: brandIndustrialWebp,
    badge: "Industrial",
    metric: [
      { value: "12+", label: "Activos bajo curaduría" },
      { value: "$220M", label: "Volumen operado" },
      { value: "13.6%", label: "Yield promedio" },
    ],
  },
];

export function InvestmentTabs() {
  const [activeId, setActiveId] = useState<string>(LINEAS[0].id);
  const shouldReduce = useReducedMotion();
  const active = LINEAS.find((l) => l.id === activeId) ?? LINEAS[0];

  return (
    <section
      id="lineas"
      className="scroll-snap-section relative py-24 sm:py-32 lg:py-40 bg-[#050505] border-t border-white/[0.04]"
      aria-label="Líneas de inversión"
    >
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ── Header ── */}
        <div className="mb-14 sm:mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--color-accent)]/60" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
              Tres líneas de inversión
            </span>
          </div>
          <h2 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light text-white leading-[1.05] tracking-[-0.03em] mb-5">
            Elige la que va <span className="metallic-gold-static">contigo</span>.
          </h2>
          <p className="text-[clamp(0.9375rem,1.2vw,1.0625rem)] text-white/65 leading-[1.7] font-light max-w-xl">
            Sin tecnicismos. Tres caminos claros para hacer crecer tu patrimonio, cada uno con su tesis de inversión y perfil de riesgo.
          </p>
        </div>

        {/* ── Tabs + Detail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Tab list + giant numbers (cols 1-5) */}
          <div className="lg:col-span-5">
            <div className="space-y-2" role="tablist" aria-label="Líneas de inversión">
              {LINEAS.map((linea) => {
                const isActive = activeId === linea.id;
                return (
                  <button
                    key={linea.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${linea.id}`}
                    id={`tab-${linea.id}`}
                    onClick={() => setActiveId(linea.id)}
                    className={cn(
                      "group w-full text-left py-6 pl-6 pr-4 border-l transition-all duration-500",
                      "flex items-center gap-5 sm:gap-6",
                      isActive
                        ? "border-[var(--color-accent)] bg-white/[0.015]"
                        : "border-white/10 hover:border-white/30 hover:bg-white/[0.01]",
                    )}
                  >
                    {/* Giant number */}
                    <span
                      className={cn(
                        "text-[clamp(2.5rem,5vw,4rem)] font-light leading-none tabular-nums transition-all duration-500 shrink-0",
                        isActive ? "metallic-gold-static" : "text-white/20",
                      )}
                    >
                      {linea.number}
                    </span>

                    {/* Name + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-accent)] font-semibold">
                          {linea.badge}
                        </span>
                      </div>
                      <h3
                        className={cn(
                          "text-[clamp(1.125rem,1.8vw,1.5rem)] font-semibold tracking-[-0.01em] transition-colors duration-500",
                          isActive ? "text-white" : "text-white/70 group-hover:text-white/90",
                        )}
                      >
                        {linea.name}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight
                      className={cn(
                        "w-5 h-5 shrink-0 transition-all duration-500",
                        isActive
                          ? "text-[var(--color-accent)] translate-x-0 translate-y-0"
                          : "text-white/30 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-white/60",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Active detail panel (cols 6-12) */}
          <div className="lg:col-span-7 relative min-h-[480px] lg:min-h-[560px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                id={`panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${active.id}`}
                initial={shouldReduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full overflow-hidden"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <picture>
                    <source srcSet={active.imageWebp.src} type="image/webp" />
                    <Image
                      src={active.image}
                      alt={active.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </picture>
                  {/* Layered dark overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/55 to-[#050505]/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#050505]/70" />
                  <div className="grain-overlay" />
                  {/* Hairline borders */}
                  <div className="absolute inset-0 border border-white/[0.04]" />
                </div>

                {/* Content overlay */}
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 lg:p-12 min-h-[480px] lg:min-h-[560px]">
                  <p className="text-white/85 leading-[1.75] text-[clamp(0.9375rem,1.15vw,1.0625rem)] font-light max-w-2xl mb-8">
                    {active.longDescription}
                  </p>

                  {/* Highlights list */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 mb-8 max-w-2xl">
                    {active.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-3 text-[13px] text-white/75 font-light"
                      >
                        <span className="w-3 h-px bg-[var(--color-accent)] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Metrics + CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div className="grid grid-cols-3 gap-6 sm:gap-8">
                      {active.metric.map((m) => (
                        <div key={m.label} className="min-w-0">
                          <div className="text-[clamp(1.25rem,2vw,1.5rem)] font-light metallic-gold-static tabular-nums leading-none mb-1.5">
                            {m.value}
                          </div>
                          <div className="text-[10px] tracking-[0.18em] uppercase text-white/55 font-semibold leading-tight">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={active.href}
                      className="btn-ghost-gold inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white text-xs font-semibold uppercase tracking-[0.16em] rounded-full transition-colors duration-300 hover:border-[var(--color-accent)]/70 shrink-0"
                    >
                      <span>Ver línea completa</span>
                      <span aria-hidden="true" className="text-[var(--color-accent)]">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
