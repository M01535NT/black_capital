import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole } from "@/lib/auth";
import { UserPlus, Mail, Phone, Shield, Edit, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminEmptyState, AdminPageHeader, adminCardClass } from "@/components/admin/admin-ui";
import { AgentStatusToggle } from "@/components/admin/agent-status-toggle";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default async function AgentsPage() {
    await requireAdminRole();
    const supabase = createAdminClient();

    const { data: agents, error } = await supabase
        .from("agents")
        .select("id, full_name, email, phone, photo_url, license_number, bio, is_active, created_at")
        .order("full_name", { ascending: true });

    if (error) {
        console.error("Error fetching agents:", error);
    }

    // Count properties per agent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase agents query row
    const agentIds = (agents || []).map((a: any) => a.id);
    const { data: assignments } = agentIds.length > 0
        ? await supabase
            .from("property_agents")
            .select("agent_id")
            .in("agent_id", agentIds)
        : { data: [] };

    const propertyCounts = new Map<string, number>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase property_agents row
    (assignments || []).forEach((pa: any) => {
        propertyCounts.set(pa.agent_id, (propertyCounts.get(pa.agent_id) || 0) + 1);
    });

    // Count leads won per agent
    const leadsWonCounts = new Map<string, number>();
    if (agentIds.length > 0) {
        try {
            const { data: leadsWon } = await supabase
                .from("leads")
                .select("assigned_agent_id")
                .in("assigned_agent_id", agentIds)
                .eq("status", "won");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase leads query row
            (leadsWon || []).forEach((l: any) => {
                if (l.assigned_agent_id) {
                    leadsWonCounts.set(l.assigned_agent_id, (leadsWonCounts.get(l.assigned_agent_id) || 0) + 1);
                }
            });
        } catch (e) {
            console.warn("Error fetching leads won count (column may not exist yet):", e);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase agents query row
    const activeAgents = (agents || []).filter((a: any) => a.is_active);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase agents query row
    const inactiveAgents = (agents || []).filter((a: any) => !a.is_active);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Equipo"
                title="Agentes"
                description={`${activeAgents.length} activo${activeAgents.length !== 1 ? "s" : ""}${inactiveAgents.length > 0 ? ` · ${inactiveAgents.length} inactivo${inactiveAgents.length !== 1 ? "s" : ""}` : ""}. Administra datos de contacto, licencias y asignaciones.`}
                action={{ label: "Nuevo agente", href: "/admin/agents/new", icon: UserPlus }}
            />

            {(!agents || agents.length === 0) ? (
                <AdminEmptyState
                    icon={UserPlus}
                    title="No hay agentes registrados"
                    description="Registra tu primer agente para empezar a asignar propiedades y leads."
                    action={{ label: "Registrar agente", href: "/admin/agents/new" }}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {agents.map((agent: any) => {
                        const propsCount = propertyCounts.get(agent.id) || 0;
                        const wonCount = leadsWonCounts.get(agent.id) || 0;
                        return (
                            <div
                                key={agent.id}
                                className={`group flex flex-col p-5 transition-colors hover:border-[var(--color-accent)]/30 ${adminCardClass}`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-xl font-bold text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]/50">
                                        {agent.photo_url ? (
                                            <Image
                                                src={agent.photo_url}
                                                alt={agent.full_name}
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            agent.full_name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/admin/agents/${agent.id}`} className="block truncate text-base font-semibold text-white transition-colors group-hover:text-[var(--color-accent)]">
                                            {agent.full_name}
                                        </Link>
                                        {agent.license_number && (
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/45">
                                                <Shield className="w-3 h-3" /> Céd. {agent.license_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5 mb-4">
                                    {agent.email && (
                                        <div className="flex items-center gap-2 truncate text-xs text-white/55">
                                            <Mail className="w-3 h-3 text-[var(--color-accent)]/70 shrink-0" />
                                            <span className="truncate">{agent.email}</span>
                                        </div>
                                    )}
                                    {agent.phone && (
                                        <div className="flex items-center gap-2 text-xs text-white/55">
                                            <Phone className="w-3 h-3 text-[var(--color-accent)]/70 shrink-0" />
                                            <span>{agent.phone}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="border border-white/[0.06] bg-white/[0.025] p-2 text-center">
                                        <p className="text-lg font-bold text-[var(--color-accent)]">{propsCount}</p>
                                        <p className="text-caption font-display uppercase tracking-wider text-white/45">Propiedades</p>
                                    </div>
                                    <div className="border border-white/[0.06] bg-white/[0.025] p-2 text-center">
                                        <p className="text-lg font-bold text-emerald-400">{wonCount}</p>
                                        <p className="text-caption font-display uppercase tracking-wider text-white/45">Cierres</p>
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 ${agent.is_active ? "bg-emerald-400" : "bg-white/20"}`} />
                                        <span className="text-xs text-white/45">{agent.is_active ? "Activo" : "Inactivo"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AgentStatusToggle agentId={agent.id} initialActive={!!agent.is_active} compact />
                                        <Link href={`/admin/agents/${agent.id}`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/45 hover:text-[var(--color-accent)]">
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/agents/${agent.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/45 hover:text-[var(--color-accent)]">
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
