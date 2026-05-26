import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Ruler, Building2, Calendar, ShieldCheck, MapPin, ArrowLeft } from "lucide-react";
import { ImageGallery } from "@/components/public/image-gallery";
import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";
import { DocDownload } from "@/components/public/doc-download";
import { GatedBrochure } from "@/components/public/gated-brochure";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { CONTACT_CONFIG } from "@/lib/contact-config";
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

    // Hide test properties from public view
    const titleLower = (property.title || "").toLowerCase();
    if (titleLower.includes("prueba") || titleLower.includes("test")) {
        return notFound();
    }

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
        return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
    };

    const formatShortPrice = (price: number, currency: string) => {
        if (price >= 1_000_000) {
            return `$${(price / 1_000_000).toFixed(1)} M ${currency}`;
        }
        return `$${price.toLocaleString("es-MX")} ${currency}`;
    };

    const allImages: string[] = [];
    if (property.cover_image) allImages.push(property.cover_image);
    if (property.images && Array.isArray(property.images)) {
        for (const img of property.images) {
            if (!allImages.includes(img)) allImages.push(img);
        }
    }

    // Build documents list
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

    const statusLabels: Record<string, string> = {
        Available: "Disponible",
        Under_Offer: "Bajo Oferta",
        Sold: "Vendido",
        Rented: "Rentado",
    };

    const statusColors: Record<string, string> = {
        Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Under_Offer: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Sold: "bg-red-500/10 text-red-400 border-red-500/20",
        Rented: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };

    return (
        <div className="w-full bg-background min-h-screen">
            {/* ── Full-Bleed Image Gallery ── */}
            <div className="w-full">
                <ImageGallery
                    images={property.images || []}
                    title={property.title}
                    coverImage={property.cover_image}
                />
            </div>

            {/* ── Content: editorial centered ── */}
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                {/* Breadcrumbs + Back */}
                <div className="flex items-center justify-between pt-8 pb-4">
                    <Breadcrumbs items={[
                        { label: "Inventario", href: "/inventario" },
                        { label: property.title },
                    ]} />
                    <Link
                        href="/inventario"
                        className="hidden md:flex items-center gap-1.5 text-sm text-foreground/40 hover:text-gold-500 transition-colors"
                    >
                        <ArrowLeft className="size-3.5" />
                        Volver
                    </Link>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Badge className="bg-gold-500 text-black font-semibold uppercase tracking-wider text-[11px]">
                        {property.business_type}
                    </Badge>
                    <Badge variant="outline" className="uppercase tracking-wider text-[11px] border-foreground/15">
                        {property.property_use}
                    </Badge>
                    <Badge variant="outline" className="uppercase tracking-wider text-[11px] border-foreground/15">
                        {property.property_type}
                    </Badge>
                    {property.is_project && (
                        <Badge className="bg-blue-600 text-white text-[11px] uppercase tracking-wider">Proyecto</Badge>
                    )}
                    <span className={`ml-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusColors[property.status] || "text-foreground/50 border-foreground/15"}`}>
                        {statusLabels[property.status] || property.status}
                    </span>
                </div>

                {/* Title + Price */}
                <h1 className="text-[2rem] md:text-[2.75rem] font-semibold tracking-tight text-foreground leading-[1.08] mb-3">
                    {property.title}
                </h1>
                {property.address && (
                    <div className="flex items-center gap-1.5 text-foreground/40 text-sm mb-4">
                        <MapPin className="size-3.5" />
                        {property.address}
                    </div>
                )}
                <p className="text-[1.75rem] md:text-[2.25rem] font-numerics font-semibold tracking-tight text-gold-500 mb-10">
                    {formatPrice(property.price, property.currency)}
                </p>

                <Separator className="bg-foreground/5" />

                {/* ── Inline Metrics Row ── */}
                <div className="flex flex-wrap items-center gap-8 md:gap-12 py-8 text-sm">
                    {property.m2_terrain ? (
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                                <Ruler className="size-4 text-gold-500" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-foreground/40 font-semibold">Terreno</p>
                                <p className="font-numerics font-semibold text-foreground">{property.m2_terrain.toLocaleString()} m²</p>
                            </div>
                        </div>
                    ) : null}
                    {property.m2_construction ? (
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                                <Building2 className="size-4 text-gold-500" />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-foreground/40 font-semibold">Construcción</p>
                                <p className="font-numerics font-semibold text-foreground">{property.m2_construction.toLocaleString()} m²</p>
                            </div>
                        </div>
                    ) : null}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                            <Calendar className="size-4 text-gold-500" />
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-widest text-foreground/40 font-semibold">Publicado</p>
                            <p className="font-numerics font-semibold text-foreground">
                                {new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                            </p>
                        </div>
                    </div>
                {/* ── Custom Attributes ── */}
                {property.custom_attributes && typeof property.custom_attributes === "object" && Object.keys(property.custom_attributes as Record<string, string>).length > 0 && (
                    <div className="flex flex-wrap items-center gap-8 md:gap-12 py-8 text-sm">
                        {Object.entries(property.custom_attributes as Record<string, string>).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="size-4 text-gold-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-foreground/40 font-semibold">{key}</p>
                                    <p className="font-numerics font-semibold text-foreground">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>

                <Separator className="bg-foreground/5" />

                {/* ── Description ── */}
                <div className="py-10">
                    <h2 className="text-[1.25rem] font-semibold tracking-tight text-foreground mb-5">
                        Descripción
                    </h2>
                    <div className="text-[0.9375rem] text-foreground/60 leading-relaxed whitespace-pre-wrap">
                        {property.description}
                    </div>
                </div>

                {/* ── Video + Tour ── */}
                {(property.video_urls?.length > 0 || property.tour_embeds?.length > 0) && (
                    <>
                        <Separator className="bg-foreground/5" />
                        <div className="py-10 space-y-10">
                            <VideoEmbed urls={property.video_urls || []} />
                            <TourEmbed urls={property.tour_embeds || []} />
                        </div>
                    </>
                )}

                {/* ── Agents ── */}
                {agents.length > 0 && (
                    <>
                        <Separator className="bg-foreground/5" />
                        <div className="py-10">
                            <h2 className="text-[1.25rem] font-semibold tracking-tight text-foreground mb-6">
                                {agents.length === 1 ? "Asesor a Cargo" : "Asesores a Cargo"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {agents.map((agent) => (
                                    <div
                                        key={agent.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-foreground/5 bg-card hover:border-gold-500/20 transition-all duration-300"
                                    >
                                        <div className="size-12 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-semibold shrink-0 border border-gold-500/20 overflow-hidden">
                                            {agent.photo_url ? (
                                                <img src={agent.photo_url} alt={agent.full_name} className="size-full object-cover" />
                                            ) : (
                                                agent.full_name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-foreground text-sm truncate">{agent.full_name}</p>
                                            {agent.license_number && (
                                                <p className="text-[11px] text-foreground/40">Céd. {agent.license_number}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {agent.phone && (
                                                    <a
                                                        href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] text-gold-500 hover:text-gold-400 transition-colors font-medium"
                                                    >
                                                        WhatsApp
                                                    </a>
                                                )}
                                                {agent.email && (
                                                    <a
                                                        href={`mailto:${agent.email}`}
                                                        className="text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors"
                                                    >
                                                        Email
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ── Map ── */}
                {property.address && (
                    <>
                        <Separator className="bg-foreground/5" />
                        <div className="py-10">
                            <h2 className="text-[1.25rem] font-semibold tracking-tight text-foreground mb-4">
                                Ubicación
                            </h2>
                            <p className="text-sm text-foreground/50 mb-4">{property.address}</p>
                            <div className="rounded-2xl overflow-hidden border border-foreground/5 aspect-[16/9] bg-foreground/[0.02]">
                                <iframe
                                    title={`Mapa de ${property.title}`}
                                    width="100%"
                                    height="100%"
                                    loading="lazy"
                                    style={{ border: 0 }}
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed&z=15`}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* ── Documents (gated) ── */}
                {documents.length > 0 && (
                    <>
                        <Separator className="bg-foreground/5" />
                        <div className="py-10">
                            <DocDownload
                                documents={documents}
                                propertyId={property.id}
                                propertyName={property.title}
                            />
                        </div>
                    </>
                )}

                {/* ── CTA Section ── */}
                <Separator className="bg-foreground/5" />
                <div className="py-10">
                    <div className="bg-card border border-foreground/5 rounded-2xl p-8 md:p-10 text-center">
                        <h2 className="text-[1.5rem] font-semibold tracking-tight text-foreground mb-2">
                            ¿Te interesa esta propiedad?
                        </h2>
                        <p className="text-foreground/50 text-sm mb-8 max-w-md mx-auto">
                            Descarga el brochure ejecutivo con información financiera detallada y análisis de mercado.
                        </p>
                        <div className="max-w-sm mx-auto">
                            <GatedBrochure
                                propertyId={property.id}
                                propertyName={property.title}
                                pdfUrl={property.brochure_path || null}
                            />
                        </div>
                        <p className="text-[11px] text-foreground/30 mt-6">
                            Operación gestionada como <strong className="text-foreground/50">{property.business_type}</strong> — Black Corporativo
                        </p>
                    </div>
                </div>

                {/* Spacer */}
                <div className="h-8" />
            </div>

            {/* ── Mobile Sticky CTA ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-foreground/10 p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{property.title}</p>
                    <p className="text-gold-500 font-numerics font-semibold text-sm">{formatShortPrice(property.price, property.currency)}</p>
                </div>
                <a
                    href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-5 py-2.5 bg-gold-500 text-black rounded-full text-sm font-semibold hover:bg-gold-400 transition-colors"
                >
                    Contactar
                </a>
            </div>
        </div>
    );
}
