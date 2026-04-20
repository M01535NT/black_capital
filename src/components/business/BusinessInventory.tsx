"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Maximize2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

interface BusinessProperty {
    id: string;
    title: string;
    property_type: string;
    business_type: string;
    price: number;
    currency: string;
    m2_construction: number | null;
    cover_image: string | null;
}

export function BusinessInventory() {
    const [properties, setProperties] = useState<BusinessProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBusiness() {
            const supabase = createClient();
            const { data } = await supabase
                .from("properties")
                .select("id, title, property_type, business_type, price, currency, m2_construction, cover_image")
                .eq("property_use", "Comercial")
                .eq("status", "Available")
                .order("created_at", { ascending: false })
                .limit(3);

            setProperties((data as BusinessProperty[]) || []);
            setLoading(false);
        }
        fetchBusiness();
    }, []);

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    return (
        <section className="w-full py-28 bg-background relative overflow-hidden">
            {/* Top separator */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

            {/* Floating accent */}
            <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4">
                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
                    <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
                        Portafolio Comercial
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                        Espacios{" "}
                        <span className="metallic-gold">Estratégicos</span>
                    </h2>
                    <p className="text-foreground/45 text-lg">
                        Cada activo comercial ha sido evaluado por nuestro comité
                        de inversiones bajo estándares institucionales.
                    </p>
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
                        <div className="rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm p-12">
                            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-8">
                                <span className="text-gold-500 text-2xl">✦</span>
                            </div>
                            <h3 className="text-xl font-display font-bold text-foreground/70 mb-3">
                                Portafolio en Curación
                            </h3>
                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
                                Nuestro equipo está seleccionando los mejores activos comerciales.
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
                                    className="group block relative overflow-hidden rounded-2xl border border-gold-500/10 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-700 bg-zinc-950/40"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
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
                                                <span className="text-foreground/15 text-sm uppercase tracking-widest">
                                                    En preparación
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* Type badge */}
                                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-gold-500/20 text-xs font-bold uppercase tracking-widest text-gold-400">
                                            {prop.property_type}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-8 space-y-3">
                                        <h3 className="text-lg font-display font-bold text-foreground group-hover:text-gold-500 transition-colors duration-300">
                                            {prop.title}
                                        </h3>
                                        <div className="flex items-center gap-6 text-sm text-foreground/40">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-gold-500/50" />
                                                {prop.business_type}
                                            </span>
                                            {prop.m2_construction && (
                                                <span className="flex items-center gap-1.5">
                                                    <Maximize2 className="w-3.5 h-3.5 text-gold-500/50" />
                                                    {prop.m2_construction.toLocaleString()} m²
                                                </span>
                                            )}
                                        </div>
                                        <p className="metallic-gold font-numerics font-bold text-xl">
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
                    <Link href="/inventario?brand=business">
                        <Button
                            variant="outline"
                            className="border-gold-500/20 text-foreground/60 hover:border-gold-500/40 hover:text-gold-500 font-bold tracking-widest uppercase px-8 py-6 text-sm rounded-full group"
                        >
                            Ver Portafolio Completo
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </FadeIn>
            </div>
        </section>
    );
}
