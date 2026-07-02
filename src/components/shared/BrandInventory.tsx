import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArrowRight, MapPin, Maximize2 } from "lucide-react";
import { getPropertyPlaceholderImage } from "@/lib/property-placeholder-image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

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
    isPlaceholder?: boolean;
    priceLabel?: string;
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
    useLiveData?: boolean;
}

async function getBrandProperties(propertyUse: string, limit: number): Promise<BrandProperty[]> {
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

const PLACEHOLDER_PROPERTIES: Record<BrandInventoryProps["propertyUse"], BrandProperty[]> = {
    Residencial: [
        {
            id: "placeholder-residencial-1",
            slug: null,
            title: "Casa en fraccionamiento privado",
            property_type: "Residencial",
            business_type: "Zona residencial",
            price: 0,
            currency: "USD",
            m2_construction: 320,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Precio bajo consulta",
        },
        {
            id: "placeholder-residencial-2",
            slug: null,
            title: "Residencia familiar con amenidades",
            property_type: "Residencial",
            business_type: "Zona residencial",
            price: 0,
            currency: "USD",
            m2_construction: 260,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Asesoría por zona",
        },
        {
            id: "placeholder-residencial-3",
            slug: null,
            title: "Preventa residencial seleccionada",
            property_type: "Preventa",
            business_type: "Entrega programada",
            price: 0,
            currency: "USD",
            m2_construction: 210,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Disponibilidad a confirmar",
        },
    ],
    Comercial: [
        {
            id: "placeholder-comercial-1",
            slug: null,
            title: "Local comercial en zona de alto flujo",
            property_type: "Local",
            business_type: "Renta / venta",
            price: 0,
            currency: "USD",
            m2_construction: 140,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Precio bajo consulta",
        },
        {
            id: "placeholder-comercial-2",
            slug: null,
            title: "Oficina ejecutiva lista para uso",
            property_type: "Oficina",
            business_type: "Corporativo",
            price: 0,
            currency: "USD",
            m2_construction: 180,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Asesoría por zona",
        },
        {
            id: "placeholder-comercial-3",
            slug: null,
            title: "Espacio en plaza comercial",
            property_type: "Plaza",
            business_type: "Alto tráfico",
            price: 0,
            currency: "USD",
            m2_construction: 95,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Disponibilidad a confirmar",
        },
    ],
    Industrial: [
        {
            id: "placeholder-industrial-1",
            slug: null,
            title: "Nave industrial clase A",
            property_type: "Nave",
            business_type: "Logística",
            price: 0,
            currency: "USD",
            m2_construction: 2500,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Precio bajo consulta",
        },
        {
            id: "placeholder-industrial-2",
            slug: null,
            title: "Bodega con patio de maniobra",
            property_type: "Bodega",
            business_type: "Almacenaje",
            price: 0,
            currency: "USD",
            m2_construction: 1800,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Asesoría por zona",
        },
        {
            id: "placeholder-industrial-3",
            slug: null,
            title: "Espacio logístico en corredor industrial",
            property_type: "Industrial",
            business_type: "Exportación",
            price: 0,
            currency: "USD",
            m2_construction: 4200,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Disponibilidad a confirmar",
        },
    ],
};

export async function BrandInventory({
    brandSlug,
    propertyUse,
    title,
    highlight,
    subtitle,
    ctaText,
    eyebrow = "Inventario seleccionado",
    limit = 3,
    useLiveData = false,
}: BrandInventoryProps) {
    const properties = useLiveData ? await getBrandProperties(propertyUse, limit) : [];
    const displayProperties = properties.length > 0
        ? properties
        : PLACEHOLDER_PROPERTIES[propertyUse].slice(0, limit);

    return (
        <section
            id={`${brandSlug}-inventory`}
            aria-label={`Inventario ${propertyUse}`}
            className="w-full mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
        >
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                    <p className="mb-3 text-caption gold-ink">
                        {eyebrow}
                    </p>
                    <h2 className="text-display-2 leading-display tracking-headline text-white">
                        {title}
                        {highlight && <> <span className="metallic-gold-static">{highlight}</span></>}
                    </h2>
                </div>
                <p className="max-w-xl text-body text-white/58 sm:text-right">
                    {subtitle}
                </p>
            </div>

            <div
                data-section="brand-inventory-rail"
                className={`scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0 ${
                    displayProperties.length === 1
                        ? "lg:grid-cols-1"
                        : displayProperties.length === 2
                        ? "lg:grid-cols-2"
                        : "lg:grid-cols-3"
                }`}
            >
                {displayProperties.map((prop, index) => {
                    const href = prop.isPlaceholder
                        ? `/contacto?interes=${encodeURIComponent(propertyUse)}`
                        : `/inventario/${prop.slug || prop.id}`;
                    const hasCoverImage = Boolean(prop.cover_image);
                    const fallbackImage = getPropertyPlaceholderImage(propertyUse);
                    const imageSrc = prop.cover_image || fallbackImage.src;
                    const imageAlt = hasCoverImage ? prop.title : fallbackImage.alt;

                    return (
                        <ScrollReveal
                            key={prop.id}
                            delay={index * 0.08}
                            className="min-w-[82vw] snap-center sm:min-w-[62vw] lg:min-w-0"
                        >
                            <article className="group relative flex h-full flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025] transition-colors duration-500 hover:border-[var(--color-accent)]/35">
                                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.02]">
                                    <Image
                                        src={imageSrc}
                                        alt={imageAlt}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        className="object-cover motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-out motion-safe:group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/22 to-transparent transition-opacity duration-700 group-hover:opacity-88" />
                                    <div className="grain-overlay opacity-[0.12]" aria-hidden="true" />
                                    <div className="absolute left-4 top-4 border border-[var(--color-accent)]/30 bg-background/85 px-3 py-1 property-tag-type gold-ink">
                                        {prop.property_type}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="mb-4 h-px w-12 bg-[var(--color-accent)]/50 transition-all duration-700 group-hover:w-24" />
                                        <h3 className="text-display-3 text-white">{prop.title}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col space-y-5 p-5">
                                    <div className="flex flex-wrap gap-4 text-body-sm text-white/55">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                            {prop.business_type}
                                        </span>
                                        {prop.m2_construction && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Maximize2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                                {prop.m2_construction.toLocaleString()} m²
                                            </span>
                                        )}
                                    </div>
                                    <p className="property-tag-type text-white/42">
                                        {prop.priceLabel ?? formatPrice(prop.price, prop.currency)}
                                    </p>
                                    <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                                        <Link
                                            href={`/inventario?uso=${encodeURIComponent(propertyUse)}`}
                                            className="group/cta inline-flex flex-1 items-center justify-center gap-2 px-2 py-2.5 text-white/82 transition-colors duration-300 hover:text-[var(--color-accent)]"
                                        >
                                            <span className="property-tag-type relative pb-1">
                                                Inventario
                                                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current opacity-60 transition-transform duration-500 group-hover/cta:scale-x-100" />
                                            </span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover/cta:translate-x-1" aria-hidden="true" />
                                        </Link>
                                        <Link
                                            href={href}
                                            className="inline-flex flex-1 items-center justify-center gap-2 border border-white/10 px-4 py-2.5 property-tag-type text-white/75 transition-colors hover:border-[var(--color-accent)]/30 hover:text-white"
                                        >
                                            Pedir detalles
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </ScrollReveal>
                    );
                })}
            </div>

            <div className="mt-10 text-center">
                <Link
                    href={`/inventario?uso=${encodeURIComponent(propertyUse)}`}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
                >
                    <span className="property-tag-type relative pb-1">
                        {ctaText}
                        <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}

