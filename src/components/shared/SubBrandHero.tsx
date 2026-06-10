"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
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
        zonePlaceholder: "Toda Tijuana",
        zoneOptions: [
            { label: "Zona Río", value: "Zona Río" },
            { label: "Chapultepec", value: "Chapultepec" },
            { label: "Playas", value: "Playas" },
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
        zoneLabel: "Zona de operación",
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
        propertyPlaceholder: "Cualquier activo",
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
            staggerChildren: 0.11,
            delayChildren: 0.1,
        },
    },
};

const heroChild: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.72, ease: EASE },
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
    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
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

    const selectClassName = "h-11 w-full appearance-none border border-white/[0.08] bg-white/[0.035] px-3 property-tag-type text-white outline-none transition-colors focus:border-[var(--color-accent)]";

    const quickSearchForm = (className: string) => (
        <motion.form
            onSubmit={submitQuickSearch}
            className={className}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 32, clipPath: "inset(8% 0% 0% 0%)" }}
            whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
            transition={{ duration: 0.82, delay: 0.24, ease: EASE }}
        >
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3 lg:pb-4">
                <div className="gold-gradient flex h-10 w-10 items-center justify-center rounded-full text-black">
                    <Search className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-body-sm text-white">Búsqueda rápida</p>
                    <p className="text-body-sm text-white/50">Filtra opciones</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2 lg:grid-cols-1 lg:py-4">
                <label className="grid gap-2">
                    <span className="text-body-sm text-white/65">{quickSearch.propertyLabel}</span>
                    <select
                        value={propertyType}
                        onChange={(event) => setPropertyType(event.target.value)}
                        className={selectClassName}
                    >
                        <option value="" className="bg-background text-white">{quickSearch.propertyPlaceholder}</option>
                        {quickSearch.propertyOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-background text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-2">
                    <span className="text-body-sm text-white/65">{quickSearch.zoneLabel}</span>
                    <select
                        value={zone}
                        onChange={(event) => setZone(event.target.value)}
                        className={selectClassName}
                    >
                        <option value="" className="bg-background text-white">{quickSearch.zonePlaceholder}</option>
                        {quickSearch.zoneOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-background text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-2">
                    <span className="text-body-sm text-white/65">Tipo de operación</span>
                    <select
                        value={operation}
                        onChange={(event) => setOperation(event.target.value)}
                        className={selectClassName}
                    >
                        <option value="" className="bg-background text-white">Venta y renta</option>
                        <option value="Venta" className="bg-background text-white">Venta</option>
                        <option value="Renta" className="bg-background text-white">Renta</option>
                    </select>
                </label>

                <label className="grid gap-2">
                    <span className="text-body-sm text-white/65">{quickSearch.areaLabel}</span>
                    <select
                        value={minArea}
                        onChange={(event) => setMinArea(event.target.value)}
                        className={selectClassName}
                    >
                        <option value="" className="bg-background text-white">Sin mínimo</option>
                        {quickSearch.areaOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-background text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <Button
                type="submit"
                className="gold-gradient premium-cta inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-none px-5 py-3 text-black hover:opacity-95"
            >
                Buscar opciones
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
        </motion.form>
    );

    return (
        <section
            ref={sectionRef}
            aria-label={`${brand} — Presentación`}
            className="relative overflow-hidden border-b border-white/[0.06] bg-background"
        >
            <div className="relative min-h-[94svh] overflow-hidden pt-20 lg:min-h-[100svh] lg:pt-28">
                <motion.div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-[4%] bottom-[-10%]"
                    style={shouldReduceMotion ? undefined : { y: imageY }}
                    initial={shouldReduceMotion ? false : { scale: 1.03 }}
                    animate={shouldReduceMotion ? undefined : { scale: 1.09 }}
                    transition={{ duration: 16, ease: "easeOut" }}
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
                                className="object-cover opacity-40"
                            />
                        </picture>
                    ) : (
                        <Image
                            src={backgroundImage}
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover opacity-40"
                        />
                    )}
                </motion.div>
                <span className="sr-only">{backgroundAlt}</span>
                <div className={`absolute inset-0 bg-gradient-to-r ${overlayClass ?? "from-background via-background/88 to-background/35"}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
                {cursorGlow && (
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 mix-blend-screen opacity-20"
                        style={{
                            background:
                                "radial-gradient(ellipse at 82% 18%, rgba(210, 167, 60, 0.42), transparent 55%)",
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

            <div className="relative z-10 mx-auto grid min-h-[calc(94svh-5rem)] max-w-[90rem] grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-12">
                <motion.div
                    className="lg:col-span-7"
                    variants={heroGroup}
                    initial={shouldReduceMotion ? false : "hidden"}
                    animate="show"
                >
                    <motion.div variants={heroChild} className="mb-4 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 text-caption text-white/70 lg:mb-6">
                        <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                        Tijuana, Baja California
                    </motion.div>
                    <motion.p variants={heroChild} className="mb-3 text-caption gold-ink">
                        {brand}
                    </motion.p>
                    <motion.h1 variants={heroChild} className="max-w-4xl text-display-1 text-white text-balance">
                        {headline}
                    </motion.h1>
                    <motion.span
                        aria-hidden="true"
                        variants={{
                            hidden: { scaleX: 0 },
                            show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
                        }}
                        className="mt-5 block h-px w-40 origin-left bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-gold-light)] to-transparent"
                    />
                    <motion.p variants={heroChild} className="mt-4 max-w-2xl text-body leading-relaxed text-white/72 lg:mt-6">
                        {subtitle}
                    </motion.p>

                    {highlights && highlights.length > 0 && (
                        <motion.dl variants={heroChild} className="mt-6 grid max-w-2xl grid-cols-3 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.06] sm:flex sm:w-fit">
                            {highlights.map((item) => (
                                <div key={`${item.value}-${item.label}`} className="min-w-0 bg-background/70 px-3 py-3 sm:min-w-32 sm:px-4">
                                    <dt className="property-tag-type text-white/48">{item.label}</dt>
                                    <dd className="mt-1 text-display-4 leading-tight text-white">{item.value}</dd>
                                </div>
                            ))}
                        </motion.dl>
                    )}

                    <motion.div variants={heroChild} className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8">
                        <Link href={primaryCta.href} className="w-full sm:w-auto">
                            <Button className="brushed-gold premium-cta inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-none sm:w-auto">
                                {primaryCta.label}
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </Link>
                        {secondaryCta && (
                            <Link
                                href={secondaryCta.href}
                                className="group inline-flex min-h-[50px] w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
                            >
                                <span className="property-tag-type relative pb-1">
                                    {secondaryCta.label}
                                    <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        )}
                    </motion.div>
                </motion.div>

                <div className="hidden lg:col-span-5 lg:block">
                    {quickSearchForm("border border-white/10 bg-background/82 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl")}
                </div>
            </div>
            </div>

            <div className="relative z-10 border-t border-white/[0.06] bg-background px-6 pb-10 pt-6 sm:px-10 lg:hidden">
                <div className="mx-auto max-w-xl">
                    {quickSearchForm("border border-white/10 bg-background/90 p-4 shadow-2xl shadow-black/40")}
                </div>
            </div>
        </section>
    );
}
