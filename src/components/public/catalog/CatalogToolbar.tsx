"use client";

import { useRef } from "react";
import { ArrowUpDown, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, type Filters } from "./constants";

export type View = "grid" | "list";

interface CatalogToolbarProps {
  filters: Filters;
  resultCount: number;
  panelCount: number;
  view: View;
  onSearch: (value: string) => void;
  onSort: (value: string) => void;
  onOpenFilters: () => void;
  onView: (view: View) => void;
}

export function CatalogToolbar({
  filters,
  resultCount,
  panelCount,
  view,
  onSearch,
  onSort,
  onOpenFilters,
  onView,
}: CatalogToolbarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky top-16 z-30 border-b border-white/[0.08] bg-background/85 backdrop-blur-xl lg:top-[4.5rem]">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-6 py-3.5 sm:px-10 lg:flex-row lg:items-center lg:px-16">
        {/* Buscar */}
        <div className="relative flex-1">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar propiedad
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45" />
          <input
            id="catalog-search"
            ref={searchRef}
            type="text"
            placeholder="Buscar por título, tipo o ubicación..."
            value={filters.q}
            onChange={(e) => onSearch(e.target.value)}
            className="h-11 w-full border border-white/[0.1] bg-background/70 pl-11 pr-11 text-body-sm text-white outline-none transition-colors duration-200 ease-out placeholder:text-white/35 focus:border-[var(--color-accent)]"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => {
                onSearch("");
                searchRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition-colors duration-200 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2 lg:justify-end">
          <span className="property-tag-type shrink-0 whitespace-nowrap text-white/50">
            <span className="tabular-nums text-white">{resultCount}</span>
            <span className="hidden sm:inline">
              {" "}
              {resultCount === 1 ? "resultado" : "resultados"}
            </span>
          </span>

          {/* Orden */}
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <label htmlFor="catalog-sort" className="sr-only">
              Ordenar
            </label>
            <select
              id="catalog-sort"
              value={filters.orden}
              onChange={(e) => onSort(e.target.value)}
              className="h-10 w-full appearance-none border border-white/[0.1] bg-background/70 pl-4 pr-9 property-tag-type text-white/70 outline-none transition-colors duration-200 ease-out focus:border-[var(--color-accent)] sm:w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-white/45" />
          </div>

          {/* Filtros */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-10 shrink-0 items-center gap-2 border border-white/[0.1] bg-background/70 px-4 property-tag-type text-white/80 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-[0.98]"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Filtros</span>
            {panelCount > 0 && (
              <span className="gold-gradient flex h-5 min-w-5 items-center justify-center px-1 text-[0.7rem] font-bold leading-none text-black">
                {panelCount}
              </span>
            )}
          </button>

          {/* Toggle vista */}
          <div className="hidden shrink-0 items-center border border-white/[0.1] sm:inline-flex">
            {(
              [
                { v: "grid" as const, Icon: LayoutGrid, label: "Cuadrícula" },
                { v: "list" as const, Icon: List, label: "Lista" },
              ]
            ).map(({ v, Icon, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => onView(v)}
                aria-pressed={view === v}
                aria-label={`Vista ${label}`}
                className={cn(
                  "flex h-10 w-10 items-center justify-center transition-colors duration-200 ease-out",
                  view === v
                    ? "gold-gradient text-black"
                    : "text-white/55 hover:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
