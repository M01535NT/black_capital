import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ImageGallery } from "@/components/public/image-gallery";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyMetrics } from "@/components/property/PropertyMetrics";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { PropertyMedia } from "@/components/property/PropertyMedia";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { PropertySidebar } from "@/components/property/PropertySidebar";
import { StickyContactBar } from "@/components/property/StickyContactBar";
import { PropertyJsonLd } from "@/components/property/PropertyJsonLd";
import { MortgageCalculator } from "@/components/tools/mortgage-calculator";
import { FavoriteButton } from "@/components/property/favorite-button";
import { FadeIn } from "@/components/ui/motion";

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
    property_use: string;
    m2_terrain: number | null;
    m2_construction: number | null;
};

const SECTION_HEADING =
    "font-display text-xs font-bold uppercase tracking-wide-display text-foreground/50";

const SECTION_DIVIDER = "h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
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

export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const propertyQuery = supabase
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

    // Parallelize the two lookups that depend on property.id / property.property_use.
    // The agents-in-agents fetch must remain sequential (depends on property_agents result).
    const [propertyAgentsRes, similarRes] = await Promise.all([
        supabase
            .from("property_agents")
            .select("agent_id")
            .eq("property_id", property.id),
        property.property_use
            ? supabase
                .from("properties")
                .select("id, slug, title, price, currency, cover_image, business_type, property_use, m2_terrain, m2_construction")
                .eq("property_use", property.property_use)
                .eq("status", "Available")
                .neq("id", property.id)
                .order("created_at", { ascending: false })
                .limit(3)
            : Promise.resolve({ data: [] as SimilarProperty[] | null, error: null }),
    ]);

    const assignedAgents = propertyAgentsRes.data;
    const similar: SimilarProperty[] = similarRes.data || [];

    let agents: AgentInfo[] = [];
    if (assignedAgents && assignedAgents.length > 0) {
        const agentIds = assignedAgents.map((pa: { agent_id: string }) => pa.agent_id);
        const { data: agentData } = await supabase
            .from("agents")
            .select("id, full_name, email, phone, photo_url, license_number")
            .in("id", agentIds)
            .eq("is_active", true);
        if (agentData) agents = agentData as AgentInfo[];
    }

    const documents: { label: string; url: string }[] = [];
    if (property.documents && Array.isArray(property.documents)) {
        for (const d of property.documents) {
            if (d && typeof d === "object" && d.url) {
                documents.push({ label: d.label || "Documento", url: d.url });
            }
        }
    }
    if (property.brochure_path) {
        const alreadyInDocs = documents.some((d) => d.url === property.brochure_path);
        if (!alreadyInDocs) documents.push({ label: "Brochure Ejecutivo", url: property.brochure_path });
    }

    const customAttrs: Record<string, string> = {};
    if (property.custom_attributes && typeof property.custom_attributes === "object") {
        Object.assign(customAttrs, property.custom_attributes);
    }

    const whatsappNumber = agents.length > 0 && agents[0]?.phone
        ? agents[0].phone.replace(/[^0-9]/g, "")
        : CONTACT_CONFIG.phoneRaw;

    const whatsappMessage = encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}`);
    const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <>
            <PropertyJsonLd
                title={property.title}
                description={property.description || `${property.property_type} en ${property.address}`}
                address={property.address || ""}
                coverImage={property.cover_image}
                price={property.price}
                currency={property.currency}
                priceMxn={property.price_mxn}
                businessType={property.business_type}
                propertyType={property.property_type}
                m2Construction={property.m2_construction}
                m2Terrain={property.m2_terrain}
                agents={agents}
                url={`/inventario/${slug}`}
            />
            
            {/* Fondo decorativo global similar al Home */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.08,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-gold-500)/0.05,_transparent_40%)]" />
                <div className="grain-overlay opacity-[0.03]" />
            </div>

            <div className="relative z-10 w-full bg-background min-h-screen">
                {/* Galería Full Width sin Hero encima - Borde inferior decorativo */}
                <section className="w-full border-b border-white/[0.06]">
                    <ImageGallery
                        images={property.images || []}
                        title={property.title}
                        coverImage={property.cover_image}
                    />
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 md:space-y-16">
                    
                    {/* Breadcrumbs y Actions con FadeIn */}
                    <FadeIn direction="up" delay={0.1}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <Breadcrumbs
                                items={[
                                    { label: "Inventario", href: "/inventario" },
                                    { label: property.business_type, href: `/inventario?business=${encodeURIComponent(property.business_type)}` },
                                    { label: property.title },
                                ]}
                            />
                            <div className="flex items-center gap-2">
                                <FavoriteButton
                                    propertyId={property.id}
                                    variant="pill"
                                />
                                <Link
                                    href="/inventario"
                                    className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-gold-500 transition-colors shrink-0 font-display uppercase tracking-wider"
                                >
                                    <ArrowLeft className="size-3" />
                                    Volver
                                </Link>
                            </div>
                        </div>
                    </FadeIn>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* LEFT COLUMN */}
                        <div className="flex-1 min-w-0 space-y-12 md:space-y-16">
                            
                            <FadeIn direction="up" delay={0.2}>
                                <PropertyHeader
                                    businessType={property.business_type}
                                    propertyUse={property.property_use}
                                    propertyType={property.property_type}
                                    isProject={property.is_project}
                                    status={property.status}
                                    title={property.title}
                                    address={property.address}
                                    price={property.price}
                                    currency={property.currency}
                                    priceMxn={property.price_mxn}
                                />
                            </FadeIn>

                            <FadeIn direction="up" delay={0.3}>
                                <PropertyMetrics
                                    m2Terrain={property.m2_terrain}
                                    m2Construction={property.m2_construction}
                                    customAttributes={customAttrs}
                                    propertyType={property.property_type}
                                    createdAt={property.created_at}
                                />
                            </FadeIn>

                            <FadeIn direction="up" delay={0.4}>
                                {property.description && <PropertyDescription description={property.description} />}
                            </FadeIn>

                            {(property.video_urls?.length || property.tour_embeds?.length) ? (
                                <FadeIn direction="up" delay={0.5}>
                                    <PropertyMedia
                                        videoUrls={property.video_urls}
                                        tourEmbeds={property.tour_embeds}
                                    />
                                </FadeIn>
                            ) : null}

                            {property.address && (
                                <FadeIn direction="up" delay={0.6}>
                                    <PropertyLocation address={property.address} title={property.title} />
                                </FadeIn>
                            )}

                            {/* Mortgage Calculator — only for sale properties */}
                            {property.business_type === "Venta" && (
                                <FadeIn direction="up" delay={0.7}>
                                    <MortgageCalculator
                                        price={property.price}
                                        currency={property.currency}
                                        businessType={property.business_type}
                                    />
                                </FadeIn>
                            )}

                            {similar.length > 0 && (
                                <FadeIn direction="up" delay={0.8}>
                                    <section className="space-y-6 pt-8 border-t border-white/[0.06]">
                                        <h2 className={SECTION_HEADING}>Propiedades Similares</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {similar.map((sp, i) => (
                                                <PropertyCard
                                                    key={sp.id}
                                                    property={sp}
                                                    variant="similar"
                                                    index={i}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                </FadeIn>
                            )}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:w-[380px] xl:w-[400px] shrink-0">
                            <div className="sticky top-24 space-y-8">
                                <FadeIn direction="left" delay={0.4}>
                                    <PropertySidebar
                                        agents={agents}
                                        property={{
                                            id: property.id,
                                            m2_terrain: property.m2_terrain,
                                            m2_construction: property.m2_construction,
                                            property_type: property.property_type,
                                            business_type: property.business_type,
                                            property_use: property.property_use,
                                        }}
                                        documents={documents}
                                        whatsappHref={whatsappHref}
                                    />
                                </FadeIn>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky bottom contact bar — mobile only */}
                <StickyContactBar
                    propertyId={property.id}
                    agentPhone={agents?.[0]?.phone}
                    agentEmail={agents?.[0]?.email}
                    agentWhatsapp={CONTACT_CONFIG.phoneRaw}
                    propertyTitle={property.title}
                />

                {/* Spacer for sticky mobile CTA */}
                <div className="lg:hidden h-20" />
            </div>
        </>
    );
}
