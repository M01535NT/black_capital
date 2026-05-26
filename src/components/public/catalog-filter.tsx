"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

type Property = {
    id: string;
    title: string;
    property_use: string;
    property_type: string;
    business_type: string;
    price: number;
    currency: string;
    m2_terrain: number | null;
    m2_construction: number | null;
    cover_image: string | null;
    status: string;
};

const USES = ["Residencial", "Comercial", "Industrial"];
const BUSINESS_TYPES = ["Venta", "Renta"];
const SORT_OPTIONS = [
    { label: "Más recientes", value: "newest" },
    { label: "Menor precio", value: "price_asc" },
    { label: "Mayor precio", value: "price_desc" },
];

function formatPrice(price: number, currency: string, businessType: string): string {
    if (businessType === "Renta") {
        return `$${price.toLocaleString("es-MX")} ${currency}/mes`;
    }
    if (price >= 1_000_000) {
        return `$${(price / 1_000_000).toFixed(1)} M ${currency}`;
    }
    return `$${price.toLocaleString("es-MX")} ${currency}`;
}

function PropertyCard({ property, index }: { property: Property; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link
                href={`/inventario/${property.id}`}
                className="group block bg-card border border-foreground/5 rounded-2xl overflow-hidden hover:border-gold-500/30 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.12)] transition-all duration-500"
            >
                <div className="aspect-[4/3] relative overflow-hidden bg-foreground/[0.03]">
                    {property.cover_image ? (
                        <img
                            src={property.cover_image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading={index < 6 ? "eager" : "lazy"}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-foreground/15 text-sm font-medium">Sin imagen</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded-full">
                            {property.property_use}
                        </span>
                        <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gold-500 text-black rounded-full">
                            {property.business_type}
                        </span>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="font-semibold text-[0.9375rem] leading-snug line-clamp-2 group-hover:text-gold-500 transition-colors mb-3">
                        {property.title}
                    </h3>
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-foreground/5">
                        <div className="flex gap-3 text-[11px] text-foreground/40 font-medium uppercase tracking-wider">
                            {property.m2_terrain ? <span>{property.m2_terrain.toLocaleString()} m² T</span> : null}
                            {property.m2_construction ? <span>{property.m2_construction.toLocaleString()} m² C</span> : null}
                        </div>
                        <span className="text-sm font-semibold font-numerics text-gold-500 whitespace-nowrap">
                            {formatPrice(property.price, property.currency, property.business_type)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function CatalogFilter({ properties }: { properties: Property[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [activeBusiness, setActiveBusiness] = useState<string | null>(searchParams.get("tipo") || null);
    const [activeUse, setActiveUse] = useState<string | null>(searchParams.get("uso") || null);
    const [sort, setSort] = useState(searchParams.get("orden") || "newest");
    
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
        let result = properties.filter((p) => {
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

    return (
        <div className="w-full">
            {/* Search + Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground/30" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar propiedad..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            updateURL({ q: e.target.value || null });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-foreground/[0.04] border border-foreground/10 rounded-full text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-gold-500/40 focus:bg-foreground/[0.06] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(""); updateURL({ q: null }); searchInputRef.current?.focus(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground/40 tabular-nums">
                        <strong className="text-foreground font-semibold">{filtered.length}</strong> {filtered.length === 1 ? "resultado" : "resultados"}
                    </span>
                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-wider font-semibold"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex gap-1 p-1 bg-foreground/[0.04] rounded-full">
                    <button
                        onClick={() => { setActiveBusiness(null); updateURL({ tipo: null }); }}
                        className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                            !activeBusiness
                                ? "bg-gold-500 text-black shadow-lg shadow-gold-500/15"
                                : "text-foreground/50 hover:text-foreground"
                        }`}
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
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                                activeBusiness === bt
                                    ? "bg-gold-500 text-black shadow-lg shadow-gold-500/15"
                                    : "text-foreground/50 hover:text-foreground"
                            }`}
                        >
                            {bt}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1 p-1 bg-foreground/[0.04] rounded-full">
                    {USES.map((use) => (
                        <button
                            key={use}
                            onClick={() => {
                                const next = activeUse === use ? null : use;
                                setActiveUse(next);
                                updateURL({ uso: next });
                            }}
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                                activeUse === use
                                    ? "bg-gold-500 text-black shadow-lg shadow-gold-500/15"
                                    : "text-foreground/50 hover:text-foreground"
                            }`}
                        >
                            {use}
                        </button>
                    ))}
                </div>

                {/* Sort dropdown */}
                <div className="ml-auto relative">
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            updateURL({ orden: e.target.value === "newest" ? null : e.target.value });
                        }}
                        className="appearance-none pl-3 pr-8 py-1.5 bg-foreground/[0.04] border border-foreground/10 rounded-full text-xs font-medium text-foreground/60 focus:outline-none focus:border-gold-500/30 cursor-pointer transition-all"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-background text-foreground">{opt.label}</option>
                        ))}
                    </select>
                    <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-foreground/30 pointer-events-none" />
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
                    <p className="text-foreground/50 font-medium mb-2">Sin resultados</p>
                    <p className="text-foreground/30 text-sm mb-8">Intenta ajustar los filtros o el término de búsqueda.</p>
                    <button
                        onClick={clearAll}
                        className="px-6 py-2.5 border border-gold-500/30 text-gold-500 rounded-full text-sm font-semibold hover:bg-gold-500 hover:text-black transition-all duration-300"
                    >
                        Limpiar todos los filtros
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((property, i) => (
                        <PropertyCard key={property.id} property={property} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
