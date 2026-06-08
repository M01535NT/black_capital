import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole } from "@/lib/auth";
import { AgentForm } from "@/components/admin/agent-form";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default async function EditAgentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdminRole();
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: agent, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !agent) {
        notFound();
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <AdminPageHeader eyebrow="Equipo" title="Editar agente" description="Actualiza información del asesor y disponibilidad operativa." />
            <AgentForm
                initialData={{
                    id: agent.id,
                    full_name: agent.full_name,
                    email: agent.email || "",
                    phone: agent.phone || "",
                    photo_url: agent.photo_url || "",
                    license_number: agent.license_number || "",
                    bio: agent.bio || "",
                    role: "agent",
                    is_active: agent.is_active,
                }}
            />
        </div>
    );
}
