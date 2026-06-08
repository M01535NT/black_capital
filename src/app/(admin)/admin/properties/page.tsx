import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, requireAdminSession } from "@/lib/auth";
import { DataTable } from "@/components/admin/data-table";
import { columns, PropertyRow } from "./columns";
import { Plus } from "lucide-react";
import { AdminPageHeader, adminCardClass } from "@/components/admin/admin-ui";

export default async function PropertiesPage() {
    const profile = await requireAdminSession();
    const supabase = createAdminClient();

    let query = supabase
        .from("properties")
        .select("id, title, property_use, business_type, status, price, currency, updated_at, cover_image")
        .order("created_at", { ascending: false });

    if (!isAdmin(profile)) {
        if (!profile.agent_id) {
            query = query.eq("id", "00000000-0000-0000-0000-000000000000");
        } else {
            const { data: assigned } = await supabase
                .from("property_agents")
                .select("property_id")
                .eq("agent_id", profile.agent_id);
            const ids = (assigned || []).map((row) => row.property_id);
            query = ids.length > 0 ? query.in("id", ids) : query.eq("id", "00000000-0000-0000-0000-000000000000");
        }
    }

    const { data: properties, error } = await query;

    if (error) {
        console.error("Error fetching properties:", error);
    }

    const data: PropertyRow[] = properties || [];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Inventario"
                title="Propiedades"
                description="Gestiona disponibilidad, operación, precio y contenido público de cada activo."
                action={{ label: "Nueva propiedad", href: "/admin/properties/new", icon: Plus }}
            />

            <div className={`${adminCardClass} overflow-hidden`}>
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
