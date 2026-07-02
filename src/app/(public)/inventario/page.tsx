import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import { Suspense } from "react";
import type { Metadata } from "next";
import type { PropertyCardData } from "@/components/property/PropertyCard";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Inventario en Tijuana | Black Capital",
    description: "Busca casas, locales, oficinas y naves en Tijuana por zona, precio, uso y superficie.",
};

const PLACEHOLDER_PROPERTIES: PropertyCardData[] = [
    {
        id: "placeholder-residencial",
        slug: null,
        title: "Casa familiar en Zona Río",
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
        is_featured: true,
        isPlaceholder: true,
    },
    {
        id: "placeholder-comercial",
        slug: null,
        title: "Local comercial en Otay",
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
        is_featured: false,
        isPlaceholder: true,
    },
    {
        id: "placeholder-industrial",
        slug: null,
        title: "Nave industrial en parque de Tijuana",
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
        is_featured: false,
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
        .select("id, slug, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status, address, created_at, is_featured")
        .order("created_at", { ascending: false });

    return <CatalogFilter properties={(properties && properties.length > 0 ? properties : PLACEHOLDER_PROPERTIES) as PropertyCardData[]} />;
}

export default function InventoryPage() {
    return (
        <div className="w-full flex-1 flex flex-col bg-background">
            <header className="border-b border-white/[0.08]">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 w-full pb-8 pt-24 sm:pt-28 lg:pt-32">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-6 bg-[var(--color-accent)]" aria-hidden="true" />
                        <span className="property-tag-type gold-ink">Inventario · Tijuana</span>
                    </div>
                    <h1 className="mt-4 font-display text-display-2 font-extrabold uppercase leading-[1.02] tracking-headline text-white">
                        Propiedades en Tijuana
                    </h1>
                    <p className="mt-3 max-w-xl text-body text-white/58">
                        Casas, locales, oficinas y naves. Filtra por zona,
                        precio, uso y superficie.
                    </p>
                </div>
            </header>
            <div id="catalogo" className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 w-full pb-10 pt-8 lg:pb-16">
                <Suspense fallback={<InventorySkeleton />}>
                    <InventoryContent />
                </Suspense>
            </div>
        </div>
    );
}
