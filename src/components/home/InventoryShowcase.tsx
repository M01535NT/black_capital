"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { supabase } from "@/lib/supabase/client";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Section } from "@/components/layout/Section";

type FeaturedProperty = PropertyCardData & { property_type: string };
const SKELETON_COUNT = 6;

export function InventoryShowcase() {
  const [items, setItems] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: qe } = await supabase
        .from("properties")
        .select(
          "id, title, slug, property_use, business_type, m2_terrain, m2_construction, price, currency, cover_image, custom_attributes, property_type"
        )
        .eq("is_featured", true)
        .eq("status", "Available")
        .order("created_at", { ascending: false })
        .limit(SKELETON_COUNT);
      if (qe) throw new Error(qe.message);
      setItems((data as FeaturedProperty[]) || []);
    } catch (err) {
      console.error("[InventoryShowcase]", err);
      setError(err instanceof Error ? err.message : "Error al cargar inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

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
            <h2 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-light text-white leading-[1.05] tracking-[-0.03em] mb-4">
              Propiedades con <span className="metallic-gold-static">potencial real</span>.
            </h2>
            <p className="text-[clamp(0.9375rem,1.2vw,1.0625rem)] text-white/65 leading-[1.7] font-light max-w-lg">
              Sin maquillaje, sin fotos con truco. Lo que ves es lo que hay, con análisis financiero estructurado por activo.
            </p>
          </div>

          {/* Controls: arrows + see-all link */}
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
              className="hidden sm:inline-flex items-center gap-2 ml-3 px-5 py-2.5 border border-[var(--color-accent)]/30 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full hover:border-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-all duration-300"
            >
              <span>Ver todo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Carousel ── */}
        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[78vw] sm:w-[420px] aspect-[4/5] rounded-sm bg-white/[0.02] shimmer"
              />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="text-center py-20 max-w-md mx-auto">
            <p className="text-white/70 mb-5 font-light">{error}</p>
            <button
              onClick={fetchFeatured}
              className="px-6 py-3 border border-white/15 text-white text-sm font-semibold rounded-full hover:border-[var(--color-accent)]/60 transition-colors duration-300"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <h3 className="text-xl font-light text-white/70 mb-2 tracking-[-0.01em]">
              Actualizando inventario
            </h3>
            <p className="text-sm text-white/50 font-light">
              Estamos seleccionando propiedades con cuidado. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Fade edges — indica que hay más contenido desplazable */}
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
        )}

        {/* Mobile: See-all link at the bottom */}
        <div className="sm:hidden mt-10 text-center">
          <Link
            href="/inventario"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-accent)]/30 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full"
          >
            <span>Ver todo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
    </Section>
  );
}
