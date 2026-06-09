"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Section } from "@/components/layout/Section";
import type { FeaturedProperty } from "@/lib/inventory";

interface InventoryClientProps {
  items: FeaturedProperty[];
  isLive: boolean;
}

/**
 * Client part of InventoryShowcase. Receives the server-fetched items
 * (no Supabase client bundle in the browser, no useEffect data loop).
 * Handles carousel scroll, motion fade-in and the empty / error states.
 */
export function InventoryClient({ items, isLive }: InventoryClientProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <Section id="inventario" label="Inventario destacado" containerWidth="wide">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14 sm:mb-20">
        <div className="max-w-2xl">
          <Eyebrow label="Inventario" />
          <h2 className="text-display-2 text-white leading-display tracking-headline mb-4">
            Propiedades con <span className="metallic-gold-static">potencial real</span>.
          </h2>
          <p className="text-body-fluid-sm text-white/65 leading-relaxed max-w-lg">
            Sin maquillaje, sin fotos con truco. Lo que ves es lo que hay, con análisis financiero estructurado por activo.
          </p>
        </div>

        {/* Desktop controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollBy(-1)}
            className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:border-[var(--color-accent)]/60 hover:text-white transition-colors duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollBy(1)}
            className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:border-[var(--color-accent)]/60 hover:text-white transition-colors duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            href="/inventario"
            className="hidden sm:inline-flex premium-cta items-center gap-2 ml-3 px-5 py-2.5 border border-[var(--color-accent)]/30 transition-all duration-300"
          >
            <span>Ver todo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Body ── */}
      {items.length > 0 ? (
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <motion.div
            ref={trackRef}
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-6 sm:-mx-10 lg:-mx-16 px-6 sm:px-10 lg:px-16"
            role="list"
            aria-label="Propiedades destacadas"
          >
            {items.map((item) => (
              <div
                key={item.id}
                data-card
                className="shrink-0 w-[78vw] sm:w-[400px] lg:w-[440px] snap-start"
                role="listitem"
              >
                <PropertyCard
                  property={item}
                  variant="featured"
                  disableMotion
                  priority={false}
                />
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-20 max-w-md mx-auto">
          <h3 className="text-display-3 text-white/70 mb-2">
            {isLive ? "Actualizando inventario" : "Sin propiedades destacadas"}
          </h3>
          <p className="text-body-sm text-white/50">
            {isLive
              ? "Estamos seleccionando propiedades con cuidado. Vuelve pronto."
              : "No pudimos cargar el inventario. Recarga la página en un momento."}
          </p>
        </div>
      )}

      {/* Mobile: see-all link */}
      <div className="sm:hidden mt-10 text-center">
        <Link
          href="/inventario"
        className="inline-flex premium-cta items-center gap-2 px-5 py-2.5 border border-[var(--color-accent)]/30"
        >
          <span>Ver todo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Section>
  );
}

