     1|import { createClient } from "@/lib/supabase/server";
     2|import { notFound } from "next/navigation";
     3|import { Button } from "@/components/ui/button";
     4|import { Badge } from "@/components/ui/badge";
     5|import { ChevronLeft, Mail, Phone, Calendar, Globe, Tag, FileText } from "lucide-react";
     6|import Link from "next/link";
     7|import { LeadActions } from "./lead-actions";
     8|
     9|export const revalidate = 0;
    10|
    11|export default async function LeadDetailPage({
    12|    params,
    13|}: {
    14|    params: Promise<{ id: string }>;
    15|}) {
    16|    const { id } = await params;
    17|    const supabase = await createClient();
    18|
    19|    const { data: lead, error } = await supabase
    20|        .from("leads")
    21|        .select("*")
    22|        .eq("id", id)
    23|        .single();
    24|
    25|    if (error || !lead) {
    26|        notFound();
    27|    }
    28|
    29|    // If lead has a property_id, get property title
    30|    let propertyTitle: string | null = null;
    31|    if (lead.property_id) {
    32|        const { data: prop } = await supabase
    33|            .from("properties")
    34|            .select("title")
    35|            .eq("id", lead.property_id)
    36|            .single();
    37|        if (prop) propertyTitle = prop.title;
    38|    }
    39|
    40|    const statusMap: Record<string, { label: string; color: string }> = {
    41|        new: { label: "Nuevo", color: "bg-blue-500/10 text-blue-500" },
    42|        contacted: { label: "Contactado", color: "bg-yellow-500/10 text-yellow-500" },
    43|        qualified: { label: "Calificado", color: "bg-purple-500/10 text-purple-500" },
    44|        lost: { label: "Perdido", color: "bg-red-500/10 text-red-500" },
    45|        won: { label: "Ganado", color: "bg-emerald-500/10 text-emerald-500" },
    46|    };
    47|
    48|    const sourceLabels: Record<string, string> = {
    49|        organic: "Orgánico",
    50|        campaign: "Campaña",
    51|        referral: "Referido",
    52|        other: "Otro",
    53|        landing_luxury: "Landing Luxury",
    54|        landing_business: "Landing Business",
    55|        landing_industrial: "Landing Industrial",
    56|    };
    57|
    58|    return (
    59|        <div className="space-y-6 max-w-4xl mx-auto w-full">
    60|            {/* Header */}
    61|            <div className="flex items-center justify-between gap-4">
    62|                <div className="flex items-center gap-4">
    63|                    <Link href="/admin/leads">
    64|                        <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
    65|                            <ChevronLeft className="h-4 w-4" />
    66|                        </Button>
    67|                    </Link>
    68|                    <div>
    69|                        <h2 className="card-title text-2xl text-foreground">{lead.name}</h2>
    70|                        <p className="text-foreground/50 text-sm">
    71|                            Registrado {new Date(lead.created_at).toLocaleDateString("es-MX", { dateStyle: "long" })}
    72|                        </p>
    73|                    </div>
    74|                </div>
    75|                <LeadActions leadId={lead.id} currentStatus={lead.status} />
    76|            </div>
    77|
    78|            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    79|                {/* Main Info */}
    80|                <div className="lg:col-span-2 space-y-6">
    81|                    {/* Contact Card */}
    82|                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-4">
    83|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Información de Contacto</h3>
    84|                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    85|                            <a href={`mailto:${lead.email}`}
    86|                                className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-gold-500/5 transition-colors group"
    87|                            >
    88|                                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
    89|                                <div>
    90|                                    <p className="text-xs text-foreground/50">Correo</p>
    91|                                    <p className="text-sm font-medium group-hover:text-gold-500 transition-colors">{lead.email}</p>
    92|                                </div>
    93|                            </a>
    94|                            <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
    95|                                target="_blank" rel="noopener noreferrer"
    96|                                className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-gold-500/5 transition-colors group"
    97|                            >
    98|                                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
    99|                                <div>
   100|                                    <p className="text-xs text-foreground/50">Teléfono / WhatsApp</p>
   101|                                    <p className="text-sm font-medium group-hover:text-gold-500 transition-colors">{lead.phone}</p>
   102|                                </div>
   103|                            </a>
   104|                        </div>
   105|                    </div>
   106|
   107|                    {/* Status + Source */}
   108|                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-4">
   109|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Detalles del Lead</h3>
   110|                        <div className="grid grid-cols-2 gap-6">
   111|                            <div className="space-y-1">
   112|                                <p className="text-xs text-foreground/50">Estado Actual</p>
   113|                                <Badge variant="secondary" className={(statusMap[lead.status] || {}).color || ""}>
   114|                                    {(statusMap[lead.status] || {}).label || lead.status}
   115|                                </Badge>
   116|                            </div>
   117|                            <div className="space-y-1">
   118|                                <p className="text-xs text-foreground/50">Origen</p>
   119|                                <div className="flex items-center gap-2 text-sm">
   120|                                    <Globe className="w-4 h-4 text-foreground/40" />
   121|                                    {sourceLabels[lead.source] || lead.source}
   122|                                </div>
   123|                            </div>
   124|                            <div className="space-y-1">
   125|                                <p className="text-xs text-foreground/50">Fecha de Registro</p>
   126|                                <div className="flex items-center gap-2 text-sm">
   127|                                    <Calendar className="w-4 h-4 text-foreground/40" />
   128|                                    {new Date(lead.created_at).toLocaleDateString("es-MX", {
   129|                                        day: "2-digit",
   130|                                        month: "long",
   131|                                        year: "numeric",
   132|                                        hour: "2-digit",
   133|                                        minute: "2-digit",
   134|                                    })}
   135|                                </div>
   136|                            </div>
   137|                            <div className="space-y-1">
   138|                                <p className="text-xs text-foreground/50">ID</p>
   139|                                <div className="flex items-center gap-2 text-sm font-sans tabular-nums text-foreground/60">
   140|                                    <Tag className="w-4 h-4 text-foreground/40" />
   141|                                    {lead.id.slice(0, 8)}...
   142|                                </div>
   143|                            </div>
   144|                        </div>
   145|                    </div>
   146|
   147|                    {/* Property of Interest */}
   148|                    {propertyTitle && (
   149|                        <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-3">
   150|                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Propiedad de Interés</h3>
   151|                            <Link href={`/admin/properties/${lead.property_id}`}
   152|                                className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-gold-500/5 transition-colors group"
   153|                            >
   154|                                <FileText className="w-5 h-5 text-gold-500 shrink-0" />
   155|                                <span className="text-sm font-medium group-hover:text-gold-500 transition-colors">{propertyTitle}</span>
   156|                            </Link>
   157|                        </div>
   158|                    )}
   159|
   160|                    {/* Notes */}
   161|                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-4">
   162|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Notas Internas</h3>
   163|                        {lead.notes ? (
   164|                            <div className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed bg-muted/20 p-4 rounded-xl border border-foreground/5">
   165|                                {lead.notes}
   166|                            </div>
   167|                        ) : (
   168|                            <p className="text-sm text-foreground/50 italic">Sin notas registradas.</p>
   169|                        )}
   170|                    </div>
   171|                </div>
   172|
   173|                {/* Sidebar */}
   174|                <div className="space-y-6">
   175|                    {/* Quick Actions */}
   176|                    <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-3">
   177|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Acciones Rápidas</h3>
   178|                        <a href={`mailto:${lead.email}`}
   179|                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-foreground/20 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
   180|                        >
   181|                            <Mail className="w-4 h-4" /> Enviar Correo
   182|                        </a>
   183|                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
   184|                            target="_blank" rel="noopener noreferrer"
   185|                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gold-500 text-black rounded-xl text-sm font-bold hover:bg-gold-600 transition-colors"
   186|                        >
   187|                            <Phone className="w-4 h-4" /> Abrir WhatsApp
   188|                        </a>
   189|                    </div>
   190|
   191|                    {/* Status Change Widget */}
   192|                    <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-3">
   193|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Cambiar Estado</h3>
   194|                        <LeadActions leadId={lead.id} currentStatus={lead.status} showInline />
   195|                    </div>
   196|                </div>
   197|            </div>
   198|        </div>
   199|    );
   200|}
   201|