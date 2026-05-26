     1|import { createClient } from "@/lib/supabase/server";
     2|import { DataTable } from "@/components/admin/data-table";
     3|import { columns, PropertyRow } from "./columns";
     4|import { Button } from "@/components/ui/button";
     5|import { Plus } from "lucide-react";
     6|import Link from "next/link";
     7|
     8|export default async function PropertiesPage() {
     9|    const supabase = await createClient();
    10|
    11|    const { data: properties, error } = await supabase
    12|        .from("properties")
    13|        .select("id, title, property_use, business_type, status, price, currency")
    14|        .order("created_at", { ascending: false });
    15|
    16|    if (error) {
    17|        console.error("Error fetching properties:", error);
    18|    }
    19|
    20|    const data: PropertyRow[] = properties || [];
    21|
    22|    return (
    23|        <div className="space-y-6">
    24|            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    25|                <div>
    26|                    <h2 className="section-heading text-3xl text-foreground">Inventario</h2>
    27|                    <p className="text-foreground/50">Gestiona las propiedades activas e inactivas.</p>
    28|                </div>
    29|                <Link href="/admin/properties/new">
    30|                    <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
    31|                        <Plus className="h-4 w-4" /> Nueva Propiedad
    32|                    </Button>
    33|                </Link>
    34|            </div>
    35|
    36|            <div className="bg-card border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
    37|                <DataTable
    38|                    columns={columns}
    39|                    data={data}
    40|                    searchPlaceholder="Buscar por título..."
    41|                    searchFields={["title"]}
    42|                    filters={[
    43|                        { id: "property_use", label: "Uso", options: ["Residencial", "Comercial", "Industrial", "Habitacional"] },
    44|                        { id: "business_type", label: "Negocio", options: ["Venta", "Renta", "Aportación", "Cesión"] },
    45|                        { id: "status", label: "Estatus", options: ["Available", "Under_Offer", "Sold", "Rented"] },
    46|                    ]}
    47|                />
    48|            </div>
    49|        </div>
    50|    );
    51|}
    52|