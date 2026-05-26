"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Maximize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

interface IndustrialProperty {
    id: string;
    title: string;
    property_type: string;
    business_type: string;
    price: number;
    currency: string;
    m2_construction: number | null;
    cover_image: string | null;
}

export function IndustrialInventory() {
    const [properties, setProperties] = useState<IndustrialProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchIndustrial() {
            const supabase = createClient();
            const { data } = await supabase
                .from("properties")
                .select("id, title, property_type, business_type, price, currency, m2_construction, cover_image")
                .eq("property_use", "Industrial")
                .eq("status", "Available")
                .order("created_at", { ascending: false })
                .limit(3);

            setProperties((data as IndustrialProperty[]) || []);
            setLoading(false);
        }
        fetchIndustrial();
    }, []);

    return (
        <section className="w-full py-24 bg-background relative overflow-hidden">
            {/* Top separator */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-500/30 to-transparent" />

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-8 h-px bg-steel-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-steel-400">
                            Portafolio activo
                        </span>
                        <div className="w-8 h-px bg-steel-500" />
                    </div>
                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
                        Inventario <span className="metallic-gold">Industrial</span>
                    </h2>
                    <p className="text-foreground/50 text-lg">
                        Activos seleccionados con análisis financiero completo y documentación verificada.
                    </p>
                </FadeIn>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[16/10] bg-zinc-900/50 border border-steel-500/10 animate-pulse"
                            />
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
                        <div className="border border-steel-500/15 bg-zinc-950/50 p-12">
                            <div className="w-6 h-6 border-t-2 border-l-2 border-steel-500/30 mb-8 mx-auto" />
                            <h3 className="card-title text-xl text-foreground/70 mb-3 uppercase tracking-wider">
                                Portafolio en Preparación
                            </h3>
                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
                                Nuestro inventario industrial se actualiza constantemente.
                                Solicita acceso anticipado para recibir las primeras oportunidades.
                            </p>
                        </div>
                    </FadeIn>
                ) : (
                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {properties.map((prop) => (
                            <StaggerItem key={prop.id}>
                                <Link
                                    href={`/inventario/${prop.id}`}
                                    className="group block relative overflow-hidden border border-steel-500/15 hover:border-gold-500/30 transition-all duration-500 bg-zinc-950/50"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {prop.cover_image ? (
                                            <Image
                                                src={prop.cover_image}
                                                alt={prop.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
                                                <span className="text-foreground/20 text-sm uppercase tracking-widest">
                                                    Sin imagen
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                                        {/* Type badge */}
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm border border-steel-500/20 text-xs font-bold uppercase tracking-widest text-steel-400">
                                            {prop.property_type}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-6 space-y-3">
                                        <h3 className="card-title text-lg text-foreground group-hover:text-gold-500 transition-colors">
                                            {prop.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-foreground/40">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {prop.business_type}
                                            </span>
                                            {prop.m2_construction && (
                                                <span className="flex items-center gap-1.5">
                                                    <Maximize2 className="w-3.5 h-3.5" />
                                                    {prop.m2_construction.toLocaleString()} m²
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gold-500 font-numerics font-bold text-lg">
                                            {new Intl.NumberFormat("es-MX", { style: "currency", currency: prop.currency }).format(prop.price)}
                                        </p>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerChildren>
                )}

                {/* CTA to full inventory */}
                <FadeIn className="text-center mt-12">
                    <Link href="/inventario?brand=industrial">
                        <Button
                            variant="outline"
                            className="border-steel-500/30 text-foreground/70 hover:border-gold-500/30 hover:text-gold-500 font-bold tracking-widest uppercase px-8 py-6 text-sm group"
                        >
                            Ver Todo el Inventario Industrial
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </FadeIn>
            </div>
        </section>
    );
}
