import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Suspense } from "react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Inventario de Propiedades en Tijuana | Casas, Comercial e Industrial | Black Corporativo",
    description: "Explora nuestro catálogo de propiedades en Tijuana: casas residenciales, centros comerciales y naves industriales. Análisis financiero incluido. Venta y renta.",
};

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

    const { data: properties, error } = await supabase
        .from("properties")
        .select("id, slug, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

    return <CatalogFilter properties={properties || []} />;
}

export default function InventoryPage() {
    return (
        <div className="w-full flex-1 flex flex-col bg-background">
            {/* Hero — mismo lenguaje que Home (Section + Eyebrow + display-1) */}
            <section
                aria-label="Inventario"
                className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 bg-background border-b border-white/[0.04] overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <Eyebrow label="Catálogo completo" />
                            <h1 className="text-display-1 font-light text-white leading-hero tracking-tight text-balance">
                                Inventario con{" "}
                                <span className="metallic-gold-static gold-glow">análisis</span>.
                            </h1>
                            <p className="text-body-fluid text-white/70 leading-relaxed font-light max-w-2xl mt-6 sm:mt-10">
                                Casas residenciales, centros comerciales y naves industriales en Tijuana. Cada activo con
                                Cap Rate, TIR y comparativos de mercado — sin maquillaje, sin formularios eternos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 w-full py-10 lg:py-16">
                <Suspense fallback={<InventorySkeleton />}>
                    <InventoryContent />
                </Suspense>
            </div>
        </div>
    );
}
