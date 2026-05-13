"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";

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

function formatPrice(price: number, currency: string, businessType: string): string {
    if (businessType === "Renta") {
        return `$${price.toLocaleString("es-MX")} ${currency}/m²/mes`;
    }
    if (price >= 1_000_000) {
        return `$${(price / 1_000_000).toFixed(1)} M ${currency}`;
    }
    return `$${price.toLocaleString("es-MX")} ${currency}`;
}

export function CatalogFilter({ properties }: { properties: Property[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [showSearch, setShowSearch] = useState(!!searchParams.get("q"));
    const [activeBusiness, setActiveBusiness] = useState<string | null>(searchParams.get("tipo") || null);
    const [activeUse, setActiveUse] = useState<string | null>(searchParams.get("uso") || null);

    const filtered = useMemo(() => {
        return properties.filter((p) => {
            const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchBusiness = activeBusiness ? p.business_type === activeBusiness : true;
            const matchUse = activeUse ? p.property_use === activeUse : true;
            return matchSearch && matchBusiness && matchUse;
        });
    }, [properties, searchTerm, activeBusiness, activeUse]);

    const setFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams();
        if (searchTerm) params.set("q", searchTerm);
        if (activeBusiness && (key !== "tipo" || value !== null)) {
            if (key === "tipo") { if (value) params.set("tipo", value); }
            else if (activeBusiness) params.set("tipo", activeBusiness);
        }
        if (activeUse && (key !== "uso" || value !== null)) {
            if (key === "uso") { if (value) params.set("uso", value); }
            else if (activeUse) params.set("uso", activeUse);
        }
        const qs = params.toString();
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });

        if (key === "tipo") setActiveBusiness(activeBusiness === value ? null : value);
        if (key === "uso") setActiveUse(activeUse === value ? null : value);
    };

    const clearAll = () => {
        setSearchTerm("");
        setActiveBusiness(null);
        setActiveUse(null);
        router.replace(pathname, { scroll: false });
    };

    const hasFilters = activeBusiness || activeUse || searchTerm;

    return (
        <div className="w-full">
            {/* ── Top Bar: Search + Results count ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Buscar propiedad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2.5 bg-transparent border border-foreground/10 rounded-full text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold-500/50 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground/50">
                        <strong className="text-foreground">{filtered.length}</strong> resultados
                    </span>
                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-wider font-medium"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* ── Filter Tabs ── */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                {/* Business Type Pills */}
                <div className="flex gap-1.5 p-1 bg-foreground/5 rounded-full">
                    <button
                        onClick={() => setFilter("tipo", null)}
                        className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all ${
                            !activeBusiness
                                ? "bg-gold-500 text-black shadow-lg shadow-gold-500/20"
                                : "text-foreground/60 hover:text-foreground"
                        }`}
                    >
                        Todos
                    </button>
                    {BUSINESS_TYPES.map((bt) => (
                        <button
                            key={bt}
                            onClick={() => setFilter("tipo", bt)}
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all ${
                                activeBusiness === bt
                                    ? "bg-gold-500 text-black shadow-lg shadow-gold-500/20"
                                    : "text-foreground/60 hover:text-foreground"
                            }`}
                        >
                            {bt}
                        </button>
                    ))}
                </div>

                {/* Use Pills */}
                <div className="flex gap-1.5 p-1 bg-foreground/5 rounded-full">
                    {USES.map((use) => (
                        <button
                            key={use}
                            onClick={() => setFilter("uso", use)}
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all ${
                                activeUse === use
                                    ? "bg-gold-500 text-black shadow-lg shadow-gold-500/20"
                                    : "text-foreground/60 hover:text-foreground"
                            }`}
                        >
                            {use}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Results Grid ── */}
            {filtered.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-foreground/10 rounded-2xl">
                    <p className="text-foreground/60 text-lg font-medium mb-2">Sin resultados</p>
                    <p className="text-foreground/40 text-sm mb-6">Intenta con otros filtros.</p>
                    <button
                        onClick={clearAll}
                        className="px-6 py-2 border border-gold-500 text-gold-500 rounded-full text-sm font-semibold hover:bg-gold-500 hover:text-black transition-all"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((property) => (
                        <Link
                            key={property.id}
                            href={`/inventario/${property.id}`}
                            className="group block bg-background border border-foreground/5 rounded-2xl overflow-hidden hover:border-gold-500/30 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] transition-all duration-500"
                        >
                            {/* Image */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-foreground/5">
                                {property.cover_image ? (
                                    <img
                                        src={property.cover_image}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-foreground/20 text-sm">Sin imagen</span>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-black/70 backdrop-blur-md text-white rounded-full border border-white/10">
                                        {property.property_use}
                                    </span>
                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-gold-500 text-black rounded-full">
                                        {property.business_type}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-gold-500 transition-colors">
                                    {property.title}
                                </h3>

                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-foreground/5">
                                    <div className="flex gap-3 text-[11px] text-foreground/50 font-medium uppercase tracking-wider">
                                        {property.m2_terrain && (
                                            <span>{property.m2_terrain.toLocaleString()} m² T</span>
                                        )}
                                        {property.m2_construction && (
                                            <span>{property.m2_construction.toLocaleString()} m² C</span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-gold-500 font-numerics whitespace-nowrap">
                                        {formatPrice(property.price, property.currency, property.business_type)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
