import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Phone, Shield, ChevronRight, Building2, Users, BarChart3, Edit, Eye } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AgentsPage() {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { data: agents, error } = await supabase
        .from("agents")
        .select("id, full_name, email, phone, photo_url, license_number, bio, is_active, created_at")
        .order("full_name", { ascending: true });

    if (error) {
        console.error("Error fetching agents:", error);
    }

    // Count properties per agent
    const agentIds = (agents || []).map((a: any) => a.id);
    const { data: assignments } = agentIds.length > 0
        ? await supabase
            .from("property_agents")
            .select("agent_id")
            .in("agent_id", agentIds)
        : { data: [] };

    const propertyCounts = new Map<string, number>();
    (assignments || []).forEach((pa: any) => {
        propertyCounts.set(pa.agent_id, (propertyCounts.get(pa.agent_id) || 0) + 1);
    });

    // Count leads won per agent
    let leadsWonCounts = new Map<string, number>();
    if (agentIds.length > 0) {
        try {
            const { data: leadsWon } = await supabase
                .from("leads")
                .select("assigned_agent_id")
                .in("assigned_agent_id", agentIds)
                .eq("status", "won");
            (leadsWon || []).forEach((l: any) => {
                if (l.assigned_agent_id) {
                    leadsWonCounts.set(l.assigned_agent_id, (leadsWonCounts.get(l.assigned_agent_id) || 0) + 1);
                }
            });
        } catch (e) {
            console.warn("Error fetching leads won count (column may not exist yet):", e);
        }
    }

    const activeAgents = (agents || []).filter((a: any) => a.is_active);
    const inactiveAgents = (agents || []).filter((a: any) => !a.is_active);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="font-display uppercase tracking-wider text-3xl text-foreground">Agentes</h2>
                    <p className="text-foreground/50 text-sm">
                        {activeAgents.length} agente{activeAgents.length !== 1 ? "s" : ""} activo{activeAgents.length !== 1 ? "s" : ""}
                        {inactiveAgents.length > 0 ? ` · ${inactiveAgents.length} inactivo${inactiveAgents.length !== 1 ? "s" : ""}` : ""}
                    </p>
                </div>
                <Link href="/admin/agents/new">
                    <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
                        <UserPlus className="h-4 w-4" /> Nuevo Agente
                    </Button>
                </Link>
            </div>

            {(!agents || agents.length === 0) ? (
                <div className="bg-card border border-foreground/10 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-gold-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-display uppercase tracking-wider">No hay agentes registrados</h3>
                    <p className="text-foreground/50 mb-6">Registra tu primer agente para empezar a asignar propiedades.</p>
                    <Link href="/admin/agents/new">
                        <Button className="bg-gold-500 text-black hover:bg-gold-600">Registrar Agente</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map((agent: any) => {
                        const propsCount = propertyCounts.get(agent.id) || 0;
                        const wonCount = leadsWonCounts.get(agent.id) || 0;
                        return (
                            <div
                                key={agent.id}
                                className="group bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300 flex flex-col"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-xl font-bold shrink-0 border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-colors overflow-hidden">
                                        {agent.photo_url ? (
                                            <img src={agent.photo_url} alt={agent.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            agent.full_name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Link href={`/admin/agents/${agent.id}`} className="font-bold text-foreground text-base truncate group-hover:text-gold-500 transition-colors block">
                                            {agent.full_name}
                                        </Link>
                                        {agent.license_number && (
                                            <p className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                                                <Shield className="w-3 h-3" /> Céd. {agent.license_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5 mb-4">
                                    {agent.email && (
                                        <div className="flex items-center gap-2 text-xs text-foreground/60 truncate">
                                            <Mail className="w-3 h-3 text-gold-500/60 shrink-0" />
                                            <span className="truncate">{agent.email}</span>
                                        </div>
                                    )}
                                    {agent.phone && (
                                        <div className="flex items-center gap-2 text-xs text-foreground/60">
                                            <Phone className="w-3 h-3 text-gold-500/60 shrink-0" />
                                            <span>{agent.phone}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-muted/20 rounded-lg p-2 text-center border border-foreground/5">
                                        <p className="text-lg font-numerics font-bold text-gold-500">{propsCount}</p>
                                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-display">Propiedades</p>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-2 text-center border border-foreground/5">
                                        <p className="text-lg font-numerics font-bold text-emerald-500">{wonCount}</p>
                                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-display">Cierres</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-foreground/5 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${agent.is_active ? "bg-emerald-500" : "bg-foreground/20"}`} />
                                        <span className="text-xs text-foreground/50">{agent.is_active ? "Activo" : "Inactivo"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Link href={`/admin/agents/${agent.id}`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50 hover:text-gold-500">
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/agents/${agent.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/50 hover:text-gold-500">
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
