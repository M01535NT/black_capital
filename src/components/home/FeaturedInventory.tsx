"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { PropertyCard, type PropertyCardData } from "@/components/property/PropertyCard";
import { createClient } from "@/lib/supabase/client";

type FeaturedProperty = PropertyCardData & { property_type: string };

const SKELETON_COUNT = 3;

export function FeaturedInventory() {
    const [items, setItems] = useState<FeaturedProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeatured = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data, error: queryError } = await supabase
                .from("properties")
                .select("id, title, slug, property_use, business_type, m2_terrain, m2_construction, price, currency, cover_image, custom_attributes, property_type")
                .eq("is_featured", true)
                .eq("status", "Available")
                .order("created_at", { ascending: false })
                .limit(SKELETON_COUNT);

            if (queryError) throw new Error(queryError.message);
            setItems((data as FeaturedProperty[]) || []);
        } catch (err) {
            console.error("[FeaturedInventory] fetch failed", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "No se pudo cargar el inventario destacado.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeatured();
    }, [fetchFeatured]);

    return (
        <section
            className="w-full py-24 bg-zinc-950"
            aria-label="Inventario destacado"
        >
            <div className="container mx-auto px-4">
                <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-display-3 text-foreground mb-4">
                            Inventario Exclusivo
                        </h2>
                        <p className="text-body-lg text-foreground/70">
                            Una selección curada de nuestras oportunidades de
                            inversión más destacadas en el mercado actual.
                        </p>
                    </div>
                    <Link href="/inventario">
                        <Button
                            variant="outline"
                            className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-display text-xs font-bold uppercase tracking-eyebrow px-6 py-5 rounded-full"
                        >
                            Ver Todo el Catálogo{" "}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </FadeIn>

                {loading ? (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        aria-busy="true"
                        aria-live="polite"
                    >
                        {[...Array(SKELETON_COUNT)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/3] rounded-2xl bg-foreground/[0.04] border border-gold-500/5 animate-pulse"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <FeaturedError message={error} onRetry={fetchFeatured} />
                ) : items.length === 0 ? (
                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
                        <div className="rounded-2xl border border-gold-500/10 bg-background/40 backdrop-blur-sm p-12">
                            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-8">
                                <span
                                    className="text-gold-500 text-2xl"
                                    aria-hidden="true"
                                >
                                    ✦
                                </span>
                            </div>
                            <h3 className="text-display-4 text-foreground/70 mb-3">
                                Portafolio en Curación
                            </h3>
                            <p className="text-body text-foreground/50 max-w-md mx-auto">
                                Nuestro equipo está seleccionando las mejores
                                oportunidades de inversión. Vuelve pronto para
                                descubrir propiedades exclusivas.
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

/* ── Error subcomponent ────────────────────────────────────────────── */

function FeaturedError({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <FadeIn
            role="alert"
            className="max-w-2xl mx-auto text-center py-16"
        >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.04] backdrop-blur-sm p-12">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8">
                    <AlertTriangle
                        className="w-7 h-7 text-destructive"
                        aria-hidden="true"
                    />
                </div>
                <h3 className="text-display-4 text-foreground/80 mb-3">
                    No pudimos cargar el inventario
                </h3>
                <p className="text-body text-foreground/60 max-w-md mx-auto mb-8">
                    {message}
                </p>
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black font-display text-xs font-bold uppercase tracking-eyebrow px-6 py-5 rounded-full"
                >
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Reintentar
                </Button>
            </div>
        </FadeIn>
    );
}
