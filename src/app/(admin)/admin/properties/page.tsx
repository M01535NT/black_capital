import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
import { columns, PropertyRow } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function PropertiesPage() {
    const supabase = await createClient();

    const { data: properties, error } = await supabase
        .from("properties")
        .select("id, title, property_use, business_type, status, price, currency")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching properties:", error);
    }

    const data: PropertyRow[] = properties || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="section-heading text-3xl text-foreground">Inventario</h2>
                    <p className="text-foreground/50">Gestiona las propiedades activas e inactivas.</p>
                </div>
                <Link href="/admin/properties/new">
                    <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
                        <Plus className="h-4 w-4" /> Nueva Propiedad
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
                <DataTable
                    columns={columns}
                    data={data}
                    searchPlaceholder="Buscar por título..."
                    searchFields={["title"]}
                    filters={[
                        { id: "property_use", label: "Uso", options: ["Residencial", "Comercial", "Industrial", "Habitacional"] },
                        { id: "business_type", label: "Negocio", options: ["Venta", "Renta", "Aportación", "Cesión"] },
                        { id: "status", label: "Estatus", options: ["Available", "Under_Offer", "Sold", "Rented"] },
                    ]}
                />
            </div>
        </div>
    );
}
