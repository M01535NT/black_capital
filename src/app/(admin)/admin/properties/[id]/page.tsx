     1|import { createClient } from "@/lib/supabase/server";
     2|import { notFound } from "next/navigation";
     3|import { Badge } from "@/components/ui/badge";
     4|import { Button } from "@/components/ui/button";
     5|import { ChevronLeft, Edit, Ruler, Building2, Calendar, ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react";
     6|import Link from "next/link";
     7|import { DocList } from "@/components/public/doc-list";
     8|import { ImageGallery } from "@/components/public/image-gallery";
     9|
    10|export const revalidate = 0;
    11|
    12|export default async function AdminPropertyDetailPage({
    13|    params,
    14|}: {
    15|    params: Promise<{ id: string }>;
    16|}) {
    17|    const { id } = await params;
    18|    const supabase = await createClient();
    19|
    20|    const { data: property, error } = await supabase
    21|        .from("properties")
    22|        .select("*")
    23|        .eq("id", id)
    24|        .single();
    25|
    26|    if (error || !property) {
    27|        notFound();
    28|    }
    29|
    30|    // Fetch assigned agents
    31|    const { data: assignments } = await supabase
    32|        .from("property_agents")
    33|        .select("agent_id")
    34|        .eq("property_id", id);
    35|
    36|    let agents: { id: string; full_name: string; email: string | null; phone: string | null }[] = [];
    37|    if (assignments && assignments.length > 0) {
    38|        const agentIds = assignments.map(a => a.agent_id);
    39|        const { data: agentData } = await supabase
    40|            .from("agents")
    41|            .select("id, full_name, email, phone")
    42|            .in("id", agentIds)
    43|            .eq("is_active", true);
    44|        if (agentData) agents = agentData;
    45|    }
    46|
    47|    const formatPrice = (price: number, currency: string) => {
    48|        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    49|    };
    50|
    51|    const statusColors: Record<string, string> = {
    52|        Available: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    53|        Under_Offer: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    54|        Sold: "bg-red-500/10 text-red-500 border-red-500/20",
    55|        Rented: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    56|    };
    57|
    58|    // Documents
    59|    const documents: { label: string; url: string }[] = [];
    60|    if (property.documents && Array.isArray(property.documents)) {
    61|        documents.push(...property.documents);
    62|    }
    63|    if (property.brochure_path) {
    64|        if (!documents.some(d => d.url === property.brochure_path)) {
    65|            documents.push({ label: "Brochure Ejecutivo", url: property.brochure_path });
    66|        }
    67|    }
    68|
    69|    return (
    70|        <div className="space-y-6 max-w-5xl mx-auto w-full">
    71|            {/* Header */}
    72|            <div className="flex items-center justify-between gap-4">
    73|                <div className="flex items-center gap-4">
    74|                    <Link href="/admin/properties">
    75|                        <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
    76|                            <ChevronLeft className="h-4 w-4" />
    77|                        </Button>
    78|                    </Link>
    79|                    <div>
    80|                        <h2 className="card-title text-2xl text-foreground truncate max-w-xl">
    81|                            {property.title}
    82|                        </h2>
    83|                        <p className="text-foreground/50 text-sm">
    84|                            Creado {new Date(property.created_at).toLocaleDateString("es-MX", { dateStyle: "long" })}
    85|                            {property.updated_at !== property.created_at && (
    86|                                <> · Actualizado {new Date(property.updated_at).toLocaleDateString("es-MX", { dateStyle: "long" })}</>
    87|                            )}
    88|                        </p>
    89|                    </div>
    90|                </div>
    91|                <div className="flex gap-2">
    92|                    <Link href={`/inventario/${property.id}`} target="_blank">
    93|                        <Button variant="outline" className="gap-2 border-foreground/20">
    94|                            <ExternalLink className="w-4 h-4" /> Ver Página Pública
    95|                        </Button>
    96|                    </Link>
    97|                    <Link href={`/admin/properties/${property.id}/edit`}>
    98|                        <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
    99|                            <Edit className="w-4 h-4" /> Editar
   100|                        </Button>
   101|                    </Link>
   102|                </div>
   103|            </div>
   104|
   105|            {/* Badges */}
   106|            <div className="flex flex-wrap gap-2">
   107|                <Badge className="bg-gold-500 text-black uppercase tracking-wider">{property.business_type}</Badge>
   108|                <Badge variant="outline" className="uppercase tracking-wider">{property.property_use}</Badge>
   109|                <Badge variant="outline" className="uppercase tracking-wider">{property.property_type}</Badge>
   110|                <Badge variant="outline" className={statusColors[property.status] || ""}>
   111|                    {property.status === "Available" ? "Disponible"
   112|                        : property.status === "Under_Offer" ? "Bajo Oferta"
   113|                        : property.status === "Sold" ? "Vendido"
   114|                        : property.status === "Rented" ? "Rentado"
   115|                        : property.status}
   116|                </Badge>
   117|                {property.is_project && <Badge className="bg-blue-600 text-white">Proyecto VIP</Badge>}
   118|                {property.is_featured && <Badge className="bg-gold-500/20 text-gold-500 border border-gold-500/30">Destacada</Badge>}
   119|                {property.is_assignment && <Badge className="bg-purple-500/20 text-purple-500">Cesión</Badge>}
   120|            </div>
   121|
   122|            {/* Price */}
   123|            <p className="text-3xl font-numerics font-bold text-gold-500">
   124|                {formatPrice(property.price, property.currency)}
   125|                {property.business_type === "Renta" && (
   126|                    <span className="text-base text-foreground/50 font-normal"> /mes</span>
   127|                )}
   128|            </p>
   129|
   130|            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
   131|                {/* Left: Images + Description */}
   132|                <div className="lg:col-span-2 space-y-6">
   133|                    {/* Images */}
   134|                    <ImageGallery
   135|                        images={property.images || []}
   136|                        title={property.title}
   137|                        coverImage={property.cover_image}
   138|                    />
   139|
   140|                    {/* Metrics */}
   141|                    <div className="bg-muted/30 p-6 rounded-2xl border border-foreground/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
   142|                        <div className="flex flex-col items-center gap-1.5">
   143|                            <Ruler className="text-gold-500 w-5 h-5" />
   144|                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Terreno</span>
   145|                            <span className="font-numerics font-bold">{property.m2_terrain ? `${property.m2_terrain} m²` : "N/D"}</span>
   146|                        </div>
   147|                        <div className="flex flex-col items-center gap-1.5">
   148|                            <Building2 className="text-gold-500 w-5 h-5" />
   149|                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Construcción</span>
   150|                            <span className="font-numerics font-bold">{property.m2_construction ? `${property.m2_construction} m²` : "N/D"}</span>
   151|                        </div>
   152|                        <div className="flex flex-col items-center gap-1.5">
   153|                            <Calendar className="text-gold-500 w-5 h-5" />
   154|                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Publicado</span>
   155|                            <span className="font-numerics font-bold text-sm">
   156|                                {new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
   157|                            </span>
   158|                        </div>
   159|                        <div className="flex flex-col items-center gap-1.5">
   160|                            <ShieldCheck className="text-gold-500 w-5 h-5" />
   161|                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Estatus</span>
   162|                            <span className="font-bold text-sm text-emerald-500">Verificado</span>
   163|                        </div>
   164|                    </div>
   165|
   166|                    {/* Description */}
   167|                    <div>
   168|                        <h3 className="text-lg font-bold border-b border-foreground/10 pb-3 mb-4">Descripción</h3>
   169|                        <div className="text-foreground/70 whitespace-pre-wrap leading-relaxed text-sm">
   170|                            {property.description || "Sin descripción."}
   171|                        </div>
   172|                    </div>
   173|                </div>
   174|
   175|                {/* Right Sidebar */}
   176|                <div className="space-y-6">
   177|                    {/* Assigned Agents */}
   178|                    <div className="bg-card border border-foreground/10 rounded-2xl p-5">
   179|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
   180|                            Asesores Asignados
   181|                        </h3>
   182|                        {agents.length > 0 ? (
   183|                            <div className="space-y-3">
   184|                                {agents.map((agent) => (
   185|                                    <div key={agent.id} className="flex items-center gap-3">
   186|                                        <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-sm font-bold shrink-0">
   187|                                            {agent.full_name.charAt(0).toUpperCase()}
   188|                                        </div>
   189|                                        <div className="min-w-0">
   190|                                            <p className="font-medium text-sm truncate">{agent.full_name}</p>
   191|                                            {agent.email && (
   192|                                                <p className="text-xs text-foreground/50 truncate">{agent.email}</p>
   193|                                            )}
   194|                                        </div>
   195|                                    </div>
   196|                                ))}
   197|                            </div>
   198|                        ) : (
   199|                            <p className="text-sm text-foreground/50">Sin asesores asignados.</p>
   200|                        )}
   201|                        <Link href={`/admin/properties/${property.id}/edit`}>
   202|                            <Button variant="outline" size="sm" className="w-full mt-4 text-xs border-foreground/10">
   203|                                Gestionar Asesores
   204|                            </Button>
   205|                        </Link>
   206|                    </div>
   207|
   208|                    {/* Documents */}
   209|                    {documents.length > 0 && (
   210|                        <div className="bg-card border border-foreground/10 rounded-2xl p-5">
   211|                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
   212|                                Documentos
   213|                            </h3>
   214|                            <div className="space-y-2">
   215|                                {documents.map((doc, i) => (
   216|                                    <a
   217|                                        key={i}
   218|                                        href={doc.url}
   219|                                        target="_blank"
   220|                                        rel="noopener noreferrer"
   221|                                        className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
   222|                                    >
   223|                                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
   224|                                        {doc.label}
   225|                                    </a>
   226|                                ))}
   227|                            </div>
   228|                        </div>
   229|                    )}
   230|
   231|                    {/* Metadata */}
   232|                    <div className="bg-card border border-foreground/10 rounded-2xl p-5">
   233|                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-3">
   234|                            Metadatos
   235|                        </h3>
   236|                        <div className="space-y-2 text-sm">
   237|                            <div className="flex justify-between">
   238|                                <span className="text-foreground/50">ID</span>
   239|                                <span className="text-foreground/70 font-sans tabular-nums text-xs">{property.id.slice(0, 8)}...</span>
   240|                            </div>
   241|                            <div className="flex justify-between">
   242|                                <span className="text-foreground/50">Slug</span>
   243|                                <span className="text-foreground/70 text-xs truncate max-w-[180px]">{property.slug}</span>
   244|                            </div>
   245|                            {property.m2_terrain && (
   246|                                <div className="flex justify-between">
   247|                                    <span className="text-foreground/50">Terreno</span>
   248|                                    <span className="font-numerics">{property.m2_terrain.toLocaleString()} m²</span>
   249|                                </div>
   250|                            )}
   251|                            {property.m2_construction && (
   252|                                <div className="flex justify-between">
   253|                                    <span className="text-foreground/50">Construcción</span>
   254|                                    <span className="font-numerics">{property.m2_construction.toLocaleString()} m²</span>
   255|                                </div>
   256|                            )}
   257|                        </div>
   258|                    </div>
   259|                </div>
   260|            </div>
   261|        </div>
   262|    );
   263|}
   264|