"use client";

import Link from "next/link";
import { ArrowRight, Maximize2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";

const mockFeatured = [
    {
        id: "1",
        title: "Torre Corporativa Ansel",
        slug: "torre-corporativa-ansel",
        property_use: "Comercial",
        business_type: "Venta",
        m2_terrain: 2500,
        m2_construction: 15000,
        price: 185000000,
        currency: "MXN",
        attributes: ["Certificación LEED", "Helipuerto"],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "2",
        title: "Penthouse The Legacy",
        slug: "penthouse-the-legacy",
        property_use: "Residencial",
        business_type: "Venta",
        m2_terrain: null,
        m2_construction: 450,
        price: 42500000,
        currency: "MXN",
        attributes: ["Vista Panorámica", "Domo de Cristal"],
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "Parque Logístico Norte",
        slug: "parque-logistico-norte",
        property_use: "Industrial",
        business_type: "Renta",
        m2_terrain: 50000,
        m2_construction: 35000,
        price: 8.5,
        currency: "USD",
        attributes: ["Cross Docking", "Seguridad 24/7"],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    }
];

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
    return (
        <section className="w-full py-24 bg-zinc-950">
            <div className="container mx-auto px-4">
                <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                            Inventario Exclusivo
                        </h2>
                        <p className="text-foreground/70 text-lg">
                            Una selección curada de nuestras oportunidades de inversión más destacadas en el mercado actual.
                        </p>
                    </div>
                    <Link href="/inventario">
                        <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black">
                            Ver Todo el Catálogo <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </FadeIn>

                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockFeatured.map((item) => (
                        <StaggerItem key={item.id}>
                            <Link href={`/inventario/${item.id}`} className="group block h-full">
                                <article className="h-full flex flex-col bg-background border border-foreground/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-gold-500/30 hover:shadow-[0_0_40px_-5px] hover:shadow-gold-500/20">

                                    {/* Image Wrapper */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                        />
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
                                        <h3 className="text-2xl font-display font-bold text-foreground group-hover:text-gold-500 transition-colors line-clamp-2 mb-2">
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
                                        <div className="mt-auto pt-4 border-t border-foreground/10 flex flex-wrap gap-2">
                                            {item.attributes.map((attr, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 bg-foreground/5 text-foreground/80 rounded-md">
                                                    {attr}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerChildren>
            </div>
        </section>
    );
}
