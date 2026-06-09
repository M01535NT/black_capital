"use client";

import Image from "next/image";
import Link from "next/link";
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
    headline: React.ReactNode;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    highlights?: Array<{ value: string; label: string }>;
    gridLines?: boolean;
    cursorGlow?: boolean;
    scrollIndicator?: boolean;
}

const SEARCH_FIELDS: Record<string, string[]> = {
    "Black Luxury": ["Tipo de propiedad", "Zona residencial", "Presupuesto", "Amenidades"],
    "Black Business": ["Formato comercial", "Zona de operación", "Tipo de operación", "Superficie"],
    "Black Industrial": ["Tipo de nave", "Corredor logístico", "Rango de m²", "Uso operativo"],
};

export function SubBrandHero({
    brand,
    backgroundImage,
    backgroundImageWebp,
    backgroundAlt,
    headline,
    subtitle,
    primaryCta,
    secondaryCta,
}: SubBrandHeroProps) {
    const fields = SEARCH_FIELDS[brand] ?? SEARCH_FIELDS["Black Luxury"];

    return (
        <section
            aria-label={`${brand} — Presentación`}
            className="relative min-h-[92svh] overflow-hidden border-b border-white/[0.06] pt-24 lg:pt-28"
        >
            {backgroundImageWebp ? (
                <picture>
                    <source srcSet={backgroundImageWebp} type="image/webp" />
                    <Image
                        src={backgroundImage}
                        alt={backgroundAlt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover opacity-35"
                    />
                </picture>
            ) : (
                <Image
                    src={backgroundImage}
                    alt={backgroundAlt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-35"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

            <div className="relative z-10 mx-auto grid min-h-[calc(92svh-6rem)] max-w-[90rem] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-12 lg:px-16">
                <div className="lg:col-span-7">
                    <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 text-caption text-white/70">
                        <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                        Tijuana, Baja California
                    </div>
                    <p className="mb-3 text-caption gold-ink">
                        {brand}
                    </p>
                    <h1 className="max-w-4xl text-display-1 text-white text-balance">
                        {headline}
                    </h1>
                    <p className="mt-6 max-w-2xl text-body leading-relaxed text-white/72">
                        {subtitle}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href={primaryCta.href} className="w-full sm:w-auto">
                            <Button className="brushed-gold premium-cta inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full sm:w-auto">
                                {primaryCta.label}
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </Link>
                        {secondaryCta && (
                            <Link
                                href={secondaryCta.href}
                                className="premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-7 text-white transition-colors hover:border-[var(--color-accent)]"
                            >
                                {secondaryCta.label}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="border border-white/10 bg-background/82 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                            <div className="gold-gradient flex h-10 w-10 items-center justify-center rounded-full text-black">
                                <Search className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-body-sm text-white">Búsqueda rápida</p>
                                <p className="text-body-sm text-white/50">Ejemplo editable desde admin</p>
                            </div>
                        </div>
                        <div className="grid gap-3 py-4">
                            {fields.map((label) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                                >
                                    <span className="text-body-sm text-white/65">{label}</span>
                                    <span className="property-tag-type gold-ink">
                                        Seleccionar
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Link
                            href={primaryCta.href}
                            className="gold-gradient premium-cta inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-black"
                        >
                            Buscar opciones
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
