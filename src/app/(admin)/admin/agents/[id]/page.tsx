     1|import { createClient } from "@/lib/supabase/server";
     2|import { notFound } from "next/navigation";
     3|import { Button } from "@/components/ui/button";
     4|import { Badge } from "@/components/ui/badge";
     5|import { ChevronLeft, Mail, Phone, Shield, Building2, Calendar, ExternalLink, Edit, UserPlus } from "lucide-react";
     6|import Link from "next/link";
     7|import { AssignPropertiesButton } from "./assign-properties";
     8|
     9|export const revalidate = 0;
    10|
    11|export default async function AgentDetailPage({
    12|    params,
    13|}: {
    14|    params: Promise<{ id: string }>;
    15|}) {
    16|    const { id } = await params;
    17|    const supabase = await createClient();
    18|
    19|    const { data: agent, error } = await supabase
    20|        .from("agents")
    21|        .select("*")
    22|        .eq("id", id)
    23|        .single();
    24|
    25|    if (error || !agent) {
    26|        notFound();
    27|    }
    28|
    29|    // Get assigned properties
    30|    const { data: assignments } = await supabase
    31|        .from("property_agents")
    32|        .select("property_id")
    33|        .eq("agent_id", id);
    34|
    35|    const propertyIds = (assignments || []).map(a => a.property_id);
    36|
    37|    let properties: any[] = [];
    38|    if (propertyIds.length > 0) {
    39|        const { data: props } = await supabase
    40|            .from("properties")
    41|            .select("id, title, business_type, property_use, property_type, price, currency, status, cover_image")
    42|            .in("id", propertyIds)
    43|            .order("created_at", { ascending: false });
    44|        if (props) properties = props;
    45|    }
    46|
    47|    const formatPrice = (price: number, currency: string) => {
    48|        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    49|    };
    50|
    51|    return (
    52|        <div className="space-y-6 max-w-5xl mx-auto w-full">
    53|            {/* Back + Actions */}
    54|            <div className="flex items-center justify-between gap-4">
    55|                <div className="flex items-center gap-4">
    56|                    <Link href="/admin/agents">
    57|                        <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
    58|                            <ChevronLeft className="h-4 w-4" />
    59|                        </Button>
    60|                    </Link>
    61|                    <div>
    62|                        <h2 className="section-heading text-3xl text-foreground">{agent.full_name}</h2>
    63|                        <p className="text-foreground/50">
    64|                            Registrado {new Date(agent.created_at).toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
    65|                        </p>
    66|                    </div>
    67|                </div>
    68|                <Link href={`/admin/agents/${id}/edit`}>
    69|                    <Button variant="outline" className="gap-2 border-foreground/20">
    70|                        <Edit className="w-4 h-4" /> Editar Datos
    71|                    </Button>
    72|                </Link>
    73|            </div>
    74|
    75|            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    76|                {/* Agent Profile Card */}
    77|                <div className="lg:col-span-1">
    78|                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm space-y-5">
    79|                        {/* Avatar */}
    80|                        <div className="flex flex-col items-center text-center">
    81|                            <div className="w-24 h-24 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-3xl font-bold border-2 border-gold-500/20 overflow-hidden mb-4">
    82|                                {agent.photo_url ? (
    83|                                    <img
    84|                                        src={agent.photo_url}
    85|                                        alt={agent.full_name}
    86|                                        className="w-full h-full object-cover"
    87|                                    />
    88|                                ) : (
    89|                                    agent.full_name.charAt(0).toUpperCase()
    90|                                )}
    91|                            </div>
    92|                            <h3 className="text-xl font-bold">{agent.full_name}</h3>
    93|                            <Badge
    94|                                variant="secondary"
    95|                                className={agent.is_active ? "bg-emerald-500/10 text-emerald-500 mt-2" : "bg-foreground/5 text-foreground/50 mt-2"}
    96|                            >
    97|                                {agent.is_active ? "Activo" : "Inactivo"}
    98|                            </Badge>
    99|                        </div>
   100|
   101|                        {/* Contact */}
   102|                        <div className="space-y-3 pt-3 border-t border-foreground/5">
   103|                            {agent.email && (
   104|                                <a href={`mailto:${agent.email}`}
   105|                                    className="flex items-center gap-3 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
   106|                                >
   107|                                    <Mail className="w-4 h-4 text-gold-500" />
   108|                                    {agent.email}
   109|                                </a>
   110|                            )}
   111|                            {agent.phone && (
   112|                                <a href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
   113|                                    target="_blank" rel="noopener noreferrer"
   114|                                    className="flex items-center gap-3 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
   115|                                >
   116|                                    <Phone className="w-4 h-4 text-gold-500" />
   117|                                    {agent.phone}
   118|                                </a>
   119|                            )}
   120|                            {agent.license_number && (
   121|                                <div className="flex items-center gap-3 text-sm text-foreground/70">
   122|                                    <Shield className="w-4 h-4 text-gold-500" />
   123|                                    Cédula: {agent.license_number}
   124|                                </div>
   125|                            )}
   126|                        </div>
   127|
   128|                        {/* Bio */}
   129|                        {agent.bio && (
   130|                            <div className="pt-3 border-t border-foreground/5">
   131|                                <p className="text-sm text-foreground/60 leading-relaxed">{agent.bio}</p>
   132|                            </div>
   133|                        )}
   134|                    </div>
   135|                </div>
   136|
   137|                {/* Assigned Properties */}
   138|                <div className="lg:col-span-2 space-y-4">
   139|                    <div className="flex items-center justify-between">
   140|                        <h3 className="text-lg font-bold flex items-center gap-2">
   141|                            <Building2 className="w-5 h-5 text-gold-500" />
   142|                            Inventario Asignado ({properties.length})
   143|                        </h3>
   144|                        <AssignPropertiesButton agentId={id} assignedIds={propertyIds} />
   145|                    </div>
   146|
   147|                    {properties.length === 0 ? (
   148|                        <div className="bg-card border border-foreground/10 rounded-2xl p-8 text-center">
   149|                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold-500/5 flex items-center justify-center">
   150|                                <Building2 className="w-6 h-6 text-gold-500/50" />
   151|                            </div>
   152|                            <p className="text-foreground/50 text-sm mb-4">
   153|                                Este agente no tiene propiedades asignadas aún.
   154|                            </p>
   155|                            <AssignPropertiesButton agentId={id} assignedIds={propertyIds} />
   156|                        </div>
   157|                    ) : (
   158|                        <div className="grid grid-cols-1 gap-3">
   159|                            {properties.map((prop) => (
   160|                                <Link
   161|                                    key={prop.id}
   162|                                    href={`/inventario/${prop.id}`}
   163|                                    target="_blank"
   164|                                    className="group flex items-center gap-4 bg-card border border-foreground/10 rounded-xl p-4 hover:border-gold-500/20 hover:bg-gold-500/[0.02] transition-all"
   165|                                >
   166|                                    {/* Thumbnail */}
   167|                                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-foreground/5">
   168|                                        {prop.cover_image ? (
   169|                                            <img src={prop.cover_image} alt="" className="w-full h-full object-cover" />
   170|                                        ) : (
   171|                                            <div className="w-full h-full flex items-center justify-center text-foreground/20">
   172|                                                <Building2 className="w-5 h-5" />
   173|                                            </div>
   174|                                        )}
   175|                                    </div>
   176|
   177|                                    {/* Info */}
   178|                                    <div className="flex-1 min-w-0">
   179|                                        <p className="font-bold text-foreground truncate group-hover:text-gold-500 transition-colors">
   180|                                            {prop.title}
   181|                                        </p>
   182|                                        <div className="flex items-center gap-2 text-xs text-foreground/50 mt-1">
   183|                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto border-foreground/10">
   184|                                                {prop.business_type}
   185|                                            </Badge>
   186|                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto border-foreground/10">
   187|                                                {prop.property_use}
   188|                                            </Badge>
   189|                                            <span className="text-gold-500 font-numerics font-bold">
   190|                                                {formatPrice(prop.price, prop.currency)}
   191|                                            </span>
   192|                                        </div>
   193|                                    </div>
   194|
   195|                                    <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-gold-500 transition-colors shrink-0" />
   196|                                </Link>
   197|                            ))}
   198|                        </div>
   199|                    )}
   200|                </div>
   201|            </div>
   202|        </div>
   203|    );
   204|}
   205|