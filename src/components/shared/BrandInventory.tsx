import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArrowRight, ImageIcon, MapPin, Maximize2 } from "lucide-react";

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
            title: "Casa premium en fraccionamiento privado",
            property_type: "Residencial",
            business_type: "Zona residencial",
            price: 0,
            currency: "USD",
            m2_construction: 320,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Precio de ejemplo",
        },
        {
            id: "placeholder-residencial-2",
            slug: null,
            title: "Residencia familiar con amenidades",
            property_type: "Residencial",
            business_type: "Alta plusvalía",
            price: 0,
            currency: "USD",
            m2_construction: 260,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Editable desde admin",
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
            priceLabel: "Contenido temporal",
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
            priceLabel: "Precio de ejemplo",
        },
        {
            id: "placeholder-comercial-2",
            slug: null,
            title: "Oficina ejecutiva lista para operar",
            property_type: "Oficina",
            business_type: "Corporativo",
            price: 0,
            currency: "USD",
            m2_construction: 180,
            cover_image: null,
            isPlaceholder: true,
            priceLabel: "Editable desde admin",
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
            priceLabel: "Contenido temporal",
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
            priceLabel: "Precio de ejemplo",
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
            priceLabel: "Editable desde admin",
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
            priceLabel: "Contenido temporal",
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
    eyebrow = "Inventario ejemplo",
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
            className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
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

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {displayProperties.map((prop) => {
                    const href = prop.isPlaceholder
                        ? `/contacto?interes=${encodeURIComponent(propertyUse)}`
                        : `/inventario/${prop.slug || prop.id}`;
                    const hasCoverImage = Boolean(prop.cover_image);

                    return (
                        <article
                            key={prop.id}
                            className="group overflow-hidden border border-white/[0.08] bg-white/[0.025]"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
                                {hasCoverImage ? (
                                    <Image
                                        src={prop.cover_image as string}
                                        alt={prop.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                <div className="gold-premium-overlay absolute inset-0 flex flex-col items-center justify-center">
                                    <ImageIcon className="mb-3 h-6 w-6 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="property-tag-type text-white/68">
                                        Imagen de ejemplo
                                    </span>
                                </div>
                                )}
                                {hasCoverImage && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                                )}
                                <div className="absolute left-4 top-4 rounded-full border border-[var(--color-accent)]/30 bg-background/85 px-3 py-1 property-tag-type gold-ink">
                                    {prop.isPlaceholder ? "Ejemplo" : prop.property_type}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-semibold text-white">{prop.title}</h3>
                                </div>
                            </div>

                            <div className="space-y-5 p-5">
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
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Link
                                        href={`/inventario?uso=${encodeURIComponent(propertyUse)}`}
                                        className="inline-flex flex-1 items-center justify-center gap-2 border border-[var(--color-accent)]/45 px-4 py-2.5 property-tag-type gold-ink transition-colors hover:border-[var(--color-accent)]"
                                    >
                                        Inventario
                                    </Link>
                                    <Link
                                        href={href}
                                        className="inline-flex flex-1 items-center justify-center gap-2 border border-white/10 px-4 py-2.5 property-tag-type text-white/75 transition-colors hover:border-white/30"
                                    >
                                        Solicitar
                                    </Link>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="mt-10 text-center">
                <Link
                    href={`/inventario?uso=${encodeURIComponent(propertyUse)}`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-accent)]/35 px-6 property-tag-type text-white transition-colors hover:border-[var(--color-accent)]"
                >
                    {ctaText}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}

