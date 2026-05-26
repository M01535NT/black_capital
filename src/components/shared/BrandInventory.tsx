"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Maximize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

interface BrandProperty {
    id: string;
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
}

export function BrandInventory({
    brandSlug,
    propertyUse,
    title,
    highlight,
    subtitle,
    ctaText,
    accentColor,
}: BrandInventoryProps) {
    const [properties, setProperties] = useState<BrandProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
            const supabase = createClient();
            const { data } = await supabase
                .from("properties")
                .select("id, title, property_type, business_type, price, currency, m2_construction, cover_image")
                .eq("property_use", propertyUse)
                .eq("status", "Available")
                .order("created_at", { ascending: false })
                .limit(3);

            setProperties((data as BrandProperty[]) || []);
            setLoading(false);
        }
        fetchProperties();
    }, [propertyUse]);

    const isGold = accentColor === "gold";

    const accent = {
        border: isGold ? "border-gold-500/10" : "border-steel-500/15",
        borderHover: isGold ? "hover:border-gold-500/30" : "hover:border-gold-500/30",
        shadow: isGold ? "hover:shadow-gold-500/10" : "hover:shadow-steel-500/10",
        badgeBorder: isGold ? "border-gold-500/20" : "border-steel-500/20",
        badgeText: isGold ? "text-gold-400" : "text-steel-400",
        badgeBg: isGold ? "bg-black/50" : "bg-black/60",
        separator: isGold ? "via-gold-500/30" : "via-steel-500/30",
        floating: isGold ? "bg-gold-500/3" : "bg-steel-500/3",
        iconText: isGold ? "text-gold-500" : "text-steel-400",
        shimmer: isGold ? "animate-gold-shimmer" : "",
        labelDivider: isGold ? "bg-gradient-to-r from-gold-700 to-gold-400" : "bg-steel-500",
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    return (
        <section className="w-full py-28 bg-background relative overflow-hidden">
            {/* Top separator */}
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.separator} to-transparent`} />

            {/* Floating accent */}
            <div className={`absolute bottom-1/4 left-0 w-64 h-64 rounded-full ${accent.floating} blur-[100px] pointer-events-none`} />

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
                    {isGold ? (
                        <span className={`${accent.shimmer} text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block`}>
                            {brandSlug === "luxury" ? "Selección curada" : "Portafolio activo"}
                        </span>
                    ) : (
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-8 h-px bg-steel-500" />
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-steel-400">
                                Inventario activo
                            </span>
                            <div className="w-8 h-px bg-steel-500" />
                        </div>
                    )}
                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
                        {title}
                        {highlight && (
                            <>
                                {" "}
                                <span className="metallic-gold">{highlight}</span>
                            </>
                        )}
                    </h2>
                    <p className="text-foreground/45 text-lg">{subtitle}</p>
                </FadeIn>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[16/10] rounded-2xl bg-zinc-900/50 border border-gold-500/5 animate-pulse"
                            />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
                        <div className={`rounded-2xl border ${accent.border} bg-zinc-950/40 backdrop-blur-sm p-12`}>
                            <div className={`w-16 h-16 rounded-full ${isGold ? "bg-gold-500/10" : "bg-steel-500/10"} flex items-center justify-center mx-auto mb-8`}>
                                <span className={`${accent.iconText} text-2xl`}>✦</span>
                            </div>
                            <h3 className="card-title text-xl text-foreground/70 mb-3">
                                Portafolio en Curación
                            </h3>
                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
                                Nuestro equipo está seleccionando los mejores activos de {propertyUse.toLowerCase()}.
                                Solicita acceso anticipado para ser el primero en conocerlos.
                            </p>
                        </div>
                    </FadeIn>
                ) : (
                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {properties.map((prop) => (
                            <StaggerItem key={prop.id}>
                                <Link
                                    href={`/inventario/${prop.id}`}
                                    className={`group block relative overflow-hidden rounded-2xl border ${accent.border} ${accent.borderHover} hover:shadow-2xl ${accent.shadow} transition-all duration-700 bg-zinc-950/40`}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                                        {prop.cover_image ? (
                                            <Image
                                                src={prop.cover_image}
                                                alt={prop.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
                                                <span className="text-foreground/15 text-sm uppercase tracking-widest">
                                                    En preparación
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* Type badge */}
                                        <div className={`absolute top-4 left-4 px-4 py-1.5 ${accent.badgeBg} backdrop-blur-md rounded-full border ${accent.badgeBorder} text-xs font-bold uppercase tracking-widest ${accent.badgeText}`}>
                                            {prop.property_type}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-8 space-y-3">
                                        <h3 className="card-title text-lg text-foreground group-hover:text-gold-500 transition-colors duration-300">
                                            {prop.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-foreground/40">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className={`w-3.5 h-3.5 ${isGold ? "" : "text-steel-500/50"}`} />
                                                {prop.business_type}
                                            </span>
                                            {prop.m2_construction && (
                                                <span className="flex items-center gap-1.5">
                                                    <Maximize2 className={`w-3.5 h-3.5 ${isGold ? "" : "text-steel-500/50"}`} />
                                                    {prop.m2_construction.toLocaleString()} m²
                                                </span>
                                            )}
                                        </div>
                                        <p className="metallic-gold font-numerics font-bold text-lg">
                                            {formatPrice(prop.price, prop.currency)}
                                        </p>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>
                )}

                {/* CTA to full inventory */}
                <FadeIn className="text-center mt-16">
                    <Link href={`/inventario?uso=${encodeURIComponent(propertyUse)}`}>
                        <Button
                            variant="outline"
                            className={`${isGold ? "border-gold-500/20" : "border-steel-500/30"} text-foreground/60 ${isGold ? "hover:border-gold-500/40" : "hover:border-gold-500/30"} hover:text-gold-500 font-bold tracking-widest uppercase px-8 py-6 text-sm rounded-full group`}
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </FadeIn>
            </div>
        </section>
    );
}
