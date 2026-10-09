import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import type { PropertyCardData } from "@/components/property/PropertyCard";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Propiedades en Tijuana",
    alternates: { canonical: "/inventario" },
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
            <header className="relative flex min-h-[72svh] items-end overflow-hidden pb-12 pt-40 sm:min-h-[80svh] sm:pb-16">
                <CinematicImage
                    src="/home-hero-bg.webp"
                    alt="Arquitectura residencial contemporánea en Tijuana"
                    priority
                    className="absolute inset-0"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
                <div className="relative mx-auto flex w-full max-w-[90rem] flex-col justify-between gap-8 px-6 sm:px-10 lg:flex-row lg:items-end lg:px-16">
                    <div className="max-w-4xl">
                        <span className="property-tag-type text-white/75">Propiedades · Tijuana</span>
                        <h1 className="mt-5 font-display text-display-1 leading-display tracking-headline text-white">
                            Un lugar para<br />lo que sigue.
                        </h1>
                        <p className="mt-5 text-body text-white/75">
                            Residencial. Comercial. Industrial.
                        </p>
                    </div>
                    <Link href="#catalogo" className="group inline-flex w-fit items-center gap-4 property-tag-type text-white">
                        Explorar propiedades
                        <span className="flex size-12 items-center justify-center rounded-full border border-white/45 transition-colors group-hover:bg-white/15">
                            <ArrowDown className="size-4" aria-hidden="true" />
                        </span>
                    </Link>
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
