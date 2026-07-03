"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Maximize2, MapPin, MessageCircle } from "lucide-react";
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
    const contactHref = `/contacto?propiedad=${encodeURIComponent(property.title)}&interes=${encodeURIComponent(
        property.property_use.toLowerCase(),
    )}`;

    const isCompact = variant === "similar";
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
        <article className="group relative flex h-full flex-col border border-white/[0.09] bg-white/[0.02] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-accent)]/45">
            {/* Media (enlace a la ficha) */}
            <Link
                href={href}
                aria-label={`Ver detalles de ${property.title}`}
                className="relative block aspect-[4/3] overflow-hidden"
            >
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes={SIZES[variant]}
                    priority={priority}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                {/* Scrim superior para legibilidad de los chips */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent"
                />
                {/* Chips: operación + destacada */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span className="border border-[var(--color-accent)]/25 bg-black/45 px-2.5 py-1 property-tag-type gold-ink backdrop-blur-md">
                        {property.business_type}
                    </span>
                    {property.is_featured && (
                        <span className="border border-white/15 bg-black/45 px-2.5 py-1 property-tag-type text-white/80 backdrop-blur-md">
                            Destacada
                        </span>
                    )}
                </div>
            </Link>

            {/* Contenido */}
            <div className={cn("flex flex-1 flex-col p-5", isCompact && "p-4")}>
                <div className="flex items-center justify-between gap-3">
                    <span className="property-metadata-type text-white/45">{typeUse}</span>
                    <span
                        className={cn(
                            "property-tag-type",
                            isAvailable ? "gold-ink" : "text-white/45",
                        )}
                    >
                        {statusLabel}
                    </span>
                </div>

                <Link href={href} className="mt-2.5 block">
                    <h3 className="line-clamp-2 font-display text-display-3 font-semibold leading-tight text-white transition-colors duration-200 ease-out group-hover:text-[var(--color-accent)]">
                        {property.title}
                    </h3>
                </Link>

                {property.address && (
                    <p className="mt-2 inline-flex items-center gap-1.5 property-metadata-type text-white/45">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                        <span className="truncate">{property.address}</span>
                    </p>
                )}

                {(property.m2_terrain || property.m2_construction) && (
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 property-metadata-type text-white/60">
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
                )}

                <Link
                    href={href}
                    className="mt-auto flex items-end justify-between gap-4 border-t border-white/[0.07] pt-5"
                >
                    <p className="property-price-type gold-ink">
                        {property.isPlaceholder
                            ? "Precio bajo consulta"
                            : formatShortPrice(property.price, property.currency, property.business_type)}
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-2 property-tag-type text-white/65 transition-colors duration-200 ease-out group-hover:text-[var(--color-accent)]">
                        {property.isPlaceholder ? "Solicitar" : "Ver ficha"}
                        <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </span>
                </Link>

                {!isCompact && (
                    <Link
                        href={contactHref}
                        className="group/cta mt-4 inline-flex min-h-10 items-center gap-2 self-start text-white/70 transition-colors duration-200 ease-out hover:text-[var(--color-accent)]"
                    >
                        <MessageCircle className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                        <span className="property-tag-type relative pb-0.5">
                            Solicitar información
                            <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-40 transition-opacity duration-200 group-hover/cta:opacity-100" />
                        </span>
                    </Link>
                )}
            </div>

            {/* Acciones flotantes (fuera del Link para no anidar interactivos) */}
            <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
                <FavoriteButton propertyId={property.id} variant="icon" className="h-10 w-10 sm:h-9 sm:w-9" />
                <ShareButton
                    title={property.title}
                    description={property.address || undefined}
                    variant="icon"
                    className="h-10 w-10 rounded-full border-white/10 bg-black/50 text-white backdrop-blur-md hover:bg-black/75 sm:h-9 sm:w-9"
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
