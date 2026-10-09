"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export type Accent = "gold" | "steel";

export interface SubBrandHeroProps {
    brand: string;
    backgroundImage: string;
    backgroundImageWebp?: string;
    backgroundAlt: string;
    overlayClass?: string;
    accent: Accent;
    headline: ReactNode;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    highlights?: Array<{ value: string; label: string }>;
    gridLines?: boolean;
    cursorGlow?: boolean;
    scrollIndicator?: boolean;
}

interface QuickSearchOption {
    label: string;
    value: string;
}

interface QuickSearchConfig {
    use: "Residencial" | "Comercial" | "Industrial";
    propertyLabel: string;
    propertyPlaceholder: string;
    propertyOptions: QuickSearchOption[];
    zoneLabel: string;
    zonePlaceholder: string;
    zoneOptions: QuickSearchOption[];
    areaLabel: string;
    areaOptions: QuickSearchOption[];
}

const QUICK_SEARCH_CONFIG: Record<string, QuickSearchConfig> = {
    "Black Luxury": {
        use: "Residencial",
        propertyLabel: "Tipo de propiedad",
        propertyPlaceholder: "Cualquier residencia",
        propertyOptions: [
            { label: "Casa", value: "Casa" },
            { label: "Departamento", value: "Departamento" },
            { label: "Preventa", value: "Preventa" },
        ],
        zoneLabel: "Zona residencial",
        zonePlaceholder: "Tijuana o Rosarito",
        zoneOptions: [
            { label: "Zona Río", value: "Zona Río" },
            { label: "Chapultepec", value: "Chapultepec" },
            { label: "Rosarito", value: "Rosarito" },
        ],
        areaLabel: "Construcción mínima",
        areaOptions: [
            { label: "Desde 150 m²", value: "150" },
            { label: "Desde 250 m²", value: "250" },
            { label: "Desde 350 m²", value: "350" },
        ],
    },
    "Black Business": {
        use: "Comercial",
        propertyLabel: "Formato comercial",
        propertyPlaceholder: "Cualquier formato",
        propertyOptions: [
            { label: "Local", value: "Local" },
            { label: "Oficina", value: "Oficina" },
            { label: "Plaza", value: "Plaza" },
        ],
        zoneLabel: "Zona comercial",
        zonePlaceholder: "Toda Tijuana",
        zoneOptions: [
            { label: "Zona Río", value: "Zona Río" },
            { label: "Otay", value: "Otay" },
            { label: "Díaz Ordaz", value: "Díaz Ordaz" },
        ],
        areaLabel: "Superficie mínima",
        areaOptions: [
            { label: "Desde 75 m²", value: "75" },
            { label: "Desde 150 m²", value: "150" },
            { label: "Desde 300 m²", value: "300" },
        ],
    },
    "Black Industrial": {
        use: "Industrial",
        propertyLabel: "Tipo de nave",
        propertyPlaceholder: "Cualquier nave o bodega",
        propertyOptions: [
            { label: "Nave", value: "Nave" },
            { label: "Bodega", value: "Bodega" },
            { label: "Industrial", value: "Industrial" },
        ],
        zoneLabel: "Corredor logístico",
        zonePlaceholder: "Todo corredor",
        zoneOptions: [
            { label: "Parque Industrial", value: "Parque Industrial" },
            { label: "Otay", value: "Otay" },
            { label: "Garita", value: "Garita" },
        ],
        areaLabel: "Rango de m²",
        areaOptions: [
            { label: "Desde 500 m²", value: "500" },
            { label: "Desde 1,500 m²", value: "1500" },
            { label: "Desde 3,000 m²", value: "3000" },
        ],
    },
};


export function SubBrandHero({
    brand, backgroundImage, backgroundImageWebp, backgroundAlt,
    headline, subtitle, primaryCta, secondaryCta,
}: SubBrandHeroProps) {
    const router = useRouter();
    const reduceMotion = useReducedMotion();
    const formId = useId();
    const quickSearch = QUICK_SEARCH_CONFIG[brand] ?? QUICK_SEARCH_CONFIG["Black Luxury"];
    const [searchOpen, setSearchOpen] = useState(false);
    const [propertyType, setPropertyType] = useState("");
    const [zone, setZone] = useState("");
    const [operation, setOperation] = useState("");
    const [minArea, setMinArea] = useState("");

    const quickSearchHref = useMemo(() => {
        const params = new URLSearchParams({ uso: quickSearch.use });
        if (propertyType) params.set("propiedad", propertyType);
        if (zone) params.set("zona", zone);
        if (operation) params.set("tipo", operation);
        if (minArea) params.set("m2_min", minArea);
        return `/inventario?${params.toString()}`;
    }, [minArea, operation, propertyType, quickSearch.use, zone]);

    function submitQuickSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSearchOpen(false);
        router.push(quickSearchHref);
    }

    const filter = (label: string, value: string, onChange: (value: string) => void, placeholder: string, options: QuickSearchOption[]) => (
        <label className="flex min-w-0 flex-col gap-3">
            <span className="property-tag-type text-white/60">{label}</span>
            <span className="relative">
                <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full min-w-0 appearance-none rounded-xl border border-white/20 bg-white/[0.04] px-4 pr-9 text-body-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]">
                    <option value="" className="bg-background">{placeholder}</option>
                    {options.map((option) => <option key={option.value} value={option.value} className="bg-background">{option.label}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4 text-[var(--color-accent)]" aria-hidden="true" />
            </span>
        </label>
    );

    return (
        <section aria-label={`${brand} — Presentación`} className="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-background">
            <CinematicImage src={backgroundImageWebp ?? backgroundImage} alt={backgroundAlt} priority className="!absolute inset-0" imageClassName="object-[60%_center]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.3)_0%,transparent_35%,rgba(0,0,0,.16)_55%,rgba(0,0,0,.8)_100%)]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.38),transparent_75%)]" />
            <div className="relative mx-auto w-full max-w-[100rem] px-6 pb-9 pt-48 sm:px-10 sm:pb-12 lg:px-20 lg:pb-14 lg:pt-64">
                <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                    <p className="mb-6 flex items-center gap-3 text-caption text-white/85"><span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)]" />{brand}</p>
                    <h1 className="text-display-1 max-w-[960px] text-balance text-white [text-shadow:0_2px_28px_rgba(0,0,0,.15)]">{headline}</h1>
                    <p className="mt-6 max-w-[440px] text-body text-white/80">{subtitle}</p>
                    <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link href={primaryCta.href} className="group inline-flex min-h-12 items-center gap-5 rounded-full bg-white px-6 py-3 text-body-sm font-medium text-black transition-colors hover:bg-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                            {primaryCta.label}<ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                            <DialogTrigger asChild>
                                <button type="button" className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/45 bg-black/10 px-5 text-body-sm text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><Search className="size-4" aria-hidden="true" />Buscar</button>
                            </DialogTrigger>
                            <DialogContent showCloseButton={false} className="max-h-[90svh] overflow-y-auto rounded-3xl border-white/15 bg-[#10100f] p-6 text-white motion-reduce:animate-none sm:max-w-2xl sm:p-10">
                                <DialogClose className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10" aria-label="Cerrar búsqueda"><X className="size-4" /></DialogClose>
                                <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                                    <p className="mb-5 text-caption gold-ink">{brand}</p>
                                    <DialogTitle className="pr-6 text-display-3 text-white">Encuentra tu próximo espacio.</DialogTitle>
                                    <DialogDescription className="mt-3 text-body-sm text-white/60">Elige tus criterios y explora el inventario.</DialogDescription>
                                    <form id={formId} onSubmit={submitQuickSearch} aria-label="Búsqueda rápida de inventario" className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2">
                                        {filter(quickSearch.propertyLabel, propertyType, setPropertyType, quickSearch.propertyPlaceholder, quickSearch.propertyOptions)}
                                        {filter(quickSearch.zoneLabel, zone, setZone, quickSearch.zonePlaceholder, quickSearch.zoneOptions)}
                                        {filter("Tipo", operation, setOperation, "Venta o renta", [{ label: "Venta", value: "Venta" }, { label: "Renta", value: "Renta" }])}
                                        {filter(quickSearch.areaLabel, minArea, setMinArea, "Sin mínimo", quickSearch.areaOptions)}
                                        <button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[var(--color-accent)] px-6 text-body-sm font-medium text-black sm:col-span-2">Ver resultados<ArrowUpRight className="size-4" aria-hidden="true" /></button>
                                    </form>
                                </motion.div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>
                <div className="mt-14 flex items-end justify-between gap-4 border-t border-white/25 pt-5 sm:mt-20">
                    <p className="property-tag-type text-white/65">Baja California, México</p>
                    {secondaryCta && <Link href={secondaryCta.href} className="group flex shrink-0 items-center gap-3 text-body-sm text-white/85 hover:text-white"><span className="hidden sm:inline">{secondaryCta.label}</span><span className="flex size-10 items-center justify-center rounded-full border border-white/35"><ArrowDown className="size-4 transition-transform motion-safe:group-hover:translate-y-1" aria-hidden="true" /></span><span className="sr-only sm:hidden">{secondaryCta.label}</span></Link>}
                </div>
            </div>
        </section>
    );
}
