import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";
import { Suspense } from "react";

export const revalidate = 60; // Revalidate every minute

function InventorySkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-foreground/10 bg-muted overflow-hidden">
                    <div className="aspect-[4/3] bg-foreground/5" />
                    <div className="p-6 space-y-3">
                        <div className="h-6 bg-foreground/10 rounded w-3/4" />
                        <div className="h-4 bg-foreground/10 rounded w-1/2" />
                        <div className="flex justify-between pt-4 border-t border-foreground/10">
                            <div className="h-4 bg-foreground/10 rounded w-20" />
                            <div className="h-6 bg-foreground/10 rounded w-24" />
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
        .select("id, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching properties:", error);
    }

    return <CatalogFilter properties={properties || []} />;
}

export default function InventoryPage() {
    return (
        <div className="w-full flex-1 flex flex-col bg-background relative pt-10">
            {/* Header / Hero small */}
            <div className="bg-zinc-950 py-16 border-b border-gold-500/20 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Nuestro Inventario</h1>
                    <p className="text-gold-500/80 max-w-2xl text-lg">
                        Explora nuestro portafolio de propiedades comerciales, industriales y residenciales premium.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24">
                <Suspense fallback={<InventorySkeleton />}>
                    <InventoryContent />
                </Suspense>
            </div>
        </div>
    );
}
