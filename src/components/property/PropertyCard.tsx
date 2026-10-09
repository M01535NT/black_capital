"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatShortPrice, formatArea } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getPropertyPlaceholderImage } from "@/lib/property-placeholder-image";
import { ShareButton } from "./ShareButton";
import { FavoriteButton } from "./favorite-button";

export interface PropertyCardData {
    id: string;
    slug: string | null;
    title: string;
    property_use: string;
    property_type?: string | null;
    business_type: string;
    m2_terrain: number | null;
    m2_construction: number | null;
    price: number;
    currency: string;
    cover_image: string | null;
    status?: string;
    customAttributes?: string[] | null;
    address?: string | null;
    created_at?: string | null;
    is_featured?: boolean | null;
    isPlaceholder?: boolean;
}

type Variant = "default" | "featured" | "similar";

interface PropertyCardProps {
    property: PropertyCardData;
    variant?: Variant;
    index?: number;
    disableMotion?: boolean;
    priority?: boolean;
}

const SIZES: Record<Variant, string> = {
    default: "(max-width: 768px) 100vw, 50vw",
    featured: "(max-width: 639px) calc(100vw - 48px), (max-width: 767px) calc(100vw - 80px), (max-width: 1023px) calc((100vw - 104px) / 2), (max-width: 1599px) calc((100vw - 152px) / 2), 724px",
    similar: "(max-width: 640px) 100vw, 50vw",
};

const STATUS_LABELS: Record<string, string> = {
    Available: "Disponible",
    Under_Offer: "Bajo oferta",
    Sold: "Vendido",
    Rented: "Rentado",
};

export function PropertyCard({
    property,
    variant = "default",
    index = 0,
    disableMotion = false,
    priority = false,
}: PropertyCardProps) {
    const shouldReduceMotion = useReducedMotion();

    const href = property.isPlaceholder
        ? `/contacto?interes=${encodeURIComponent(property.property_use.toLowerCase())}`
        : `/inventario/${property.slug || property.id}`;
    const isFeatured = variant === "featured";
    const isAvailable = (property.status || "Available") === "Available";
    const statusLabel = STATUS_LABELS[property.status || ""] || property.status || "Disponible";
    const typeUse = property.property_type
        ? `${property.property_type} · ${property.property_use}`
        : property.property_use;

    const hasCoverImage = Boolean(property.cover_image);
    const fallbackImage = getPropertyPlaceholderImage(property.property_use);
    const imageSrc = property.cover_image || fallbackImage.src;
    const imageAlt = hasCoverImage ? `Fotografía de ${property.title}` : fallbackImage.alt;

    const card = (
        <article className="group relative flex h-full min-w-0 flex-col">
            <Link
                href={href}
                aria-label={`Ver detalles de ${property.title}`}
                className={cn(
                    "relative block overflow-hidden rounded-[1.25rem] bg-white/5",
                    isFeatured ? "aspect-[4/3] max-h-[42svh] sm:aspect-[3/2]" : "aspect-[4/5] sm:aspect-[5/4]",
                )}
            >
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes={SIZES[variant]}
                    priority={priority}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035] motion-reduce:transform-none"
                />
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />
                <div className="absolute left-4 top-4 flex max-w-[calc(100%-8rem)] flex-wrap gap-2 sm:left-6 sm:top-6">
                    <span className="rounded-full bg-black/35 px-3 py-2 property-tag-type text-white backdrop-blur-md">
                        {property.business_type}
                    </span>
                    {!isAvailable && (
                        <span className="rounded-full bg-black/35 px-3 py-2 property-tag-type text-white backdrop-blur-md">
                            {statusLabel}
                        </span>
                    )}
                </div>
                {property.isPlaceholder && (
                    <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1.5 property-tag-type text-white/85 backdrop-blur-md sm:bottom-6 sm:left-6">
                        Imagen de referencia
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col pt-5 sm:pt-6">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <p className="property-price-type gold-ink">
                        {property.isPlaceholder
                            ? "Precio bajo consulta"
                            : formatShortPrice(property.price, property.currency, property.business_type)}
                    </p>
                    <span className="property-tag-type text-white/45">{typeUse}</span>
                </div>
                <Link href={href} className="mt-3 block">
                    <h3 className="line-clamp-2 font-display text-display-3 font-semibold leading-tight text-white transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                        {property.title}
                    </h3>
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 property-metadata-type text-white/55">
                    {property.address && <span>{property.address}</span>}
                    {(property.m2_terrain || property.m2_construction) && (
                        <span className="text-white/40">
                            {property.m2_construction
                                ? formatArea(property.m2_construction, "C")
                                : formatArea(property.m2_terrain!, "T")}
                        </span>
                    )}
                </div>
                <Link
                    href={href}
                    className="mt-4 inline-flex min-h-11 w-fit items-center gap-3 property-tag-type text-white/80 transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                    {property.isPlaceholder ? "Consultar opciones" : "Ver propiedad"}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                </Link>
            </div>

            <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
                <FavoriteButton propertyId={property.id} title={property.title} href={href} variant="icon" className="h-11 w-11" />
                <ShareButton
                    href={href}
                    title={property.title}
                    description={property.address || undefined}
                    variant="icon"
                    className="h-11 w-11 rounded-full! border-white/10 bg-black/50 text-white backdrop-blur-md hover:bg-black/75"
                />
            </div>
        </article>
    );

    if (disableMotion || shouldReduceMotion) return card;

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
            {card}
        </motion.div>
    );
}
