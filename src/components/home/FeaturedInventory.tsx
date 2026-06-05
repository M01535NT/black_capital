"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { RevealText } from "@/components/ui/reveal-text";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { createClient } from "@/lib/supabase/client";

type FeaturedProperty = PropertyCardData & { property_type: string };
const SKELETON_COUNT = 3;

export function FeaturedInventory() {
  const [items, setItems] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
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
      console.error("[FeaturedInventory]", err);
      setError(err instanceof Error ? err.message : "Error al cargar inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeatured(); }, [fetchFeatured]);

  return (
    <section className="scroll-snap-section relative py-20 sm:py-28 bg-[#0A0A0A] border-t border-white/[0.04]" aria-label="Inventario destacado">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-20">
          <div>
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-semibold mb-4 block">Inventario</span>
            <RevealText as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-3">
              Propiedades con potencial real
            </RevealText>
            <p className="text-[clamp(0.875rem,1.2vw,1rem)] text-white/70 max-w-lg font-light">
              Sin maquillaje, sin fotos con truco. Lo que ves es lo que hay.
            </p>
          </div>
          <Link href="/inventario"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white text-sm font-semibold rounded-2xl hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent-light)] transition-all duration-300"
          >
            Ver Todo <span className="text-base">&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">
            {[...Array(SKELETON_COUNT)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-3xl bg-white/[0.02] shimmer" />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="text-center py-16">
            <p className="text-white/70 mb-4 font-light">{error}</p>
            <button onClick={fetchFeatured}
              className="px-6 py-3 border border-white/15 text-white text-sm font-semibold rounded-2xl hover:border-[var(--color-accent)]/50 transition-all duration-300"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-white/70 mb-2 tracking-[-0.01em]">Actualizando inventario</h3>
            <p className="text-sm text-white/50 font-light">Estamos seleccionando propiedades con cuidado. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <PropertyCard key={item.id} property={item} variant="featured" disableMotion priority={false} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
