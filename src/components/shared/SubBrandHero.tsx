"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const EASE = [0.22, 1, 0.36, 1] as const;

const heroGroup: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.12,
        },
    },
};

const heroChild: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.78, ease: EASE },
    },
};

const headlineReveal: Variants = {
    hidden: { opacity: 0, y: 34, clipPath: "inset(0% 0% 100% 0%)" },
    show: {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.95, ease: EASE },
    },
};

export function SubBrandHero({
    brand,
    backgroundImage,
    backgroundImageWebp,
    backgroundAlt,
    overlayClass,
    headline,
    subtitle,
    primaryCta,
    secondaryCta,
    highlights,
    gridLines = false,
    cursorGlow = true,
}: SubBrandHeroProps) {
    const router = useRouter();
    const sectionRef = useRef<HTMLElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const overlayFade = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
    const quickSearch = QUICK_SEARCH_CONFIG[brand] ?? QUICK_SEARCH_CONFIG["Black Luxury"];
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

    const submitQuickSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push(quickSearchHref);
    };

    /* Una sola celda de filtro: label arriba, select sin chrome, chevron dorado. */
    const filterCell = (
        label: string,
        value: string,
        onChange: (value: string) => void,
        placeholder: string,
        options: QuickSearchOption[],
    ) => (
        <label className="group/cell relative flex flex-col gap-1.5 px-5 py-4 transition-colors duration-300 hover:bg-white/[0.03]">
            <span className="property-tag-type text-white/45 transition-colors duration-300 group-focus-within/cell:text-[var(--color-accent)]">
                {label}
            </span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full cursor-pointer appearance-none border-0 bg-transparent pr-7 text-body-sm font-medium text-white outline-none"
                >
                    <option value="" className="bg-background text-white">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-background text-white">
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent)]/70"
                    aria-hidden="true"
                />
            </div>
        </label>
    );

    const quickSearchForm = (
        <form
            onSubmit={submitQuickSearch}
            aria-label="Búsqueda rápida de inventario"
            className="glass overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/50"
        >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-3.5">
                <span className="gold-gradient flex h-8 w-8 items-center justify-center rounded-full text-black">
                    <Search className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="property-tag-type text-white/70">Búsqueda rápida</p>
                <span className="ml-auto hidden text-body-sm text-white/40 sm:block">
                    Filtra el inventario en segundos
                </span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-white/[0.08] sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] xl:items-stretch">
                <div className="sm:border-r sm:border-white/[0.08]">
                    {filterCell(
                        quickSearch.propertyLabel,
                        propertyType,
                        setPropertyType,
                        quickSearch.propertyPlaceholder,
                        quickSearch.propertyOptions,
                    )}
                </div>
                <div className="border-t border-white/[0.08] sm:border-t-0 xl:border-r xl:border-white/[0.08]">
                    {filterCell(
                        quickSearch.zoneLabel,
                        zone,
                        setZone,
                        quickSearch.zonePlaceholder,
                        quickSearch.zoneOptions,
                    )}
                </div>
                <div className="border-t border-white/[0.08] sm:border-r sm:border-white/[0.08] xl:border-t-0">
                    {filterCell(
                        "Tipo",
                        operation,
                        setOperation,
                        "Venta o renta",
                        [
                            { label: "Venta", value: "Venta" },
                            { label: "Renta", value: "Renta" },
                        ],
                    )}
                </div>
                <div className="border-t border-white/[0.08] sm:border-t-0 xl:border-r xl:border-white/[0.08]">
                    {filterCell(
                        quickSearch.areaLabel,
                        minArea,
                        setMinArea,
                        "Sin mínimo",
                        quickSearch.areaOptions,
                    )}
                </div>
                <Button
                    type="submit"
                    className="brushed-gold premium-cta group/btn col-span-full inline-flex min-h-14 items-center justify-center gap-2 rounded-none xl:col-span-1 xl:h-full xl:min-h-0 xl:px-7"
                >
                    Buscar
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover/btn:translate-x-1" aria-hidden="true" />
                </Button>
            </div>
        </form>
    );

    return (
        <section
            ref={sectionRef}
            aria-label={`${brand} — Presentación`}
            className="relative overflow-hidden border-b border-white/[0.06] bg-background"
        >
            <div className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 lg:pt-28">
                {/* ── Fondo cinematográfico ── */}
                <motion.div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-[4%] bottom-[-10%]"
                    style={shouldReduceMotion ? undefined : { y: imageY }}
                    initial={shouldReduceMotion ? false : { scale: 1.05 }}
                    animate={shouldReduceMotion ? undefined : { scale: 1.12 }}
                    transition={{ duration: 18, ease: "easeOut" }}
                >
                    {backgroundImageWebp ? (
                        <picture>
                            <source srcSet={backgroundImageWebp} type="image/webp" />
                            <Image
                                src={backgroundImage}
                                alt=""
                                fill
                                priority
                                sizes="100vw"
                                className="object-cover opacity-[0.55]"
                            />
                        </picture>
                    ) : (
                        <Image
                            src={backgroundImage}
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover opacity-[0.55]"
                        />
                    )}
                </motion.div>
                <span className="sr-only">{backgroundAlt}</span>

                {/* ── Overlays multi-stop para legibilidad + profundidad ── */}
                <motion.div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-r ${overlayClass ?? "from-background via-background/80 to-background/25"}`}
                    style={shouldReduceMotion ? undefined : { opacity: overlayFade }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/45" />
                <div className="grain-overlay opacity-[0.1]" aria-hidden="true" />
                {cursorGlow && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 mix-blend-screen opacity-25"
                        style={{
                            background:
                                "radial-gradient(ellipse at 80% 16%, rgba(210, 167, 60, 0.45), transparent 56%)",
                        }}
                    />
                )}
                {gridLines && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.24) 1px, transparent 1px)",
                            backgroundSize: "96px 96px",
                        }}
                    />
                )}

                {/* ── Rail vertical editorial (desktop) ── */}
                <div
                    aria-hidden="true"
                    className="absolute left-6 top-0 z-10 hidden h-full flex-col items-center justify-center gap-6 lg:flex"
                >
                    <span className="h-20 w-px bg-gradient-to-b from-transparent to-[var(--color-accent)]/55" />
                    <span className="property-tag-type [writing-mode:vertical-rl] rotate-180 text-white/55" style={{ letterSpacing: "0.3em" }}>
                        {brand}
                    </span>
                    <span className="h-20 w-px bg-gradient-to-t from-transparent to-[var(--color-accent)]/55" />
                </div>

                {/* ── Contenido ── */}
                <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-20">
                    <motion.div
                        className="max-w-4xl"
                        variants={heroGroup}
                        initial={shouldReduceMotion ? false : "hidden"}
                        animate="show"
                    >
                        <motion.div variants={heroChild} className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-[var(--color-accent)]/70" aria-hidden="true" />
                            <p className="text-caption gold-ink">{brand}</p>
                        </motion.div>

                        <motion.h1 variants={headlineReveal} className="text-display-1 text-balance text-white">
                            {headline}
                        </motion.h1>

                        <motion.span
                            aria-hidden="true"
                            variants={{
                                hidden: { scaleX: 0 },
                                show: { scaleX: 1, transition: { duration: 1, ease: EASE } },
                            }}
                            className="mt-6 block h-px w-44 origin-left bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-gold-light)] to-transparent"
                        />

                        <motion.p variants={heroChild} className="mt-5 max-w-2xl text-body-lg leading-relaxed text-white/75">
                            {subtitle}
                        </motion.p>

                        {highlights && highlights.length > 0 && (
                            <motion.dl
                                variants={heroChild}
                                className="mt-8 grid max-w-2xl grid-cols-3 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.06] sm:flex sm:w-fit"
                            >
                                {highlights.map((item) => (
                                    <div key={`${item.value}-${item.label}`} className="min-w-0 bg-background/70 px-3 py-3 sm:min-w-32 sm:px-5">
                                        <dt className="property-tag-type text-white/48">{item.label}</dt>
                                        <dd className="mt-1 text-display-4 leading-tight text-white">{item.value}</dd>
                                    </div>
                                ))}
                            </motion.dl>
                        )}

                        <motion.div variants={heroChild} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link href={primaryCta.href} className="w-full sm:w-auto">
                                <Button className="brushed-gold premium-cta group/cta inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-none sm:w-auto">
                                    {primaryCta.label}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover/cta:translate-x-1" aria-hidden="true" />
                                </Button>
                            </Link>
                            {secondaryCta && (
                                <Link
                                    href={secondaryCta.href}
                                    className="group inline-flex min-h-[52px] w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)] sm:ml-2"
                                >
                                    <span className="property-tag-type relative pb-1">
                                        {secondaryCta.label}
                                        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current opacity-70 transition-transform duration-500 group-hover:scale-x-100" />
                                    </span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Barra de búsqueda anclada al pie del hero ── */}
                <div className="relative z-10 mx-auto w-full max-w-[90rem] px-6 pb-10 sm:px-10 lg:px-20">
                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.55, ease: EASE }}
                    >
                        {quickSearchForm}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
