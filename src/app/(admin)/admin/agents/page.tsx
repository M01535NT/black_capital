import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, Phone, Shield, ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AgentsPage() {
    const supabase = await createClient();

    const { data: agents, error } = await supabase
        .from("agents")
        .select("id, full_name, email, phone, photo_url, license_number, bio, is_active, created_at")
        .order("full_name", { ascending: true });

    if (error) {
        console.error("Error fetching agents:", error);
    }

    // Count properties per agent
    const agentIds = (agents || []).map(a => a.id);
    const { data: assignments } = agentIds.length > 0
        ? await supabase
            .from("property_agents")
            .select("agent_id")
            .in("agent_id", agentIds)
        : { data: [] };

    const propertyCounts = new Map<string, number>();
    (assignments || []).forEach(pa => {
        propertyCounts.set(pa.agent_id, (propertyCounts.get(pa.agent_id) || 0) + 1);
    });

    const activeAgents = (agents || []).filter(a => a.is_active);
    const inactiveAgents = (agents || []).filter(a => !a.is_active);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="section-heading text-3xl text-foreground">Agentes</h2>
                    <p className="text-foreground/50">
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
                    <h3 className="text-xl font-bold mb-2">No hay agentes registrados</h3>
                    <p className="text-foreground/50 mb-6">Registra tu primer agente para empezar a asignar propiedades.</p>
                    <Link href="/admin/agents/new">
                        <Button className="bg-gold-500 text-black hover:bg-gold-600">Registrar Agente</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {agents.map((agent) => {
                        const propsCount = propertyCounts.get(agent.id) || 0;
                        return (
                            <Link
                                key={agent.id}
                                href={`/admin/agents/${agent.id}`}
                                className="group bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
                            >
                                {/* Photo / Avatar */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-xl font-bold shrink-0 border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-colors overflow-hidden">
                                        {agent.photo_url ? (
                                            <img
                                                src={agent.photo_url}
                                                alt={agent.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            agent.full_name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-foreground text-base truncate group-hover:text-gold-500 transition-colors">
                                            {agent.full_name}
                                        </p>
                                        {agent.license_number && (
                                            <p className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                                                <Shield className="w-3 h-3" />
                                                Céd. {agent.license_number}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Info */}
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

                                {/* Status + Property Count + CTA */}
                                <div className="flex items-center justify-between pt-3 border-t border-foreground/5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${agent.is_active ? "bg-emerald-500" : "bg-foreground/20"}`} />
                                        <span className="text-xs text-foreground/50">{agent.is_active ? "Activo" : "Inactivo"}</span>
                                        <span className="text-xs text-foreground/30 mx-1">|</span>
                                        <span className="text-xs text-foreground/50 flex items-center gap-1">
                                            <Building2 className="w-3 h-3" />
                                            {propsCount} {propsCount === 1 ? "propiedad" : "propiedades"}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
