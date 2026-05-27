import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Ruler, Building2, Calendar, ShieldCheck, MapPin, ArrowLeft, MessageCircle, Mail, Phone, Download, FileText, Eye, Bed, Bath, Layers, Car, ArrowUpRight } from "lucide-react";
import { ImageGallery } from "@/components/public/image-gallery";
import { VideoEmbed } from "@/components/public/video-embed";
import { TourEmbed } from "@/components/public/tour-embed";
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

type SimilarProperty = {
    id: string;
    slug: string | null;
    title: string;
    price: number;
    currency: string;
    cover_image: string | null;
    business_type: string;
    m2_construction: number | null;
};

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    let { data: property } = await supabase
        .from("properties")
        .select("title, description, cover_image")
        .eq("slug", slug)
        .single();

    if (!property && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        const fallback = await supabase
            .from("properties")
            .select("title, description, cover_image")
            .eq("id", slug)
            .single();
        property = fallback.data;
    }

    if (!property) {
        return { title: "Propiedad no encontrada | Black Corporativo" };
    }

    return {
        title: `${property.title} | Black Corporativo`,
        description: (property.description || `Propiedad en venta: ${property.title}`).slice(0, 160),
        openGraph: property.cover_image ? { images: [{ url: property.cover_image }] } : undefined,
    };
}

const STATUS_LABELS: Record<string, string> = {
    Available: "Disponible",
    Under_Offer: "Bajo Oferta",
    Sold: "Vendido",
    Rented: "Rentado",
};

const STATUS_COLORS: Record<string, string> = {
    Available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Under_Offer: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Sold: "bg-red-500/10 text-red-400 border-red-500/20",
    Rented: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

// ── Icons for property attributes ──
const attributeIcons: Record<string, React.ReactNode> = {
    habitaciones: <Bed className="size-4" />,
    dormitorios: <Bed className="size-4" />,
    recamaras: <Bed className="size-4" />,
    baños: <Bath className="size-4" />,
    banos: <Bath className="size-4" />,
    pisos: <Layers className="size-4" />,
    niveles: <Layers className="size-4" />,
    estacionamiento: <Car className="size-4" />,
    cajones: <Car className="size-4" />,
};

export default async function PropertyDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    let propertyQuery = supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .single();

    let { data: property, error } = await propertyQuery;

    if (!property && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
        const fallback = await supabase
            .from("properties")
            .select("*")
            .eq("id", slug)
            .single();
        property = fallback.data;
        error = fallback.error;
    }

    if (error || !property) return notFound();

    const titleLower = (property.title || "").toLowerCase();
    if (titleLower.includes("prueba") || titleLower.includes("test")) return notFound();

    // ── Agents ──
    const { data: assignedAgents } = await supabase
        .from("property_agents")
        .select("agent_id")
        .eq("property_id", property.id);

    let agents: AgentInfo[] = [];
    if (assignedAgents && assignedAgents.length > 0) {
        const agentIds = assignedAgents.map((pa: any) => pa.agent_id);
        const { data: agentData } = await supabase
            .from("agents")
            .select("id, full_name, email, phone, photo_url, license_number")
            .in("id", agentIds)
            .eq("is_active", true);
        if (agentData) agents = agentData;
    }

    // ── Similar properties ──
    let similar: SimilarProperty[] = [];
    if (property.property_use) {
        const { data: similarData } = await supabase
            .from("properties")
            .select("id, slug, title, price, currency, cover_image, business_type, m2_construction")
            .eq("property_use", property.property_use)
            .eq("status", "Available")
            .neq("id", property.id)
            .not("title", "ilike", "%prueba%")
            .not("title", "ilike", "%test%")
            .order("created_at", { ascending: false })
            .limit(3);
        if (similarData) similar = similarData;
    }

    // ── Documents ──
    const documents: { label: string; url: string }[] = [];
    if (property.documents && Array.isArray(property.documents)) {
        for (const d of property.documents) {
            if (d && typeof d === "object" && d.url) {
                documents.push({ label: d.label || "Documento", url: d.url });
            }
        }
    }
    if (property.brochure_path) {
        const alreadyInDocs = documents.some(d => d.url === property.brochure_path);
        if (!alreadyInDocs) documents.push({ label: "Brochure Ejecutivo", url: property.brochure_path });
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
    };

    const formatShortPrice = (price: number, currency: string) => {
        if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)} M ${currency}`;
        return `$${price.toLocaleString("es-MX")} ${currency}`;
    };

    const hasMedia = (property.video_urls?.length > 0 || property.tour_embeds?.length > 0);

    // ── Custom attributes with icons ──
    const customAttrs: Record<string, string> = {};
    if (property.custom_attributes && typeof property.custom_attributes === "object") {
        Object.assign(customAttrs, property.custom_attributes);
    }

    return (
        <div className="w-full bg-background min-h-screen">
            {/* ─── FULL-BLEED GALLERY ─── */}
            <ImageGallery
                images={property.images || []}
                title={property.title}
                coverImage={property.cover_image}
            />

            {/* ── Back navigation (desktop) ── */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6">
                <div className="flex items-center justify-between">
                    <Breadcrumbs items={[
                        { label: "Inventario", href: "/inventario" },
                        { label: property.title },
                    ]} />
                    <Link
                        href="/inventario"
                        className="hidden md:inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-gold-500 transition-colors shrink-0"
                    >
                        <ArrowLeft className="size-3.5" />
                        Volver al inventario
                    </Link>
                </div>
            </div>

            {/* ─── MAIN LAYOUT: 2 columns ─── */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* ═══════════════ COLUMNA PRINCIPAL ═══════════════ */}
                    <div className="flex-1 min-w-0 space-y-8">

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-gold-500 text-black font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5">
                                {property.business_type}
                            </Badge>
                            <Badge variant="outline" className="uppercase tracking-wider text-[10px] border-foreground/15 px-2.5 py-0.5">
                                {property.property_use}
                            </Badge>
                            <Badge variant="outline" className="uppercase tracking-wider text-[10px] border-foreground/15 px-2.5 py-0.5">
                                {property.property_type}
                            </Badge>
                            {property.is_project && (
                                <Badge className="bg-blue-600 text-white text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                                    Proyecto
                                </Badge>
                            )}
                            <span className={`ml-auto text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[property.status] || "text-foreground/50 border-foreground/15"}`}>
                                {STATUS_LABELS[property.status] || property.status}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-display text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold uppercase tracking-wider text-foreground leading-[1.08]">
                            {property.title}
                        </h1>

                        {/* Address */}
                        {property.address && (
                            <div className="flex items-start gap-2 text-foreground/40 text-sm -mt-4">
                                <MapPin className="size-4 mt-0.5 shrink-0" />
                                <span>{property.address}</span>
                            </div>
                        )}

                        {/* Price — prominent */}
                        <div className="flex items-baseline gap-3">
                            <p className="text-[2rem] md:text-[2.5rem] font-numerics font-semibold tracking-tight text-gold-500">
                                {formatPrice(property.price, property.currency)}
                            </p>
                            {property.price_mxn && property.currency !== "MXN" && (
                                <span className="text-sm text-foreground/40">
                                    ≈ {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(property.price_mxn)}
                                </span>
                            )}
                        </div>

                        <Separator className="bg-foreground/5" />

                        {/* ── Premium Metrics ── */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {property.m2_terrain ? (
                                <MetricCard icon={<Ruler className="size-4 text-gold-500" />} label="Terreno" value={`${property.m2_terrain.toLocaleString()} m²`} />
                            ) : null}
                            {property.m2_construction ? (
                                <MetricCard icon={<Building2 className="size-4 text-gold-500" />} label="Construcción" value={`${property.m2_construction.toLocaleString()} m²`} />
                            ) : null}
                            {Object.entries(customAttrs).map(([key, value]) => (
                                <MetricCard
                                    key={key}
                                    icon={attributeIcons[key.toLowerCase()] || <ShieldCheck className="size-4 text-gold-500" />}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={value}
                                />
                            ))}
                            <MetricCard
                                icon={<Calendar className="size-4 text-gold-500" />}
                                label="Publicado"
                                value={new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                            />
                            {property.property_type && (
                                <MetricCard
                                    icon={<ShieldCheck className="size-4 text-gold-500" />}
                                    label="Tipo"
                                    value={property.property_type}
                                />
                            )}
                        </div>

                        <Separator className="bg-foreground/5" />

                        {/* ── Description ── */}
                        {property.description && (
                            <section>
                                <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-foreground mb-4">
                                    Descripción
                                </h2>
                                <div className="text-[0.9375rem] text-foreground/60 leading-relaxed whitespace-pre-wrap space-y-4">
                                    {property.description}
                                </div>
                            </section>
                        )}

                        {/* ── Video + Tour ── */}
                        {hasMedia && (
                            <>
                                <Separator className="bg-foreground/5" />
                                <div className="space-y-8">
                                    <VideoEmbed urls={property.video_urls || []} />
                                    <TourEmbed urls={property.tour_embeds || []} />
                                </div>
                            </>
                        )}

                        {/* ── Map ── */}
                        {property.address && (
                            <>
                                <Separator className="bg-foreground/5" />
                                <section>
                                    <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-foreground mb-4">
                                        Ubicación
                                    </h2>
                                    <div className="rounded-2xl overflow-hidden border border-foreground/5 aspect-[16/7] md:aspect-[21/9] bg-foreground/[0.02]">
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
                                </section>
                            </>
                        )}

                        {/* ── Similar Properties ── */}
                        {similar.length > 0 && (
                            <>
                                <Separator className="bg-foreground/5" />
                                <section>
                                    <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-foreground mb-5">
                                        Propiedades Similares
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {similar.map((sp) => (
                                            <Link
                                                key={sp.id}
                                                href={`/inventario/${sp.slug || sp.id}`}
                                                className="group block bg-card border border-foreground/5 rounded-2xl overflow-hidden hover:border-gold-500/30 hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.12)] transition-all duration-500"
                                            >
                                                <div className="aspect-[4/3] relative overflow-hidden bg-foreground/[0.03]">
                                                    {sp.cover_image ? (
                                                        <img
                                                            src={sp.cover_image}
                                                            alt={sp.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-foreground/15 text-xs font-medium uppercase tracking-wider">Sin imagen</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gold-500 text-black rounded-full">
                                                            {sp.business_type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider leading-snug line-clamp-2 group-hover:text-gold-500 transition-colors mb-2">
                                                        {sp.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[11px] text-foreground/40 font-medium uppercase tracking-wider">
                                                            {sp.m2_construction ? `${sp.m2_construction.toLocaleString()} m²` : ""}
                                                        </span>
                                                        <span className="text-sm font-semibold font-numerics text-gold-500 whitespace-nowrap">
                                                            {formatShortPrice(sp.price, sp.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    {/* ═══════════════ SIDEBAR ═══════════════ */}
                    <div className="lg:w-[340px] shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-5">

                            {/* ── Agent Card ── */}
                            {agents.length > 0 && (
                                <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-4">
                                    <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-foreground/40">
                                        {agents.length === 1 ? "Asesor a Cargo" : "Asesores a Cargo"}
                                    </h3>
                                    {agents.map((agent) => (
                                        <div key={agent.id} className="flex items-start gap-4">
                                            <div className="size-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-semibold shrink-0 border border-gold-500/20 overflow-hidden">
                                                {agent.photo_url ? (
                                                    <img src={agent.photo_url} alt={agent.full_name} className="size-full object-cover" />
                                                ) : (
                                                    <span className="text-lg">{agent.full_name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <p className="font-semibold text-foreground text-sm leading-tight">{agent.full_name}</p>
                                                {agent.license_number && (
                                                    <p className="text-[11px] text-foreground/40 uppercase tracking-wider">Céd. {agent.license_number}</p>
                                                )}
                                                <div className="flex flex-col gap-1.5 pt-1">
                                                    {agent.phone && (
                                                        <a
                                                            href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors w-fit"
                                                        >
                                                            <MessageCircle className="size-3" />
                                                            WhatsApp
                                                        </a>
                                                    )}
                                                    {agent.email && (
                                                        <a
                                                            href={`mailto:${agent.email}`}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/50 border border-foreground/10 text-xs font-medium hover:text-foreground/70 hover:border-foreground/20 transition-colors w-fit"
                                                        >
                                                            <Mail className="size-3" />
                                                            Email
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Property Specs Card ── */}
                            <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-3">
                                <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-foreground/40">
                                    Ficha Técnica
                                </h3>
                                <div className="space-y-2.5">
                                    {property.m2_terrain && (
                                        <SpecRow label="Terreno" value={`${property.m2_terrain.toLocaleString()} m²`} />
                                    )}
                                    {property.m2_construction && (
                                        <SpecRow label="Construcción" value={`${property.m2_construction.toLocaleString()} m²`} />
                                    )}
                                    {property.property_type && (
                                        <SpecRow label="Tipo" value={property.property_type} />
                                    )}
                                    {property.business_type && (
                                        <SpecRow label="Operación" value={property.business_type} />
                                    )}
                                    {property.property_use && (
                                        <SpecRow label="Uso" value={property.property_use} />
                                    )}
                                    <SpecRow label="ID" value={property.id?.slice(0, 8) || "—"} mono />
                                </div>
                            </div>

                            {/* ── Documents ── */}
                            {documents.length > 0 && (
                                <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-4">
                                    <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-foreground/40">
                                        Documentos
                                    </h3>
                                    <div className="space-y-2">
                                        {documents.map((doc, i) => (
                                            <a
                                                key={i}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-xl border border-foreground/5 hover:border-gold-500/20 hover:bg-gold-500/[0.03] transition-all group"
                                            >
                                                <div className="size-9 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
                                                    <FileText className="size-4 text-gold-500" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-gold-500 transition-colors">
                                                        {doc.label}
                                                    </p>
                                                    <p className="text-[11px] text-foreground/40 uppercase tracking-wider">PDF</p>
                                                </div>
                                                <ArrowUpRight className="size-3.5 text-foreground/30 group-hover:text-gold-500 transition-colors shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Contact CTA ── */}
                            <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--color-gold-500)/0.04,_transparent_60%)]" />
                                <div className="relative z-10 space-y-4">
                                    <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-foreground/40">
                                        ¿Te interesa?
                                    </h3>
                                    <p className="text-sm text-foreground/50 leading-relaxed">
                                        Solicita información detallada o agenda una visita.
                                    </p>
                                    <div className="space-y-2">
                                        {agents.length > 0 && agents[0]?.phone ? (
                                            <a
                                                href={`https://wa.me/${agents[0].phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/25"
                                            >
                                                <MessageCircle className="size-4" />
                                                Contactar por WhatsApp
                                            </a>
                                        ) : (
                                            <a
                                                href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/25"
                                            >
                                                <MessageCircle className="size-4" />
                                                Contactar por WhatsApp
                                            </a>
                                        )}
                                        {property.brochure_path && (
                                            <GatedBrochure
                                                propertyId={property.id}
                                                propertyName={property.title}
                                                pdfUrl={property.brochure_path}
                                                label="Descargar Brochure Ejecutivo"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile Sticky CTA ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-xl border-t border-foreground/10">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-numerics font-semibold text-gold-500 text-lg">
                            {formatPrice(property.price, property.currency)}
                        </p>
                    </div>
                    {agents.length > 0 && agents[0]?.phone ? (
                        <a
                            href={`https://wa.me/${agents[0].phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola, me interesa: ${property.title}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors shrink-0 shadow-lg shadow-gold-500/25"
                        >
                            <MessageCircle className="size-4" />
                            Contactar
                        </a>
                    ) : (
                        <a
                            href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(`Hola, me interesa: ${property.title}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors shrink-0 shadow-lg shadow-gold-500/25"
                        >
                            <MessageCircle className="size-4" />
                            Contactar
                        </a>
                    )}
                </div>
            </div>

            {/* Spacer for sticky mobile CTA */}
            <div className="lg:hidden h-20" />
        </div>
    );
}

// ── Helper Components ──

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-foreground/5 hover:border-gold-500/15 transition-all duration-300">
            <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-foreground/40 font-semibold">{label}</p>
                <p className="font-numerics font-semibold text-foreground text-sm">{value}</p>
            </div>
        </div>
    );
}

function SpecRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-foreground/40 uppercase tracking-wider">{label}</span>
            <span className={`text-sm font-medium text-foreground text-right ${mono ? "font-mono text-xs" : ""}`}>
                {value}
            </span>
        </div>
    );
}
