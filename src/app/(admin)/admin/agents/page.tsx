     1|import { createClient } from "@/lib/supabase/server";
     2|import { Button } from "@/components/ui/button";
     3|import { UserPlus, Mail, Phone, Shield, ChevronRight, Building2 } from "lucide-react";
     4|import Link from "next/link";
     5|
     6|export const revalidate = 0;
     7|
     8|export default async function AgentsPage() {
     9|    const supabase = await createClient();
    10|
    11|    const { data: agents, error } = await supabase
    12|        .from("agents")
    13|        .select("id, full_name, email, phone, photo_url, license_number, bio, is_active, created_at")
    14|        .order("full_name", { ascending: true });
    15|
    16|    if (error) {
    17|        console.error("Error fetching agents:", error);
    18|    }
    19|
    20|    // Count properties per agent
    21|    const agentIds = (agents || []).map(a => a.id);
    22|    const { data: assignments } = agentIds.length > 0
    23|        ? await supabase
    24|            .from("property_agents")
    25|            .select("agent_id")
    26|            .in("agent_id", agentIds)
    27|        : { data: [] };
    28|
    29|    const propertyCounts = new Map<string, number>();
    30|    (assignments || []).forEach(pa => {
    31|        propertyCounts.set(pa.agent_id, (propertyCounts.get(pa.agent_id) || 0) + 1);
    32|    });
    33|
    34|    const activeAgents = (agents || []).filter(a => a.is_active);
    35|    const inactiveAgents = (agents || []).filter(a => !a.is_active);
    36|
    37|    return (
    38|        <div className="space-y-6">
    39|            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    40|                <div>
    41|                    <h2 className="section-heading text-3xl text-foreground">Agentes</h2>
    42|                    <p className="text-foreground/50">
    43|                        {activeAgents.length} agente{activeAgents.length !== 1 ? "s" : ""} activo{activeAgents.length !== 1 ? "s" : ""}
    44|                        {inactiveAgents.length > 0 ? ` · ${inactiveAgents.length} inactivo${inactiveAgents.length !== 1 ? "s" : ""}` : ""}
    45|                    </p>
    46|                </div>
    47|                <Link href="/admin/agents/new">
    48|                    <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
    49|                        <UserPlus className="h-4 w-4" /> Nuevo Agente
    50|                    </Button>
    51|                </Link>
    52|            </div>
    53|
    54|            {(!agents || agents.length === 0) ? (
    55|                <div className="bg-card border border-foreground/10 rounded-2xl p-12 text-center">
    56|                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">
    57|                        <UserPlus className="w-8 h-8 text-gold-500" />
    58|                    </div>
    59|                    <h3 className="text-xl font-bold mb-2">No hay agentes registrados</h3>
    60|                    <p className="text-foreground/50 mb-6">Registra tu primer agente para empezar a asignar propiedades.</p>
    61|                    <Link href="/admin/agents/new">
    62|                        <Button className="bg-gold-500 text-black hover:bg-gold-600">Registrar Agente</Button>
    63|                    </Link>
    64|                </div>
    65|            ) : (
    66|                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    67|                    {agents.map((agent) => {
    68|                        const propsCount = propertyCounts.get(agent.id) || 0;
    69|                        return (
    70|                            <Link
    71|                                key={agent.id}
    72|                                href={`/admin/agents/${agent.id}`}
    73|                                className="group bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
    74|                            >
    75|                                {/* Photo / Avatar */}
    76|                                <div className="flex items-center gap-4 mb-4">
    77|                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-xl font-bold shrink-0 border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-colors overflow-hidden">
    78|                                        {agent.photo_url ? (
    79|                                            <img
    80|                                                src={agent.photo_url}
    81|                                                alt={agent.full_name}
    82|                                                className="w-full h-full object-cover"
    83|                                            />
    84|                                        ) : (
    85|                                            agent.full_name.charAt(0).toUpperCase()
    86|                                        )}
    87|                                    </div>
    88|                                    <div className="min-w-0">
    89|                                        <p className="font-bold text-foreground text-base truncate group-hover:text-gold-500 transition-colors">
    90|                                            {agent.full_name}
    91|                                        </p>
    92|                                        {agent.license_number && (
    93|                                            <p className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
    94|                                                <Shield className="w-3 h-3" />
    95|                                                Céd. {agent.license_number}
    96|                                            </p>
    97|                                        )}
    98|                                    </div>
    99|                                </div>
   100|
   101|                                {/* Contact Info */}
   102|                                <div className="space-y-1.5 mb-4">
   103|                                    {agent.email && (
   104|                                        <div className="flex items-center gap-2 text-xs text-foreground/60 truncate">
   105|                                            <Mail className="w-3 h-3 text-gold-500/60 shrink-0" />
   106|                                            <span className="truncate">{agent.email}</span>
   107|                                        </div>
   108|                                    )}
   109|                                    {agent.phone && (
   110|                                        <div className="flex items-center gap-2 text-xs text-foreground/60">
   111|                                            <Phone className="w-3 h-3 text-gold-500/60 shrink-0" />
   112|                                            <span>{agent.phone}</span>
   113|                                        </div>
   114|                                    )}
   115|                                </div>
   116|
   117|                                {/* Status + Property Count + CTA */}
   118|                                <div className="flex items-center justify-between pt-3 border-t border-foreground/5">
   119|                                    <div className="flex items-center gap-2">
   120|                                        <span className={`w-2 h-2 rounded-full ${agent.is_active ? "bg-emerald-500" : "bg-foreground/20"}`} />
   121|                                        <span className="text-xs text-foreground/50">{agent.is_active ? "Activo" : "Inactivo"}</span>
   122|                                        <span className="text-xs text-foreground/30 mx-1">|</span>
   123|                                        <span className="text-xs text-foreground/50 flex items-center gap-1">
   124|                                            <Building2 className="w-3 h-3" />
   125|                                            {propsCount} {propsCount === 1 ? "propiedad" : "propiedades"}
   126|                                        </span>
   127|                                    </div>
   128|                                    <ChevronRight className="w-4 h-4 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
   129|                                </div>
   130|                            </Link>
   131|                        );
   132|                    })}
   133|                </div>
   134|            )}
   135|        </div>
   136|    );
   137|}
   138|