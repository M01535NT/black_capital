import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import { Suspense } from "react";
import type { Metadata } from "next";
import type { PropertyCardData } from "@/components/property/PropertyCard";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Inventario de Propiedades en Tijuana | Casas, Comercial e Industrial | Black Capital",
    description: "Explora nuestro catálogo de propiedades en Tijuana: casas residenciales, centros comerciales y naves industriales. Análisis financiero incluido. Venta y renta.",
};

const PLACEHOLDER_PROPERTIES: PropertyCardData[] = [
    {
        id: "placeholder-residencial",
        slug: null,
        title: "Casa familiar en zona residencial de Tijuana",
        property_use: "Residencial",
        property_type: "Casa",
        business_type: "Venta",
        price: 6800000,
        currency: "MXN",
        m2_terrain: 220,
        m2_construction: 310,
        cover_image: "/brand-luxury.webp",
        status: "Available",
        address: "Zona Río, Tijuana",
        isPlaceholder: true,
    },
    {
        id: "placeholder-comercial",
        slug: null,
        title: "Local comercial en corredor de alto tráfico",
        property_use: "Comercial",
        property_type: "Local",
        business_type: "Renta",
        price: 85000,
        currency: "MXN",
        m2_terrain: 180,
        m2_construction: 180,
        cover_image: "/brand-business.webp",
        status: "Available",
        address: "Otay, Tijuana",
        isPlaceholder: true,
    },
    {
        id: "placeholder-industrial",
        slug: null,
        title: "Nave industrial clase A cerca de garita",
        property_use: "Industrial",
        property_type: "Nave",
        business_type: "Renta",
        price: 245000,
        currency: "MXN",
        m2_terrain: 3200,
        m2_construction: 2100,
        cover_image: "/brand-industrial.webp",
        status: "Available",
        address: "Parque Industrial, Tijuana",
        isPlaceholder: true,
    },
];

function InventorySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-sm border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-white/[0.02]" />
                    <div className="p-5 space-y-3">
                        <div className="h-5 bg-white/[0.04] rounded-sm w-3/4" />
                        <div className="h-4 bg-white/[0.04] rounded-sm w-1/2" />
                        <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                            <div className="h-3 bg-white/[0.04] rounded-sm w-20" />
                            <div className="h-4 bg-white/[0.04] rounded-sm w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function InventoryContent() {
    const supabase = await createClient();

    const { data: properties } = await supabase
        .from("properties")
        .select("id, slug, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

    return <CatalogFilter properties={(properties && properties.length > 0 ? properties : PLACEHOLDER_PROPERTIES) as PropertyCardData[]} />;
}

export default function InventoryPage() {
    return (
        <div className="w-full flex-1 flex flex-col bg-background">
            {/* Hero — mismo lenguaje que Home */}
            <section
                aria-label="Inventario"
                className="relative min-h-[72svh] overflow-hidden border-b border-white/[0.06] pt-24 lg:pt-28"
            >
                <Image
                    src="/hero-poster.webp"
                    alt="Inventario inmobiliario en Tijuana"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

                <div className="relative z-10 mx-auto grid min-h-[calc(72svh-6rem)] max-w-[90rem] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-12 lg:px-16">
                    <div className="lg:col-span-7">
                        <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                            <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                            Tijuana, Baja California
                        </div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            Catálogo completo
                        </p>
                        <h1 className="max-w-4xl text-display-1 font-light leading-hero tracking-tight text-white text-balance">
                            Inventario inmobiliario por tipo de activo.
                        </h1>
                        <p className="mt-6 max-w-2xl text-body-fluid leading-relaxed text-white/72">
                            Explora propiedades residenciales, comerciales e industriales con filtros claros. El contenido actual funciona como ejemplo editable para validar la experiencia.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="#catalogo"
                                className="brushed-gold inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full px-7 text-sm font-bold"
                            >
                                Explorar catálogo
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <Link
                                href="/contacto?interes=inventario"
                                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-7 text-sm font-semibold text-white transition-colors hover:border-[var(--color-accent)]"
                            >
                                Hablar con asesor
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="border border-white/10 bg-background/82 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                                    <Search className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Filtros principales</p>
                                    <p className="text-xs text-white/50">Ejemplo editable desde admin</p>
                                </div>
                            </div>
                            <div className="grid gap-3 py-4">
                                {["Tipo de operación", "Uso de propiedad", "Zona o título", "Orden por precio"].map((label) => (
                                    <div key={label} className="flex items-center justify-between border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                                        <span className="text-sm text-white/65">{label}</span>
                                        <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">Filtrar</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="#catalogo"
                                className="inline-flex w-full items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-black"
                            >
                                Ver resultados
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div id="catalogo" className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 w-full py-10 lg:py-16">
                <Suspense fallback={<InventorySkeleton />}>
                    <InventoryContent />
                </Suspense>
            </div>
        </div>
    );
}
