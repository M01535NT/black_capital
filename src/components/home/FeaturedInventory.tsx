"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { createClient } from "@/lib/supabase/client";

interface FeaturedProperty {
    id: string;
    title: string;
    slug: string | null;
    property_use: string;
    business_type: string;
    m2_terrain: number | null;
    m2_construction: number | null;
    price: number;
    currency: string;
    cover_image: string | null;
    attributes: string[] | null;
}

function formatPrice(price: number, currency: string, businessType: string): string {
    if (businessType === "Renta") {
        return `$${price} ${currency}/m²/mes`;
    }
    if (price >= 1_000_000) {
        return `$${(price / 1_000_000).toFixed(1)} M ${currency}`;
    }
    return `$${price.toLocaleString()} ${currency}`;
}

export function FeaturedInventory() {
    const [items, setItems] = useState<FeaturedProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            const supabase = createClient();
            const { data } = await supabase
                .from("properties")
                .select("id, title, slug, property_use, business_type, m2_terrain, m2_construction, price, currency, cover_image, attributes")
                .eq("is_featured", true)
                .eq("status", "Available")
                .not("title", "ilike", "%prueba%")
                .not("title", "ilike", "%test%")
                .order("created_at", { ascending: false })
                .limit(3);

            setItems((data as FeaturedProperty[]) || []);
            setLoading(false);
        }
        fetchFeatured();
    }, []);

    return (
        <section className="w-full py-24 bg-zinc-950">
            <div className="container mx-auto px-4">
                <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
                            Inventario Exclusivo
                        </h2>
                        <p className="body-text text-foreground/70">
                            Una selección curada de nuestras oportunidades de inversión más destacadas en el mercado actual.
                        </p>
                    </div>
                    <Link href="/inventario">
                        <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-display text-xs font-bold uppercase tracking-widest px-6 py-5 rounded-full">
                            Ver Todo el Catálogo <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </FadeIn>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-900/50 border border-gold-500/5 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
                        <div className="rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm p-12">
                            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-8">
                                <span className="text-gold-500 text-2xl">✦</span>
                            </div>
                            <h3 className="card-title text-xl text-foreground/70 mb-3">
                                Portafolio en Curación
                            </h3>
                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
                                Nuestro equipo está seleccionando las mejores oportunidades de inversión.
                                Vuelve pronto para descubrir propiedades exclusivas.
                            </p>
                        </div>
                    </FadeIn>
                ) : (
                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item) => (
                            <StaggerItem key={item.id}>
                                <Link href={`/inventario/${item.slug || item.id}`} className="group block h-full">
                                    <article className="h-full flex flex-col bg-background border border-foreground/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-gold-500/30 hover:shadow-[0_0_40px_-5px] hover:shadow-gold-500/20">

                                        {/* Image Wrapper */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            {item.cover_image ? (
                                                <Image
                                                    src={item.cover_image}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                    <span className="text-foreground/20 text-sm uppercase tracking-widest">En preparación</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-gold-500 text-xs font-bold uppercase tracking-widest rounded-full border border-gold-500/20">
                                                    {item.property_use}
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <span className="px-3 py-1 bg-gold-500/90 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                                                    {item.business_type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="card-title text-xl text-foreground group-hover:text-gold-500 transition-colors line-clamp-2 mb-2">
                                                {item.title}
                                            </h3>

                                            {/* Price */}
                                            <p className="font-numerics text-xl font-bold text-gold-400 mb-4">
                                                {formatPrice(item.price, item.currency, item.business_type)}
                                            </p>

                                            {/* Metrics */}
                                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-foreground/70">
                                                {item.m2_terrain && (
                                                    <div className="flex items-center gap-2">
                                                        <Maximize2 className="w-4 h-4 text-gold-500" />
                                                        <span className="font-numerics">{item.m2_terrain.toLocaleString()} m² T</span>
                                                    </div>
                                                )}
                                                {item.m2_construction && (
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-gold-500" />
                                                        <span className="font-numerics">{item.m2_construction.toLocaleString()} m² C</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Attributes */}
                                            {item.attributes && item.attributes.length > 0 && (
                                                <div className="mt-auto pt-4 border-t border-foreground/10 flex flex-wrap gap-2">
                                                    {item.attributes.map((attr, idx) => (
                                                        <span key={idx} className="text-xs px-2 py-1 bg-foreground/5 text-foreground/80 rounded-md">
                                                            {attr}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>
                )}
            </div>
        </section>
    );
}
