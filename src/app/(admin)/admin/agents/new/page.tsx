import { AgentForm } from "@/components/admin/agent-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { requireAdminRole } from "@/lib/auth";

export default async function NewAgentPage() {
    await requireAdminRole();
    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <AdminPageHeader eyebrow="Equipo" title="Nuevo integrante" description="Registra su perfil público, rol interno y acceso al panel." />
            <AgentForm />
        </div>
    );
}
