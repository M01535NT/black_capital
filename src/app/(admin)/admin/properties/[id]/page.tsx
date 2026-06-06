import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Ruler, Building2, Calendar, ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DocDownload } from "@/components/public/doc-download";
import { ImageGallery } from "@/components/public/image-gallery";

export const revalidate = 0;

export default async function AdminPropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdminSession();
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        notFound();
    }

    // Fetch assigned agents
    const { data: assignments } = await supabase
        .from("property_agents")
        .select("agent_id")
        .eq("property_id", id);

    let agents: { id: string; full_name: string; email: string | null; phone: string | null }[] = [];
    if (assignments && assignments.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase property_agents row
        const agentIds = assignments.map((a: any) => a.agent_id);
        const { data: agentData } = await supabase
            .from("agents")
            .select("id, full_name, email, phone")
            .in("id", agentIds)
            .eq("is_active", true);
        if (agentData) agents = agentData;
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    const statusColors: Record<string, string> = {
        Available: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Under_Offer: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Sold: "bg-red-500/10 text-red-500 border-red-500/20",
        Rented: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };

    // Documents — validate each entry
    const documents: { label: string; url: string }[] = [];
    if (property.documents && Array.isArray(property.documents)) {
        for (const d of property.documents) {
            if (d && typeof d === "object" && d.url) {
                documents.push({ label: d.label || "Documento", url: d.url });
            }
        }
    }
    if (property.brochure_path) {
        if (!documents.some(d => d.url === property.brochure_path)) {
            documents.push({ label: "Brochure Ejecutivo", url: property.brochure_path });
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/properties">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-display-4 font-display font-semibold tracking-wide uppercase text-2xl text-foreground truncate max-w-xl">
                            {property.title}
                        </h2>
                        <p className="text-foreground/50 text-sm">
                            Creado {new Date(property.created_at).toLocaleDateString("es-MX", { dateStyle: "long" })}
                            {property.updated_at !== property.created_at && (
                                <> · Actualizado {new Date(property.updated_at).toLocaleDateString("es-MX", { dateStyle: "long" })}</>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/inventario/${property.slug || property.id}`} target="_blank">
                        <Button variant="outline" className="gap-2 border-foreground/20">
                            <ExternalLink className="w-4 h-4" /> Ver Página Pública
                        </Button>
                    </Link>
                    <Link href={`/admin/properties/${property.id}/edit`}>
                        <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
                            <Edit className="w-4 h-4" /> Editar
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
                <Badge className="bg-gold-500 text-black uppercase tracking-wider">{property.business_type}</Badge>
                <Badge variant="outline" className="uppercase tracking-wider">{property.property_use}</Badge>
                <Badge variant="outline" className="uppercase tracking-wider">{property.property_type}</Badge>
                <Badge variant="outline" className={statusColors[property.status] || ""}>
                    {property.status === "Available" ? "Disponible"
                        : property.status === "Under_Offer" ? "Bajo Oferta"
                        : property.status === "Sold" ? "Vendido"
                        : property.status === "Rented" ? "Rentado"
                        : property.status}
                </Badge>
                {property.is_project && <Badge className="bg-blue-600 text-white">Proyecto VIP</Badge>}
                {property.is_featured && <Badge className="bg-gold-500/20 text-gold-500 border border-gold-500/30">Destacada</Badge>}
                {property.is_assignment && <Badge className="bg-purple-500/20 text-purple-500">Cesión</Badge>}
            </div>

            {/* Price */}
            <p className="text-3xl font-numerics font-bold text-gold-500">
                {formatPrice(property.price, property.currency)}
                {property.business_type === "Renta" && (
                    <span className="text-base text-foreground/50 font-normal"> /mes</span>
                )}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Images + Description */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Images */}
                    <ImageGallery
                        images={property.images || []}
                        title={property.title}
                        coverImage={property.cover_image}
                    />

                    {/* Metrics */}
                    <div className="bg-muted/30 p-6 rounded-2xl border border-foreground/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <Ruler className="text-gold-500 w-5 h-5" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Terreno</span>
                            <span className="font-numerics font-bold">{property.m2_terrain ? `${property.m2_terrain} m²` : "N/D"}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <Building2 className="text-gold-500 w-5 h-5" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Construcción</span>
                            <span className="font-numerics font-bold">{property.m2_construction ? `${property.m2_construction} m²` : "N/D"}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <Calendar className="text-gold-500 w-5 h-5" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Publicado</span>
                            <span className="font-numerics font-bold text-sm">
                                {new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <ShieldCheck className="text-gold-500 w-5 h-5" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Estatus</span>
                            <span className="font-bold text-sm text-emerald-500">Verificado</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-bold border-b border-foreground/10 pb-3 mb-4">Descripción</h3>
                        <div className="text-foreground/70 whitespace-pre-wrap leading-relaxed text-sm">
                            {property.description || "Sin descripción."}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Assigned Agents */}
                    <div className="bg-card border border-foreground/10 rounded-2xl p-5">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                            Asesores Asignados
                        </h3>
                        {agents.length > 0 ? (
                            <div className="space-y-3">
                                {agents.map((agent) => (
                                    <div key={agent.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-sm font-bold shrink-0">
                                            {agent.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm truncate">{agent.full_name}</p>
                                            {agent.email && (
                                                <p className="text-xs text-foreground/50 truncate">{agent.email}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-foreground/50">Sin asesores asignados.</p>
                        )}
                        <Link href={`/admin/properties/${property.id}/edit`}>
                            <Button variant="outline" size="sm" className="w-full mt-4 text-xs border-foreground/10">
                                Gestionar Asesores
                            </Button>
                        </Link>
                    </div>

                    {/* Documents */}
                    {documents.length > 0 && (
                        <div className="bg-card border border-foreground/10 rounded-2xl p-5">
                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                Documentos
                            </h3>
                            <div className="space-y-2">
                                {documents.map((doc, i) => (
                                    <a
                                        key={i}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
                                        {doc.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-card border border-foreground/10 rounded-2xl p-5">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-3">
                            Metadatos
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-foreground/50">ID</span>
                                <span className="text-foreground/70 font-sans tabular-nums text-xs">{property.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/50">Slug</span>
                                <span className="text-foreground/70 text-xs truncate max-w-[180px]">{property.slug}</span>
                            </div>
                            {property.m2_terrain && (
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Terreno</span>
                                    <span className="font-numerics">{property.m2_terrain.toLocaleString()} m²</span>
                                </div>
                            )}
                            {property.m2_construction && (
                                <div className="flex justify-between">
                                    <span className="text-foreground/50">Construcción</span>
                                    <span className="font-numerics">{property.m2_construction.toLocaleString()} m²</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
