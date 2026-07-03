import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import type { PropertyCardData } from "@/components/property/PropertyCard";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Inventario en Tijuana | Black Capital",
    description:
        "Explora residencias, locales, oficinas y naves en Tijuana. Filtra por operación, uso, tipo, precio y superficie.",
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
        address: "Tijuana",
        is_featured: true,
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
        address: "Tijuana",
        is_featured: false,
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
        address: "Tijuana",
        is_featured: false,
        isPlaceholder: true,
    },
];

function InventorySkeleton() {
    return (
        <div className="mx-auto max-w-[90rem] px-6 pb-16 pt-8 sm:px-10 lg:px-16">
            <div className="mb-8 h-12 w-full animate-pulse border border-white/[0.06] bg-white/[0.02]" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse border border-white/[0.06] bg-white/[0.02]">
                        <div className="aspect-[4/3] bg-white/[0.02]" />
                        <div className="space-y-3 p-5">
                            <div className="h-3 w-1/3 rounded-sm bg-white/[0.04]" />
                            <div className="h-5 w-3/4 rounded-sm bg-white/[0.04]" />
                            <div className="h-3 w-1/2 rounded-sm bg-white/[0.04]" />
                            <div className="flex justify-between border-t border-white/[0.06] pt-4">
                                <div className="h-5 w-24 rounded-sm bg-white/[0.04]" />
                                <div className="h-4 w-16 rounded-sm bg-white/[0.04]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

async function InventoryContent() {
    const supabase = await createClient();

    const { data: properties } = await supabase
        .from("properties")
        .select(
            "id, slug, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status, address, created_at, is_featured",
        )
        .order("created_at", { ascending: false });

    return (
        <CatalogFilter
            properties={
                (properties && properties.length > 0 ? properties : PLACEHOLDER_PROPERTIES) as PropertyCardData[]
            }
        />
    );
}

export default function InventoryPage() {
    return (
        <div className="flex w-full flex-1 flex-col bg-background">
            <header className="relative overflow-hidden border-b border-white/[0.08]">
                <Image
                    src="/home-hero-bg.webp"
                    alt=""
                    aria-hidden="true"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-[0.14]"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/85 to-background"
                />
                <div className="grain-overlay opacity-[0.08]" aria-hidden="true" />
                <div className="relative mx-auto w-full max-w-[90rem] px-6 pb-10 pt-24 sm:px-10 sm:pt-28 lg:px-16 lg:pt-32">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-6 bg-[var(--color-accent)]" aria-hidden="true" />
                        <span className="property-tag-type gold-ink">Inventario · Tijuana</span>
                    </div>
                    <h1 className="mt-4 font-display text-display-2 font-extrabold uppercase leading-[1.02] tracking-headline text-white">
                        Propiedades disponibles
                    </h1>
                    <p className="mt-3 max-w-xl text-body text-white/58">
                        Residencial, comercial e industrial con valor comercial, revisión
                        documental y ruta de cierre.
                    </p>
                </div>
            </header>

            <div id="catalogo" className="w-full">
                <Suspense fallback={<InventorySkeleton />}>
                    <InventoryContent />
                </Suspense>
            </div>
        </div>
    );
}
