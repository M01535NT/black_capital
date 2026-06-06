import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/auth";
import { PropertyForm } from "@/components/admin/property-form";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdminSession();
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        return notFound();
    }

    // Fetch assigned agent IDs from junction table
    const { data: assignments } = await supabase
        .from("property_agents")
        .select("agent_id")
        .eq("property_id", id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase property_agents row
    const agentIds = (assignments || []).map((a: any) => a.agent_id);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Editar Propiedad</h2>
                <p className="text-muted-foreground">
                    Modifica los detalles del inventario.
                </p>
            </div>

            <div className="bg-background border border-foreground/10 rounded-xl p-6 relative">
                <PropertyForm
                    initialData={{
                        ...property,
                        agent_ids: agentIds,
                    }}
                />
            </div>
        </div>
    );
}
