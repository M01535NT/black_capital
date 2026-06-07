"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ArrowUpDown, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { USES, BUSINESS_TYPES, BRAND_TO_USE } from "@/lib/property-constants";

const SORT_OPTIONS = [
    { label: "Más recientes", value: "newest" },
    { label: "Menor precio", value: "price_asc" },
    { label: "Mayor precio", value: "price_desc" },
];

type Property = PropertyCardData;

export function CatalogFilter({ properties }: { properties: Property[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const brandUse = searchParams.get("brand") ? BRAND_TO_USE[searchParams.get("brand") as string] : null;
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [activeBusiness, setActiveBusiness] = useState<string | null>(searchParams.get("tipo") || null);
    const [activeUse, setActiveUse] = useState<string | null>(searchParams.get("uso") || brandUse || null);
    const [sort, setSort] = useState(searchParams.get("orden") || "newest");

    const searchInputRef = useRef<HTMLInputElement>(null);
    const brandProcessed = useRef(false);

    useEffect(() => {
        if (brandProcessed.current) return;
        const brand = searchParams.get("brand");
        if (brand) {
            const mapped = BRAND_TO_USE[brand];
            if (mapped) {
                brandProcessed.current = true;
                const sp = new URLSearchParams(searchParams.toString());
                sp.delete("brand");
                if (!sp.get("uso")) sp.set("uso", mapped);
                router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
            }
        }
    }, [searchParams, pathname, router]);

    const updateURL = useCallback((params: Record<string, string | null>) => {
        const sp = new URLSearchParams();
        const currentSearch = params.q !== undefined ? params.q : searchTerm;
        const currentBusiness = params.tipo !== undefined ? params.tipo : activeBusiness;
        const currentUse = params.uso !== undefined ? params.uso : activeUse;
        const currentSort = params.orden !== undefined ? params.orden : sort;

        if (currentSearch) sp.set("q", currentSearch);
        if (currentBusiness) sp.set("tipo", currentBusiness);
        if (currentUse) sp.set("uso", currentUse);
        if (currentSort && currentSort !== "newest") sp.set("orden", currentSort);

        const qs = sp.toString();
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, [searchTerm, activeBusiness, activeUse, sort, router, pathname]);

    const filtered = useMemo(() => {
        const result = properties.filter((p) => {
            const searchable = `${p.title} ${p.address ?? ""} ${p.property_use} ${p.property_type ?? ""} ${p.business_type}`.toLowerCase();
            const matchSearch = searchable.includes(searchTerm.toLowerCase());
            const matchBusiness = activeBusiness ? p.business_type.toLowerCase() === activeBusiness.toLowerCase() : true;
            const matchUse = activeUse ? p.property_use === activeUse : true;
            return matchSearch && matchBusiness && matchUse;
        });

        if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
        else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

        return result;
    }, [properties, searchTerm, activeBusiness, activeUse, sort]);

    const clearAll = () => {
        setSearchTerm("");
        setActiveBusiness(null);
        setActiveUse(null);
        setSort("newest");
        router.replace(pathname, { scroll: false });
        searchInputRef.current?.focus();
    };

    const hasFilters = activeBusiness || activeUse || searchTerm || sort !== "newest";
    const pillBase = "flex min-h-10 w-full items-center justify-center px-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-[11px] sm:tracking-[0.14em]";
    const pillActive = "bg-[var(--color-accent)] text-black";
    const pillInactive = "border border-white/[0.08] bg-white/[0.025] text-white/62 hover:border-[var(--color-accent)]/35 hover:text-white";

    return (
        <div className="w-full">
            <div className="mb-8 border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
                    <div className="relative lg:col-span-5">
                        <label htmlFor="catalog-search" className="sr-only">
                            Buscar propiedad
                        </label>
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45" />
                        <input
                            id="catalog-search"
                            ref={searchInputRef}
                            type="text"
                            placeholder="Buscar por título, zona o tipo..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                updateURL({ q: e.target.value || null });
                            }}
                            className="h-12 w-full border border-white/[0.08] bg-background/70 pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/35 transition-colors focus:border-[var(--color-accent)]"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm("");
                                    updateURL({ q: null });
                                    searchInputRef.current?.focus();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition-colors hover:text-white"
                                aria-label="Limpiar búsqueda"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-7 lg:justify-end">
                        <div className="text-sm text-white/55">
                            <strong className="font-semibold text-white">{filtered.length}</strong>{" "}
                            {filtered.length === 1 ? "resultado" : "resultados"}
                        </div>
                        <div className="relative">
                            <label htmlFor="catalog-sort" className="sr-only">
                                Ordenar propiedades
                            </label>
                            <select
                                id="catalog-sort"
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    updateURL({ orden: e.target.value === "newest" ? null : e.target.value });
                                }}
                                className="h-11 w-full appearance-none rounded-full border border-white/[0.08] bg-background/70 pl-4 pr-10 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70 outline-none transition-colors focus:border-[var(--color-accent)] sm:w-auto"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-background text-white">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-white/45" />
                        </div>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="min-h-11 rounded-full border border-[var(--color-accent)]/35 px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveBusiness(null);
                                updateURL({ tipo: null });
                            }}
                            className={`${pillBase} ${!activeBusiness ? pillActive : pillInactive}`}
                        >
                            Todo
                        </button>
                        {BUSINESS_TYPES.map((bt) => (
                            <button
                                key={bt}
                                type="button"
                                onClick={() => {
                                    const next = activeBusiness === bt ? null : bt;
                                    setActiveBusiness(next);
                                    updateURL({ tipo: next });
                                }}
                                className={`${pillBase} ${activeBusiness === bt ? pillActive : pillInactive}`}
                            >
                                {bt}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {USES.map((use) => (
                            <button
                                key={use}
                                type="button"
                                onClick={() => {
                                    const next = activeUse === use ? null : use;
                                    setActiveUse(next);
                                    updateURL({ uso: next });
                                }}
                                className={`${pillBase} ${activeUse === use ? pillActive : pillInactive}`}
                            >
                                {use}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center"
                >
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                        <Search className="size-6" aria-hidden="true" />
                    </div>
                    <h2 className="mb-3 text-display-4 font-semibold text-white">
                        No encontramos coincidencias
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-white/58">
                        Ajusta los filtros o comparte tu búsqueda con un asesor para preparar opciones similares.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={clearAll}
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-accent)]/35 px-6 text-sm font-bold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
                        >
                            Limpiar filtros
                        </button>
                        <Link
                            href="/contacto?interes=inventario"
                            className="brushed-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold"
                        >
                            Hablar con asesor
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((property, i) => (
                        <PropertyCard key={property.id} property={property} index={i} priority={i < 3} />
                    ))}
                </div>
            )}
        </div>
    );
}
