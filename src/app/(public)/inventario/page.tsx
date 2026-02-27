import { createClient } from "@/lib/supabase/server";
import { CatalogFilter } from "@/components/public/catalog-filter";

export const revalidate = 60; // Revalidate every minute 

export default async function InventoryPage() {
    const supabase = await createClient();

    // Fetch all properties, ordered by newest first
    const { data: properties, error } = await supabase
        .from("properties")
        .select("id, title, property_use, property_type, business_type, price, currency, m2_terrain, m2_construction, cover_image, status")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching properties:", error);
    }

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
                <CatalogFilter properties={properties || []} />
            </div>
        </div>
    );
}
