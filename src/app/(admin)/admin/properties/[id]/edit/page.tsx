import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole } from "@/lib/auth";
import { PropertyForm } from "@/components/admin/property-form";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { getFaqCatalog } from "@/lib/faq-catalog";

export default async function EditPropertyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdminRole();
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
    const faqCatalog = await getFaqCatalog();

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <AdminPageHeader eyebrow="Inventario" title="Editar propiedad" description="Actualiza contenido, precio, multimedia y asignaciones." />
            <PropertyForm
                initialData={{
                    ...property,
                    agent_ids: agentIds,
                }}
                faqCatalog={faqCatalog}
            />
        </div>
    );
}
