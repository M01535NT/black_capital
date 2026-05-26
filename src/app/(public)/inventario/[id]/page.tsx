     1|import { createClient } from "@/lib/supabase/server";
     2|import { notFound } from "next/navigation";
     3|import { Badge } from "@/components/ui/badge";
     4|import { Button } from "@/components/ui/button";
     5|import { Ruler, Building2, Calendar, ShieldCheck, Mail, Phone, User } from "lucide-react";
     6|import { DocList } from "@/components/public/doc-list";
     7|import { ImageGallery } from "@/components/public/image-gallery";
     8|import { VideoEmbed } from "@/components/public/video-embed";
     9|import { TourEmbed } from "@/components/public/tour-embed";
    10|import Link from "next/link";
    11|
    12|export const revalidate = 60;
    13|
    14|type AgentInfo = {
    15|    id: string;
    16|    full_name: string;
    17|    email: string | null;
    18|    phone: string | null;
    19|    photo_url: string | null;
    20|    license_number: string | null;
    21|};
    22|
    23|export default async function PropertyDetailPage({
    24|    params
    25|}: {
    26|    params: Promise<{ id: string }>
    27|}) {
    28|    const { id } = await params;
    29|    const supabase = await createClient();
    30|
    31|    const { data: property, error } = await supabase
    32|        .from("properties")
    33|        .select("*")
    34|        .eq("id", id)
    35|        .single();
    36|
    37|    if (error || !property) {
    38|        return notFound();
    39|    }
    40|
    41|    // Fetch assigned agents from junction table
    42|    const { data: assignedAgents } = await supabase
    43|        .from("property_agents")
    44|        .select("agent_id")
    45|        .eq("property_id", id);
    46|
    47|    let agents: AgentInfo[] = [];
    48|    if (assignedAgents && assignedAgents.length > 0) {
    49|        const agentIds = assignedAgents.map(pa => pa.agent_id);
    50|        const { data: agentData } = await supabase
    51|            .from("agents")
    52|            .select("id, full_name, email, phone, photo_url, license_number")
    53|            .in("id", agentIds)
    54|            .eq("is_active", true);
    55|        if (agentData) agents = agentData;
    56|    }
    57|
    58|    const formatPrice = (price: number, currency: string) => {
    59|        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    60|    };
    61|
    62|    // Build documents list from both sources
    63|    const documents: { label: string; url: string }[] = [];
    64|    if (property.documents && Array.isArray(property.documents)) {
    65|        documents.push(...property.documents);
    66|    }
    67|    // Backward compat: old brochure_path as a doc if not already in documents
    68|    if (property.brochure_path) {
    69|        const alreadyInDocs = documents.some(d => d.url === property.brochure_path);
    70|        if (!alreadyInDocs) {
    71|            documents.push({ label: "Brochure Ejecutivo", url: property.brochure_path });
    72|        }
    73|    }
    74|
    75|    return (
    76|        <div className="w-full bg-background min-h-screen">
    77|            {/* Badges + Title */}
    78|            <div className="container mx-auto px-4 pt-8 md:pt-12">
    79|                <div className="flex flex-wrap gap-2 mb-4">
    80|                    <Badge className="bg-gold-500 text-black uppercase tracking-wider">{property.business_type}</Badge>
    81|                    <Badge variant="outline" className="uppercase tracking-wider">{property.property_use}</Badge>
    82|                    <Badge variant="outline" className="uppercase tracking-wider">{property.property_type}</Badge>
    83|                    {property.is_project && <Badge className="bg-blue-600 text-white">Proyecto VIP</Badge>}
    84|                </div>
    85|                <h1 className="section-heading text-3xl md:text-5xl text-foreground mb-2 max-w-4xl">
    86|                    {property.title}
    87|                </h1>
    88|                <p className="text-2xl md:text-3xl font-numerics font-bold text-gold-500 mb-8">
    89|                    {formatPrice(property.price, property.currency)}
    90|                </p>
    91|            </div>
    92|
    93|            {/* Image Gallery */}
    94|            <div className="container mx-auto px-4 mb-12">
    95|                <ImageGallery
    96|                    images={property.images || []}
    97|                    title={property.title}
    98|                    coverImage={property.cover_image}
    99|                />
   100|            </div>
   101|
   102|            {/* Main Content */}
   103|            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
   104|                <div className="lg:col-span-2 space-y-12">
   105|                    {/* Overview Metrics */}
   106|                    <div className="bg-muted/30 p-8 rounded-2xl border border-foreground/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-foreground/10">
   107|                        <div className="flex flex-col items-center justify-center space-y-2">
   108|                            <Ruler className="text-gold-500 w-6 h-6" />
   109|                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Terreno</p>
   110|                            <p className="font-numerics font-bold text-xl">{property.m2_terrain ? `${property.m2_terrain} m²` : "N/D"}</p>
   111|                        </div>
   112|                        <div className="flex flex-col items-center justify-center space-y-2">
   113|                            <Building2 className="text-gold-500 w-6 h-6" />
   114|                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Construcción</p>
   115|                            <p className="font-numerics font-bold text-xl">{property.m2_construction ? `${property.m2_construction} m²` : "N/D"}</p>
   116|                        </div>
   117|                        <div className="flex flex-col items-center justify-center space-y-2">
   118|                            <Calendar className="text-gold-500 w-6 h-6" />
   119|                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Publicado</p>
   120|                            <p className="font-numerics font-bold text-lg">
   121|                                {new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
   122|                            </p>
   123|                        </div>
   124|                        <div className="flex flex-col items-center justify-center space-y-2">
   125|                            <ShieldCheck className="text-gold-500 w-6 h-6" />
   126|                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Estatus</p>
   127|                            <p className="font-bold text-lg text-emerald-500">Verificado</p>
   128|                        </div>
   129|                    </div>
   130|
   131|                    {/* Description */}
   132|                    <div>
   133|                        <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4 mb-6">Descripción de la Propiedad</h2>
   134|                        <div className="prose prose-invert prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
   135|                            {property.description}
   136|                        </div>
   137|                    </div>
   138|
   139|                    {/* Embedded Video */}
   140|                    <VideoEmbed urls={property.video_urls || []} />
   141|
   142|                    {/* Embedded 360 Tour */}
   143|                    <TourEmbed urls={property.tour_embeds || []} />
   144|                </div>
   145|
   146|                {/* Sidebar */}
   147|                <div className="space-y-6">
   148|                    {/* Agent Cards */}
   149|                    {agents.length > 0 && (
   150|                        <div className="space-y-4">
   151|                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">
   152|                                {agents.length === 1 ? "Asesor a Cargo" : "Asesores a Cargo"}
   153|                            </h3>
   154|                            {agents.map((agent) => (
   155|                                <div
   156|                                    key={agent.id}
   157|                                    className="bg-card border border-foreground/10 rounded-2xl p-5 shadow-lg shadow-black/30"
   158|                                >
   159|                                    <div className="flex items-center gap-4">
   160|                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-xl font-bold shrink-0 border-2 border-gold-500/20">
   161|                                            {agent.photo_url ? (
   162|                                                <img
   163|                                                    src={agent.photo_url}
   164|                                                    alt={agent.full_name}
   165|                                                    className="w-full h-full rounded-full object-cover"
   166|                                                />
   167|                                            ) : (
   168|                                                agent.full_name.charAt(0).toUpperCase()
   169|                                            )}
   170|                                        </div>
   171|                                        <div className="min-w-0">
   172|                                            <p className="font-bold text-foreground text-base truncate">{agent.full_name}</p>
   173|                                            {agent.license_number && (
   174|                                                <p className="text-xs text-foreground/50">Céd. {agent.license_number}</p>
   175|                                            )}
   176|                                        </div>
   177|                                    </div>
   178|                                    <div className="mt-4 space-y-2">
   179|                                        {agent.email && (
   180|                                            <a
   181|                                                href={`mailto:${agent.email}`}
   182|                                                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
   183|                                            >
   184|                                                <Mail className="w-3.5 h-3.5 text-gold-500/70" />
   185|                                                {agent.email}
   186|                                            </a>
   187|                                        )}
   188|                                        {agent.phone && (
   189|                                            <a
   190|                                                href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
   191|                                                target="_blank"
   192|                                                rel="noopener noreferrer"
   193|                                                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
   194|                                            >
   195|                                                <Phone className="w-3.5 h-3.5 text-gold-500/70" />
   196|                                                {agent.phone}
   197|                                            </a>
   198|                                        )}
   199|                                    </div>
   200|                                </div>
   201|                            ))}
   202|                        </div>
   203|                    )}
   204|
   205|                    <div className="bg-background border border-foreground/10 p-8 rounded-2xl sticky top-24 shadow-2xl shadow-black/50">
   206|                        <h3 className="text-xl font-bold mb-2">¿Te interesa esta propiedad?</h3>
   207|                        <p className="text-muted-foreground text-sm mb-6">
   208|                            Descarga los documentos sin restricciones.
   209|                        </p>
   210|
   211|                        <DocList documents={documents} />
   212|
   213|                        <Button variant="outline" className="w-full font-bold py-6 text-lg border-foreground/20 hover:bg-muted mt-6">
   214|                            <Mail className="mr-2 h-5 w-5" />
   215|                            Agendar Recorrido
   216|                        </Button>
   217|
   218|                        <div className="mt-6 pt-6 border-t border-foreground/10 text-center">
   219|                            <p className="text-xs text-muted-foreground">
   220|                                Operación gestionada como <strong className="text-foreground">{property.business_type}</strong> bajo estrictos estándares de confidencialidad Black Corporativo.
   221|                            </p>
   222|                        </div>
   223|                    </div>
   224|                </div>
   225|            </div>
   226|        </div>
   227|    );
   228|}
   229|