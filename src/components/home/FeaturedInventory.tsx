"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { createClient } from "@/lib/supabase/client";

type FeaturedProperty = PropertyCardData & { property_type: string };

export function FeaturedInventory() {
    const [items, setItems] = useState<FeaturedProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            const supabase = createClient();
            const { data } = await supabase
                .from("properties")
                .select("id, title, slug, property_use, business_type, m2_terrain, m2_construction, price, currency, cover_image, attributes, property_type")
                .eq("is_featured", true)
                .eq("status", "Available")
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
                        {items.map((item, i) => (
                            <StaggerItem key={item.id}>
                                <PropertyCard
                                    property={item}
                                    variant="featured"
                                    disableMotion
                                    priority={i === 0}
                                />
                            </StaggerItem>
                        ))}
                    </StaggerChildren>
                )}
            </div>
        </section>
    );
}
