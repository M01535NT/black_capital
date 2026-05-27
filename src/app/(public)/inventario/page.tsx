import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import { Suspense } from "react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Inventario de Propiedades | Black Corporativo",
    description: "Explora nuestro portafolio de propiedades comerciales, industriales y residenciales premium con análisis financiero estructurado. Venta y renta de propiedades exclusivas.",
};

function InventorySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-foreground/5 bg-card overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-foreground/[0.03]" />
                    <div className="p-5 space-y-3">
                        <div className="h-5 bg-foreground/[0.06] rounded-lg w-3/4" />
                        <div className="h-4 bg-foreground/[0.04] rounded-lg w-1/2" />
                        <div className="flex justify-between pt-3 border-t border-foreground/5">
                            <div className="h-3 bg-foreground/[0.04] rounded w-20" />
                            <div className="h-4 bg-foreground/[0.06] rounded w-24" />
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
        .not("title", "ilike", "%prueba%")
        .not("title", "ilike", "%test%")
        .order("created_at", { ascending: false });

    return <CatalogFilter properties={properties || []} />;
}

export default function InventoryPage() {
    return (
        <div className="w-full flex-1 flex flex-col bg-background">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-gold-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.06,_transparent_60%)]" />
                <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
                    <h1 className="text-[2rem] md:text-[2.75rem] font-semibold tracking-tight text-foreground mb-3">
                        Inventario
                    </h1>
                    <p className="text-foreground/45 text-[0.9375rem] max-w-xl leading-relaxed">
                        Explora nuestro portafolio de propiedades comerciales, industriales y residenciales premium con análisis financiero estructurado.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10 pb-24">
                <Suspense fallback={<InventorySkeleton />}>
                    <InventoryContent />
                </Suspense>
            </div>
        </div>
    );
}
