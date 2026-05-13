import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ruler, Building2, Calendar, ShieldCheck, Mail, Phone, User } from "lucide-react";
import { DocList } from "@/components/public/doc-list";
import { ImageGallery } from "@/components/public/image-gallery";
import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";
import Link from "next/link";

export const revalidate = 60;

type AgentInfo = {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    license_number: string | null;
};

export default async function PropertyDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        return notFound();
    }

    // Fetch assigned agents from junction table
    const { data: assignedAgents } = await supabase
        .from("property_agents")
        .select("agent_id")
        .eq("property_id", id);

    let agents: AgentInfo[] = [];
    if (assignedAgents && assignedAgents.length > 0) {
        const agentIds = assignedAgents.map(pa => pa.agent_id);
        const { data: agentData } = await supabase
            .from("agents")
            .select("id, full_name, email, phone, photo_url, license_number")
            .in("id", agentIds)
            .eq("is_active", true);
        if (agentData) agents = agentData;
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    // Build documents list from both sources
    const documents: { label: string; url: string }[] = [];
    if (property.documents && Array.isArray(property.documents)) {
        documents.push(...property.documents);
    }
    // Backward compat: old brochure_path as a doc if not already in documents
    if (property.brochure_path) {
        const alreadyInDocs = documents.some(d => d.url === property.brochure_path);
        if (!alreadyInDocs) {
            documents.push({ label: "Brochure Ejecutivo", url: property.brochure_path });
        }
    }

    return (
        <div className="w-full bg-background min-h-screen">
            {/* Badges + Title */}
            <div className="container mx-auto px-4 pt-8 md:pt-12">
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gold-500 text-black uppercase tracking-wider">{property.business_type}</Badge>
                    <Badge variant="outline" className="uppercase tracking-wider">{property.property_use}</Badge>
                    <Badge variant="outline" className="uppercase tracking-wider">{property.property_type}</Badge>
                    {property.is_project && <Badge className="bg-blue-600 text-white">Proyecto VIP</Badge>}
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2 max-w-4xl leading-tight">
                    {property.title}
                </h1>
                <p className="text-2xl md:text-3xl font-numerics font-bold text-gold-500 mb-8">
                    {formatPrice(property.price, property.currency)}
                </p>
            </div>

            {/* Image Gallery */}
            <div className="container mx-auto px-4 mb-12">
                <ImageGallery
                    images={property.images || []}
                    title={property.title}
                    coverImage={property.cover_image}
                />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Overview Metrics */}
                    <div className="bg-muted/30 p-8 rounded-2xl border border-foreground/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-foreground/10">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Ruler className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Terreno</p>
                            <p className="font-numerics font-bold text-xl">{property.m2_terrain ? `${property.m2_terrain} m²` : "N/D"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Building2 className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Construcción</p>
                            <p className="font-numerics font-bold text-xl">{property.m2_construction ? `${property.m2_construction} m²` : "N/D"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Publicado</p>
                            <p className="font-numerics font-bold text-lg">
                                {new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <ShieldCheck className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Estatus</p>
                            <p className="font-bold text-lg text-emerald-500">Verificado</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4 mb-6">Descripción de la Propiedad</h2>
                        <div className="prose prose-invert prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {property.description}
                        </div>
                    </div>

                    {/* Embedded Video */}
                    <VideoEmbed urls={property.video_urls || []} />

                    {/* Embedded 360 Tour */}
                    <TourEmbed urls={property.tour_embeds || []} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Agent Cards */}
                    {agents.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">
                                {agents.length === 1 ? "Asesor a Cargo" : "Asesores a Cargo"}
                            </h3>
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="bg-card border border-foreground/10 rounded-2xl p-5 shadow-lg shadow-black/30"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-xl font-bold shrink-0 border-2 border-gold-500/20">
                                            {agent.photo_url ? (
                                                <img
                                                    src={agent.photo_url}
                                                    alt={agent.full_name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                agent.full_name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-foreground text-base truncate">{agent.full_name}</p>
                                            {agent.license_number && (
                                                <p className="text-xs text-foreground/50">Céd. {agent.license_number}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {agent.email && (
                                            <a
                                                href={`mailto:${agent.email}`}
                                                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
                                            >
                                                <Mail className="w-3.5 h-3.5 text-gold-500/70" />
                                                {agent.email}
                                            </a>
                                        )}
                                        {agent.phone && (
                                            <a
                                                href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
                                            >
                                                <Phone className="w-3.5 h-3.5 text-gold-500/70" />
                                                {agent.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-background border border-foreground/10 p-8 rounded-2xl sticky top-24 shadow-2xl shadow-black/50">
                        <h3 className="text-xl font-bold mb-2">¿Te interesa esta propiedad?</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Descarga los documentos sin restricciones.
                        </p>

                        <DocList documents={documents} />

                        <Button variant="outline" className="w-full font-bold py-6 text-lg border-foreground/20 hover:bg-muted mt-6">
                            <Mail className="mr-2 h-5 w-5" />
                            Agendar Recorrido
                        </Button>

                        <div className="mt-6 pt-6 border-t border-foreground/10 text-center">
                            <p className="text-xs text-muted-foreground">
                                Operación gestionada como <strong className="text-foreground">{property.business_type}</strong> bajo estrictos estándares de confidencialidad Black Corporativo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
