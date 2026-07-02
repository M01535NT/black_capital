"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ArrowUpDown, Search, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { USES, BUSINESS_TYPES, BRAND_TO_USE } from "@/lib/property-constants";

const SORT_OPTIONS = [
    { label: "Más recientes", value: "newest" },
    { label: "Menor precio", value: "price_asc" },
    { label: "Mayor precio", value: "price_desc" },
    { label: "Mayor terreno", value: "terrain_desc" },
    { label: "Mayor construcción", value: "construction_desc" },
    { label: "Destacadas primero", value: "featured" },
];

const STATUS_OPTIONS = [
    { label: "Disponible", value: "Available" },
    { label: "Bajo oferta", value: "Under_Offer" },
    { label: "Vendido", value: "Sold" },
    { label: "Rentado", value: "Rented" },
];

const CURRENCY_OPTIONS = ["MXN", "USD"];

type Property = PropertyCardData;

export function CatalogFilter({ properties }: { properties: Property[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const shouldReduceMotion = useReducedMotion();

    const brandUse = searchParams.get("brand") ? BRAND_TO_USE[searchParams.get("brand") as string] : null;
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [activePropertyType, setActivePropertyType] = useState<string | null>(searchParams.get("propiedad") || null);
    const [activeZone, setActiveZone] = useState<string | null>(searchParams.get("zona") || null);
    const [activeBusiness, setActiveBusiness] = useState<string | null>(searchParams.get("tipo") || null);
    const [activeUse, setActiveUse] = useState<string | null>(searchParams.get("uso") || brandUse || null);
    const [sort, setSort] = useState(searchParams.get("orden") || "newest");
    const [activeStatus, setActiveStatus] = useState<string | null>(searchParams.get("estatus") || null);
    const [activeCurrency, setActiveCurrency] = useState<string | null>(searchParams.get("moneda") || null);
    const [minPrice, setMinPrice] = useState(searchParams.get("precio_min") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("precio_max") || "");
    const [minArea, setMinArea] = useState(searchParams.get("m2_min") || "");

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
        const currentPropertyType = params.propiedad !== undefined ? params.propiedad : activePropertyType;
        const currentZone = params.zona !== undefined ? params.zona : activeZone;
        const currentBusiness = params.tipo !== undefined ? params.tipo : activeBusiness;
        const currentUse = params.uso !== undefined ? params.uso : activeUse;
        const currentSort = params.orden !== undefined ? params.orden : sort;
        const currentStatus = params.estatus !== undefined ? params.estatus : activeStatus;
        const currentCurrency = params.moneda !== undefined ? params.moneda : activeCurrency;
        const currentMinPrice = params.precio_min !== undefined ? params.precio_min : minPrice;
        const currentMaxPrice = params.precio_max !== undefined ? params.precio_max : maxPrice;
        const currentMinArea = params.m2_min !== undefined ? params.m2_min : minArea;

        if (currentSearch) sp.set("q", currentSearch);
        if (currentPropertyType) sp.set("propiedad", currentPropertyType);
        if (currentZone) sp.set("zona", currentZone);
        if (currentBusiness) sp.set("tipo", currentBusiness);
        if (currentUse) sp.set("uso", currentUse);
        if (currentStatus) sp.set("estatus", currentStatus);
        if (currentCurrency) sp.set("moneda", currentCurrency);
        if (currentMinPrice) sp.set("precio_min", currentMinPrice);
        if (currentMaxPrice) sp.set("precio_max", currentMaxPrice);
        if (currentMinArea) sp.set("m2_min", currentMinArea);
        if (currentSort && currentSort !== "newest") sp.set("orden", currentSort);

        const qs = sp.toString();
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, [searchTerm, activePropertyType, activeZone, activeBusiness, activeUse, activeStatus, activeCurrency, minPrice, maxPrice, minArea, sort, router, pathname]);

    const filtered = useMemo(() => {
        const result = properties.filter((p) => {
            const searchable = `${p.title} ${p.address ?? ""} ${p.property_use} ${p.property_type ?? ""} ${p.business_type}`.toLowerCase();
            const matchSearch = searchable.includes(searchTerm.toLowerCase());
            const matchPropertyType = activePropertyType ? (p.property_type ?? "").toLowerCase().includes(activePropertyType.toLowerCase()) : true;
            const matchZone = activeZone ? searchable.includes(activeZone.toLowerCase()) : true;
            const matchBusiness = activeBusiness ? p.business_type.toLowerCase() === activeBusiness.toLowerCase() : true;
            const matchUse = activeUse ? p.property_use === activeUse : true;
            const matchStatus = activeStatus ? p.status === activeStatus : true;
            const matchCurrency = activeCurrency ? p.currency === activeCurrency : true;
            const matchMinPrice = minPrice ? p.price >= Number(minPrice) : true;
            const matchMaxPrice = maxPrice ? p.price <= Number(maxPrice) : true;
            const area = Math.max(p.m2_terrain || 0, p.m2_construction || 0);
            const matchMinArea = minArea ? area >= Number(minArea) : true;
            return matchSearch && matchPropertyType && matchZone && matchBusiness && matchUse && matchStatus && matchCurrency && matchMinPrice && matchMaxPrice && matchMinArea;
        });

        if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
        else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
        else if (sort === "terrain_desc") result.sort((a, b) => (b.m2_terrain || 0) - (a.m2_terrain || 0));
        else if (sort === "construction_desc") result.sort((a, b) => (b.m2_construction || 0) - (a.m2_construction || 0));
        else if (sort === "featured") result.sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)));

        return result;
    }, [properties, searchTerm, activePropertyType, activeZone, activeBusiness, activeUse, activeStatus, activeCurrency, minPrice, maxPrice, minArea, sort]);

    const clearAll = () => {
        setSearchTerm("");
        setActivePropertyType(null);
        setActiveZone(null);
        setActiveBusiness(null);
        setActiveUse(null);
        setActiveStatus(null);
        setActiveCurrency(null);
        setMinPrice("");
        setMaxPrice("");
        setMinArea("");
        setSort("newest");
        router.replace(pathname, { scroll: false });
        searchInputRef.current?.focus();
    };

    const hasFilters = activeBusiness || activeUse || activeStatus || activeCurrency || activePropertyType || activeZone || searchTerm || minPrice || maxPrice || minArea || sort !== "newest";
    const pillBase = "flex min-h-10 w-full items-center justify-center px-2 property-tag-type transition-colors sm:px-4";
    const pillActive = "gold-gradient text-black";
    const pillInactive = "border border-white/[0.08] bg-white/[0.025] text-white/62 hover:border-white/20 hover:text-white";

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
                            className="h-12 w-full border border-white/[0.08] bg-background/70 pl-11 pr-11 text-body-sm text-white outline-none placeholder:text-white/35 transition-colors focus:border-[var(--color-accent)]"
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
                        <div className="text-body-sm text-white/55">
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
                                className="h-11 w-full appearance-none rounded-full border border-white/[0.08] bg-background/70 pl-4 pr-10 property-tag-type text-white/70 outline-none transition-colors focus:border-[var(--color-accent)] sm:w-auto"
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
                                className="group inline-flex min-h-11 items-center gap-2 px-1 property-tag-type text-white/70 transition-colors hover:text-[var(--color-accent)]"
                            >
                                <span className="relative pb-1">
                                    Limpiar
                                    <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                                </span>
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
                            aria-pressed={!activeBusiness}
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
                                aria-pressed={activeBusiness === bt}
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
                                aria-pressed={activeUse === use}
                                className={`${pillBase} ${activeUse === use ? pillActive : pillInactive}`}
                            >
                                {use}
                            </button>
                        ))}
                    </div>
                </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:col-span-5">
                                <button
                            type="button"
                            onClick={() => {
                                setActiveStatus(null);
                                updateURL({ estatus: null });
                            }}
                            aria-pressed={!activeStatus}
                            className={`${pillBase} ${!activeStatus ? pillActive : pillInactive}`}
                        >
                            Todos
                        </button>
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() => {
                                    const next = activeStatus === status.value ? null : status.value;
                                    setActiveStatus(next);
                                    updateURL({ estatus: next });
                                }}
                                aria-pressed={activeStatus === status.value}
                                className={`${pillBase} ${activeStatus === status.value ? pillActive : pillInactive}`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 lg:col-span-2">
                        {CURRENCY_OPTIONS.map((currency) => (
                            <button
                                key={currency}
                                type="button"
                                onClick={() => {
                                    const next = activeCurrency === currency ? null : currency;
                                    setActiveCurrency(next);
                                    updateURL({ moneda: next });
                                }}
                                aria-pressed={activeCurrency === currency}
                                className={`${pillBase} ${activeCurrency === currency ? pillActive : pillInactive}`}
                            >
                                {currency}
                            </button>
                        ))}
                    </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:col-span-5">
                            <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="Precio mínimo"
                            aria-label="Precio mínimo"
                            value={minPrice}
                            onChange={(e) => {
                                setMinPrice(e.target.value);
                                updateURL({ precio_min: e.target.value || null });
                            }}
                            className="h-11 w-full border border-white/[0.08] bg-background/70 px-4 text-body-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)]"
                        />
                        <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="Precio máximo"
                            aria-label="Precio máximo"
                            value={maxPrice}
                            onChange={(e) => {
                                setMaxPrice(e.target.value);
                                updateURL({ precio_max: e.target.value || null });
                            }}
                        className="h-11 w-full border border-white/[0.08] bg-background/70 px-4 text-body-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)]"
                    />
                        <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="m² mínimo"
                            aria-label="Metros cuadrados mínimos"
                            value={minArea}
                            onChange={(e) => {
                                setMinArea(e.target.value);
                                updateURL({ m2_min: e.target.value || null });
                            }}
                        className="h-11 w-full border border-white/[0.08] bg-background/70 px-4 text-body-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)]"
                    />
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center"
                >
                    <div className="gold-gradient mx-auto mb-5 flex size-16 items-center justify-center rounded-full text-black">
                        <Search className="size-6" aria-hidden="true" />
                    </div>
                    <h2 className="mb-3 text-display-4 text-white">
                        No encontramos coincidencias
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-body text-white/58">
                        Ajusta los filtros o comparte tu búsqueda con un asesor para preparar opciones similares.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={clearAll}
                            className="group inline-flex min-h-11 items-center justify-center gap-2 px-2 text-white/80 transition-colors hover:text-[var(--color-accent)]"
                        >
                            <span className="property-tag-type relative pb-1">
                                Limpiar filtros
                                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                            </span>
                        </button>
                        <Link
                            href={`/contacto?interes=inventario${searchTerm ? `&busqueda=${encodeURIComponent(searchTerm)}` : ""}`}
                            className="brushed-gold premium-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6"
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
