"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, ArrowUpDown, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { USES, BUSINESS_TYPES, BRAND_TO_USE } from "@/lib/property-constants";

const SORT_OPTIONS = [
    { label: "Más recientes", value: "newest" },
    { label: "Menor precio", value: "price_asc" },
    { label: "Mayor precio", value: "price_desc" },
];

type Property = PropertyCardData;

// Catalog results are announced to screen readers via aria-live
export function CatalogFilter({ properties }: { properties: Property[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [activeBusiness, setActiveBusiness] = useState<string | null>(searchParams.get("tipo") || null);
    const [activeUse, setActiveUse] = useState<string | null>(searchParams.get("uso") || null);
    const [sort, setSort] = useState(searchParams.get("orden") || "newest");

    const searchInputRef = useRef<HTMLInputElement>(null);

    const brandProcessed = useRef(false);

    // Handle "brand" query param for backwards compatibility from brand page CTAs
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        // ✅ Sync brand→use mapping into URL state, guarded by brandProcessed ref
        if (brandProcessed.current) return;
        const brand = searchParams.get("brand");
        if (brand && !activeUse) {
            const mapped = BRAND_TO_USE[brand];
            if (mapped) {
                brandProcessed.current = true;
                setActiveUse(mapped);
                const sp = new URLSearchParams(searchParams.toString());
                sp.delete("brand");
                sp.set("uso", mapped);
                router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
            }
        }
    }, [searchParams, pathname, router, activeUse]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const filtered = useMemo(() => {
        const result = properties.filter((p) => {
            const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchBusiness = activeBusiness ? p.business_type.toLowerCase() === activeBusiness.toLowerCase() : true;
            const matchUse = activeUse ? p.property_use === activeUse : true;
            return matchSearch && matchBusiness && matchUse;
        });

        if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
        else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

        return result;
    }, [properties, searchTerm, activeBusiness, activeUse, sort]);

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

    const clearAll = () => {
        setSearchTerm("");
        setActiveBusiness(null);
        setActiveUse(null);
        setSort("newest");
        router.replace(pathname, { scroll: false });
    };

    const hasFilters = activeBusiness || activeUse || searchTerm || sort !== "newest";

    const pillBase = "px-5 py-2 text-caption font-display font-bold uppercase tracking-wider rounded-full transition-all duration-300";
    const pillActive = "bg-gold-500 text-black shadow-lg shadow-gold-500/20";
    const pillInactive = "text-foreground/50 hover:text-foreground hover:bg-foreground/5";

    return (
        <div className="w-full">
            {/* Search + Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                    <label htmlFor="catalog-search" className="sr-only">
                        Buscar propiedad por título
                    </label>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground/50 pointer-events-none" />
                    <input
                        id="catalog-search"
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar propiedad..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            updateURL({ q: e.target.value || null });
                        }}
                        className="w-full pl-10 pr-10 py-2.5 bg-foreground/[0.04] border border-foreground/10 rounded-full text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-gold-500/40 focus:bg-foreground/[0.06] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(""); updateURL({ q: null }); searchInputRef.current?.focus(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/60 transition-colors"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-foreground/50 tabular-nums font-numerics">
                        <strong className="text-foreground font-semibold">{filtered.length}</strong> {filtered.length === 1 ? "resultado" : "resultados"}
                    </span>
                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-wider font-display font-bold"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex gap-2 p-1.5 bg-foreground/[0.03] rounded-full border border-foreground/5 overflow-x-auto scrollbar-none max-w-full">
                    <button
                        onClick={() => { setActiveBusiness(null); updateURL({ tipo: null }); }}
                        className={`${pillBase} ${!activeBusiness ? pillActive : pillInactive}`}
                    >
                        Todos
                    </button>
                    {BUSINESS_TYPES.map((bt) => (
                        <button
                            key={bt}
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

                <div className="flex gap-2 p-1.5 bg-foreground/[0.03] rounded-full border border-foreground/5 overflow-x-auto scrollbar-none max-w-full">
                    {USES.map((use) => (
                        <button
                            key={use}
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

                {/* Sort dropdown */}
                <div className="ml-auto relative">
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
                        className="appearance-none pl-4 pr-9 py-2 bg-foreground/[0.04] border border-foreground/10 rounded-full text-caption font-display font-bold uppercase tracking-wider text-foreground/60 focus:outline-none focus:border-gold-500/30 cursor-pointer transition-all"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-background text-foreground">{opt.label}</option>
                        ))}
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-foreground/50 pointer-events-none" />
                </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center"
                >
                    <div className="size-16 rounded-full bg-foreground/[0.03] flex items-center justify-center mx-auto mb-5">
                        <Search className="size-6 text-foreground/20" />
                    </div>
                    <p className="text-foreground/50 font-medium mb-2 font-display uppercase tracking-wide">Sin resultados</p>
                    <p className="text-foreground/50 text-sm mb-8">Intenta ajustar los filtros o el término de búsqueda.</p>
                    <button
                        onClick={clearAll}
                        className="px-6 py-2.5 border border-gold-500/30 text-gold-500 rounded-full text-sm font-display font-bold uppercase tracking-wider hover:bg-gold-500 hover:text-black transition-all duration-300"
                    >
                        Limpiar todos los filtros
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((property, i) => (
                        <PropertyCard key={property.id} property={property} index={i} priority={i < 3} />
                    ))}
                </div>
            )}
        </div>
    );
}
