"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Maximize2, MessageCircle, MapPin } from "lucide-react";
import { formatShortPrice, formatArea } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getPropertyPlaceholderImage } from "@/lib/property-placeholder-image";
import { ShareButton } from "./ShareButton";
import { PublishedBadge } from "./PublishedBadge";
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

const ASPECT: Record<Variant, string> = {
    default: "aspect-[16/10]",
    featured: "aspect-[16/10]",
    similar: "aspect-[16/10]",
};

const SIZES: Record<Variant, string> = {
    default: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
    featured: "(max-width: 768px) 100vw, 33vw",
    similar: "(max-width: 640px) 100vw, 50vw",
};

const STATUS_LABELS: Record<string, string> = {
    Available: "Disponible",
    Under_Offer: "Bajo oferta",
    Sold: "Vendido",
    Rented: "Rentado",
};

const STATUS_STYLES: Record<string, string> = {
    Available: "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 gold-ink",
    Under_Offer: "border-white/[0.12] bg-white/[0.035] text-white/68",
    Sold: "border-white/[0.12] bg-white/[0.035] text-white/58",
    Rented: "border-white/[0.12] bg-white/[0.035] text-white/58",
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
    const contactHref = `/contacto?propiedad=${encodeURIComponent(property.title)}&interes=${encodeURIComponent(property.property_use.toLowerCase())}`;
    const isCompact = variant === "similar";
    const statusLabel = STATUS_LABELS[property.status || ""] || property.status || "Disponible";
    const hasCoverImage = Boolean(property.cover_image);
    const fallbackImage = getPropertyPlaceholderImage(property.property_use);
    const imageSrc = property.cover_image || fallbackImage.src;
    const imageAlt = hasCoverImage ? `Fotografía de ${property.title}` : fallbackImage.alt;

    const card = (
        <article className="group relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/40">
            <Link href={href} aria-label={`Ver detalles de ${property.title}`} className="block">
                <div className={cn("relative overflow-hidden bg-white/[0.02]", ASPECT[variant])}>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes={SIZES[variant]}
                        priority={priority}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="border border-white/10 bg-black/60 px-3 py-1 property-tag-type text-white backdrop-blur-md">
                            {property.property_use}
                        </span>
                        {property.created_at && <PublishedBadge createdAt={property.created_at} />}
                        {property.is_featured && (
                            <span className="border border-[var(--color-accent)]/35 bg-background/75 px-3 py-1 property-tag-type gold-ink backdrop-blur-md">
                                Destacada
                            </span>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="mb-2 property-tag-type gold-ink">
                            {property.business_type}
                            {property.property_type ? ` · ${property.property_type}` : ""}
                        </p>
                        <h3 className="line-clamp-2 text-display-3 font-semibold leading-tight text-white">
                            {property.title}
                        </h3>
                    </div>
                </div>

                <div className={cn("space-y-5 p-5", isCompact && "p-4")}>
                    <div className="flex items-center justify-between gap-3">
                        <span
                            className={cn(
                                "border px-2.5 py-1 property-tag-type",
                                STATUS_STYLES[property.status || ""] || "border-white/[0.08] bg-white/[0.025] text-white/60",
                            )}
                        >
                            {statusLabel}
                        </span>
                        <span className="property-metadata-type text-white/35">
                            {property.currency}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 property-metadata-type text-white/55">
                        {property.address && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                {property.address}
                            </span>
                        )}
                        {property.m2_terrain ? (
                            <span className="inline-flex items-center gap-1.5">
                                <Maximize2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                {formatArea(property.m2_terrain, "T")}
                            </span>
                        ) : null}
                        {property.m2_construction ? (
                            <span className="inline-flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                {formatArea(property.m2_construction, "C")}
                            </span>
                        ) : null}
                    </div>

                    <div className="flex items-end justify-between gap-4 border-t border-white/[0.06] pt-4">
                        <p className="property-price-type gold-ink">
                            {property.isPlaceholder
                                ? "Precio bajo consulta"
                                : formatShortPrice(property.price, property.currency, property.business_type)}
                        </p>
                        <span className="inline-flex items-center gap-2 property-tag-type text-white/70 transition-colors group-hover:text-[var(--color-accent)]">
                            {property.isPlaceholder ? "Solicitar" : "Ver ficha"}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </Link>
            {!isCompact && (
                <div className="border-t border-white/[0.06] p-4 pt-0">
                    <Link
                        href={contactHref}
                        className="group/cta flex min-h-10 items-center justify-center gap-2 px-4 text-white/78 transition-colors hover:text-[var(--color-accent)]"
                    >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span className="property-tag-type relative pb-1">
                            Solicitar información
                            <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover/cta:opacity-100" />
                        </span>
                    </Link>
                </div>
            )}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
                <FavoriteButton propertyId={property.id} variant="icon" className="h-9 w-9" />
                <ShareButton
                    title={property.title}
                    description={property.address || undefined}
                    variant="icon"
                    className="h-9 w-9 rounded-full border-white/10 bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
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
