"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CatalogToolbar, type View } from "./catalog/CatalogToolbar";
import { filterProperties } from "./catalog/filter-properties";
import { QuickFilters } from "./catalog/QuickFilters";
import { FilterPanel } from "./catalog/FilterPanel";
import { ActiveChips } from "./catalog/ActiveChips";
import { PropertyRow } from "./catalog/PropertyRow";
import {
  EMPTY_FILTERS,
  PAGE_SIZE,
  buildChips,
  clearedValue,
  panelActiveCount,
  parseFilters,
  serializeFilters,
  type Filters,
} from "./catalog/constants";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CatalogFilter({ properties }: { properties: PropertyCardData[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const [view, setView] = useState<View>("grid");
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtersKey = serializeFilters(filters);

  // Reinicia la paginación al cambiar los filtros (ajuste de estado en render,
  // patrón sancionado por React; evita un effect con setState en cascada).
  const [pagedKey, setPagedKey] = useState(filtersKey);
  if (pagedKey !== filtersKey) {
    setPagedKey(filtersKey);
    setVisibleCount(PAGE_SIZE);
  }

  const availableTypes = useMemo(
    () =>
      Array.from(
        new Set(properties.map((p) => p.property_type).filter((t): t is string => Boolean(t))),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [properties],
  );

  const filtered = useMemo(() => filterProperties(properties, filters), [properties, filters]);

  const chips = buildChips(filters);
  const panelCount = panelActiveCount(filters);
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  const setFilters = (next: Filters) => {
    const query = serializeFilters(next);
    window.history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}`);
  };
  const update = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });
  const clearFilter = (key: keyof Filters) => update({ [key]: clearedValue(key) } as Partial<Filters>);
  const clearAll = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="w-full">
      <CatalogToolbar
        filterButtonRef={filterButtonRef}
        filters={filters}
        resultCount={filtered.length}
        panelCount={panelCount}
        view={view}
        onSearch={(v) => update({ q: v })}
        onSort={(v) => update({ orden: v })}
        onOpenFilters={() => setDrawerOpen(true)}
        onView={setView}
      />

      <div className="mx-auto max-w-[90rem] px-6 pb-16 pt-6 sm:px-10 lg:px-16">
        <QuickFilters filters={filters} onUpdate={update} />
        {!filters.moneda && (filters.precioMin || filters.precioMax || filters.orden.startsWith("price_")) && (
          <p role="status" className="mb-6 text-body-sm gold-ink">Elige MXN o USD para aplicar el rango u ordenar por precio.</p>
        )}
        {chips.length > 0 && (
          <div className="mb-6">
            <ActiveChips chips={chips} onRemove={clearFilter} onClearAll={clearAll} />
          </div>
        )}

        {filtered.length === 0 ? (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center"
          >
            <div className="gold-gradient mx-auto mb-5 flex size-16 items-center justify-center rounded-full text-black">
              <Search className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mb-3 text-display-4 text-white">No encontramos coincidencias</h2>
            <p className="mx-auto mb-8 max-w-md text-body text-white/58">
              Ajusta los filtros o comparte tu búsqueda con un asesor para preparar opciones similares.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={clearAll}
                className="group inline-flex min-h-11 items-center justify-center px-2 text-white/80 transition-colors duration-200 ease-out hover:text-[var(--color-accent)]"
              >
                <span className="property-tag-type relative pb-1">
                  Limpiar filtros
                  <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-200 group-hover:opacity-100" />
                </span>
              </button>
              <Link
                href={`/contacto?interes=inventario${filters.q ? `&busqueda=${encodeURIComponent(filters.q)}` : ""}`}
                className="brushed-gold premium-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-none px-6 active:scale-[0.98]"
              >
                Hablar con asesor
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {visible.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: (i % PAGE_SIZE) * 0.04, ease: EASE }}
                >
                  {view === "grid" ? (
                    <PropertyCard property={property} disableMotion priority={i < 3} />
                  ) : (
                    <PropertyRow property={property} />
                  )}
                </motion.div>
              ))}
            </div>

            {remaining > 0 && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  className="group inline-flex min-h-12 items-center gap-3 border border-white/[0.12] bg-white/[0.02] px-8 property-tag-type text-white/80 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-[0.98]"
                >
                  Cargar más
                  <span className="text-white/40 group-hover:text-[var(--color-accent)]/70">
                    ({remaining})
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Panel de filtros slide-over */}
      <Drawer autoFocus direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent
          accessibleTitle="Filtros del catálogo"
          onCloseAutoFocus={event => { event.preventDefault(); filterButtonRef.current?.focus(); }}
          className="w-[88%] border-l border-[var(--color-accent)]/15 bg-[#0a0a0a] sm:max-w-md"
        >
          <FilterPanel
            filters={filters}
            availableTypes={availableTypes}
            resultCount={filtered.length}
            onUpdate={update}
            onClear={clearAll}
            onClose={() => setDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
