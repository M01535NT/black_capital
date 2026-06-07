"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, ImageIcon, Maximize2, MapPin } from "lucide-react";
import { formatShortPrice, formatArea } from "@/lib/format";
import { cn } from "@/lib/utils";
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

export function PropertyCard({
    property,
    variant = "default",
    index = 0,
    disableMotion = false,
    priority = false,
}: PropertyCardProps) {
    const href = property.isPlaceholder
        ? `/contacto?interes=${encodeURIComponent(property.property_use.toLowerCase())}`
        : `/inventario/${property.slug || property.id}`;
    const isCompact = variant === "similar";

    const card = (
        <article className="group relative overflow-hidden border border-white/[0.08] bg-white/[0.025] transition-colors duration-300 hover:border-[var(--color-accent)]/35">
            <Link href={href} aria-label={`Ver detalles de ${property.title}`} className="block">
                <div className={cn("relative overflow-hidden bg-white/[0.02]", ASPECT[variant])}>
                    {property.cover_image ? (
                        <Image
                            src={property.cover_image}
                            alt={`Fotografía de ${property.title}`}
                            fill
                            sizes={SIZES[variant]}
                            priority={priority}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(212,175,55,0.08),rgba(255,255,255,0.02))]">
                            <ImageIcon className="mb-3 h-5 w-5 text-[var(--color-accent)]/70" aria-hidden="true" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/44">
                                {property.isPlaceholder ? "Imagen de ejemplo" : "Sin imagen"}
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span className="border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                            {property.property_use}
                        </span>
                        {property.isPlaceholder && (
                            <span className="border border-[var(--color-accent)]/35 bg-background/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)] backdrop-blur-md">
                                Ejemplo
                            </span>
                        )}
                        {property.created_at && <PublishedBadge createdAt={property.created_at} />}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                            {property.business_type}
                            {property.property_type ? ` · ${property.property_type}` : ""}
                        </p>
                        <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-white">
                            {property.title}
                        </h3>
                    </div>
                </div>

                <div className={cn("space-y-5 p-5", isCompact && "p-4")}>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-white/55">
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
                        <p className="text-sm font-semibold text-[var(--color-accent)]">
                            {property.isPlaceholder
                                ? "Precio de ejemplo"
                                : formatShortPrice(property.price, property.currency, property.business_type)}
                        </p>
                        <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 transition-colors group-hover:text-[var(--color-accent)]">
                            {property.isPlaceholder ? "Solicitar" : "Detalles"}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </Link>
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

    if (disableMotion) return card;

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
