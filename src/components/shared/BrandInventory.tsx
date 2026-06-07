import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { createAdminClient } from "@/lib/supabase/admin";
import { MapPin, Maximize2, ArrowRight } from "lucide-react";

interface BrandProperty {
    id: string;
    slug: string | null;
    title: string;
    property_type: string;
    business_type: string;
    price: number;
    currency: string;
    m2_construction: number | null;
    cover_image: string | null;
}

interface BrandInventoryProps {
    brandSlug: "luxury" | "business" | "industrial";
    propertyUse: "Residencial" | "Comercial" | "Industrial";
    title: string;
    highlight?: string;
    subtitle: string;
    ctaText: string;
    accentColor: "gold" | "steel";
    eyebrow?: string;
    limit?: number;
}

async function getBrandProperties(
    propertyUse: string,
    limit: number
): Promise<BrandProperty[]> {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from("properties")
            .select("id, slug, title, property_type, business_type, price, currency, m2_construction, cover_image")
            .eq("property_use", propertyUse)
            .eq("status", "Available")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.warn("[BrandInventory] Supabase returned an error", error);
            return [];
        }
        return (data as BrandProperty[]) ?? [];
    } catch (err) {
        console.warn("[BrandInventory] Failed to fetch", err);
        return [];
    }
}

const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);

/**
 * BrandInventory — server-rendered, 3-up featured properties for sub-brand
 * landings. Estilo A: sin glass cards, sin shimmer animado. Vlines doradas
 * entre cards (mismo patrón que TrackRecord).
 */
export async function BrandInventory({
    brandSlug,
    propertyUse,
    title,
    highlight,
    subtitle,
    ctaText,
    accentColor,
    eyebrow = "Inventario activo",
    limit = 3,
}: BrandInventoryProps) {
    void accentColor;
    const properties = await getBrandProperties(propertyUse, limit);

    return (
        <Section
            id={`${brandSlug}-inventory`}
            label={`Inventario ${propertyUse}`}
            spacing="default"
            containerWidth="wide"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-20">
                <div className="max-w-2xl">
                    <Eyebrow label={eyebrow} />
                    <h2 className="text-display-2 font-light text-white leading-display tracking-headline">
                        {title}
                        {highlight && (
                            <>
                                {" "}
                                <span className="metallic-gold-static">{highlight}</span>
                            </>
                        )}
                    </h2>
                </div>
                <p className="text-body-fluid-sm text-white/55 leading-relaxed font-light max-w-md sm:text-right">
                    {subtitle}
                </p>
            </div>

            {/* 3-col grid con vlines */}
            {properties.length > 0 ? (
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/[0.06]" role="list">
                    {/* Vertical vlines (desktop) */}
                    <div
                        className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />
                    <div
                        className="hidden md:block absolute top-0 bottom-0 left-2/3 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />

                    {properties.map((prop, i) => {
                        const isLeft = i % 3 === 0;
                        const isRight = i % 3 === 2;
                        return (
                            <Link
                                key={prop.id}
                                href={`/inventario/${prop.slug || prop.id}`}
                                role="listitem"
                                className={
                                    "group relative flex flex-col transition-colors duration-500 hover:bg-white/[0.015] " +
                                    (!isLeft ? "md:border-l md:border-white/[0.06] " : "")
                                }
                            >
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
                                    {prop.cover_image ? (
                                        <Image
                                            src={prop.cover_image}
                                            alt={prop.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-semibold">
                                                En preparación
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                                    {/* Type badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-background/85 backdrop-blur-md border border-[var(--color-accent)]/25 text-[10px] tracking-[0.2em] uppercase text-[var(--color-accent)] font-semibold rounded-full">
                                        {prop.property_type}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                    <h3 className="text-display-4 font-semibold text-white tracking-snug mb-4 group-hover:text-[var(--color-accent-light)] transition-colors duration-300">
                                        {prop.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-[13px] text-white/55 mb-4 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                            {prop.business_type}
                                        </span>
                                        {prop.m2_construction && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Maximize2 className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                                {prop.m2_construction.toLocaleString()} m²
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-stat-md font-light metallic-gold-static tabular-nums leading-stat mt-auto">
                                        {formatPrice(prop.price, prop.currency)}
                                    </p>
                                </div>

                                {/* Right border on last col (mobile) */}
                                {!isRight && (
                                    <div className="md:hidden absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" aria-hidden="true" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="border-t border-b border-white/[0.06] py-16 sm:py-20 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center mx-auto mb-6">
                        <span className="text-[var(--color-accent)] text-2xl" aria-hidden="true">✦</span>
                    </div>
                    <h3 className="text-display-4 font-semibold text-white/70 tracking-snug mb-3">
                        Portafolio en curación
                    </h3>
                    <p className="text-body-sm text-white/55 leading-relaxed font-light max-w-md mx-auto">
                        Nuestro equipo está seleccionando los mejores activos de {propertyUse.toLowerCase()}.
                        Solicita acceso anticipado para ser el primero en conocerlos.
                    </p>
                </div>
            )}

            {/* CTA al inventario completo */}
            <div className="mt-14 sm:mt-20 text-center">
                <Link
                    href={`/inventario?uso=${encodeURIComponent(propertyUse)}`}
                    className="btn-ghost-gold inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--color-accent)]/30 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full hover:border-[var(--color-accent)] transition-colors duration-300"
                >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            </div>
        </Section>
    );
}
