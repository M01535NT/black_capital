"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Maximize2, Building2 } from "lucide-react";
import { formatShortPrice, formatArea } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ShareButton } from "./ShareButton";
import { PublishedBadge } from "./PublishedBadge";

/* ── Shape ─────────────────────────────────────────────────────────── */

/** Minimal shape any consumer can supply. Add fields here as the design grows. */
export interface PropertyCardData {
    id: string;
    slug: string | null;
    title: string;
    property_use: string;
    business_type: string;
    m2_terrain: number | null;
    m2_construction: number | null;
    price: number;
    currency: string;
    cover_image: string | null;
    status?: string;
    attributes?: string[] | null;
    address?: string | null;
    created_at?: string | null;
}

type Variant = "default" | "featured" | "similar";

interface PropertyCardProps {
    property: PropertyCardData;
    /** Visual variant. Controls size, padding, and which sections show. */
    variant?: Variant;
    /** Index used to stagger the entrance animation. Ignored if `disableMotion`. */
    index?: number;
    /** Pass `true` to skip framer-motion (e.g. when the parent already animates). */
    disableMotion?: boolean;
    /** Pass `true` to eagerly load (only for the first 1-3 cards in a grid). */
    priority?: boolean;
}

/* ── Variant config ────────────────────────────────────────────────── */

const ASPECT: Record<Variant, string> = {
    default: "aspect-[4/3]",
    featured: "aspect-[4/3]",
    similar: "aspect-[16/10]",
};

const PADDING: Record<Variant, string> = {
    default: "p-5",
    featured: "p-6",
    similar: "p-4",
};

const TITLE_SIZE: Record<Variant, string> = {
    default: "text-[0.9375rem]",
    featured: "text-xl",
    similar: "text-sm",
};

const SIZES: Record<Variant, string> = {
    // default: home + catalog grids
    default: "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
    // featured: 3-up large cards on home
    featured: "(max-width: 768px) 100vw, 33vw",
    // similar: 2-up smaller cards inside property detail
    similar: "(max-width: 640px) 100vw, 50vw",
};

/* ── Component ─────────────────────────────────────────────────────── */

export function PropertyCard({
    property,
    variant = "default",
    index = 0,
    disableMotion = false,
    priority = false,
}: PropertyCardProps) {
    const href = `/inventario/${property.slug || property.id}`;
    const showFullMetrics = variant === "featured";
    const showAttributes =
        variant === "featured" && !!property.attributes && property.attributes.length > 0;

    const card = (
        <Link role="article" aria-label={`Ver detalles de ${property.title}`}
            href={href}
            className={cn(
                "group block bg-card border border-foreground/5 rounded-2xl overflow-hidden transition-all duration-500",
                "hover:border-gold-500/30 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.12)]"
            )}
        >
            {/* Image + badges */}
            <div className={cn("relative overflow-hidden bg-foreground/[0.03]", ASPECT[variant])}>
                {property.cover_image ? (
                    <Image
                        src={property.cover_image}
                        alt={`Fotografía de ${property.title}`}
                        fill
                        sizes={SIZES[variant]}
                        priority={priority}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-foreground/40 text-sm font-medium uppercase tracking-widest">
                            Sin imagen
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Use badge — top-left, neutral */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded-full border border-white/10">
                        {property.property_use}
                    </span>
                    {property.created_at && (
                        <PublishedBadge createdAt={property.created_at} />
                    )}
                </div>

                {/* Share button — top-right */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                    <div className="no-print">
                        <ShareButton
                            title={property.title}
                            description={property.address || undefined}
                            variant="icon"
                            className="bg-black/60 backdrop-blur-md border-white/10 text-white hover:bg-black/80"
                        />
                    </div>
                    <span className="px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-gold-500 text-black rounded-full">
                        {property.business_type}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className={PADDING[variant]}>
                <h3
                    className={cn(
                        "font-display font-semibold uppercase tracking-wider leading-snug line-clamp-2 group-hover:text-gold-500 transition-colors",
                        TITLE_SIZE[variant],
                        showFullMetrics ? "mb-2" : "mb-3"
                    )}
                >
                    {property.title}
                </h3>

                {showFullMetrics ? (
                    <>
                        <p className="font-numerics text-xl font-bold text-gold-400 mb-4">
                            {formatShortPrice(property.price, property.currency, property.business_type)}
                        </p>
                        {(property.m2_terrain || property.m2_construction) && (
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-foreground/70">
                                {property.m2_terrain ? (
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Maximize2 className="w-4 h-4 text-gold-500 shrink-0" />
                                        <span className="font-numerics truncate">
                                            {formatArea(property.m2_terrain, "T")}
                                        </span>
                                    </div>
                                ) : null}
                                {property.m2_construction ? (
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Building2 className="w-4 h-4 text-gold-500 shrink-0" />
                                        <span className="font-numerics truncate">
                                            {formatArea(property.m2_construction, "C")}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        {showAttributes && property.attributes && (
                            <div className="pt-4 border-t border-foreground/10 flex flex-wrap gap-2">
                                {property.attributes.map((attr, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs px-2 py-1 bg-foreground/5 text-foreground/80 rounded-md"
                                    >
                                        {attr}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-foreground/5">
                        <div className="flex gap-3 text-[11px] text-foreground/40 font-medium uppercase tracking-wider min-w-0">
                            {property.m2_terrain ? (
                                <span className="truncate">{formatArea(property.m2_terrain, "T")}</span>
                            ) : null}
                            {property.m2_construction ? (
                                <span className="truncate">{formatArea(property.m2_construction, "C")}</span>
                            ) : null}
                        </div>
                        <span className="text-sm font-semibold font-numerics text-gold-500 whitespace-nowrap shrink-0">
                            {formatShortPrice(property.price, property.currency, property.business_type)}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );

    if (disableMotion) return card;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
            {card}
        </motion.div>
    );
}
