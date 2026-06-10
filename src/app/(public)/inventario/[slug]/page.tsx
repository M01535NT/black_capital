import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
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
import { FavoriteButton } from "@/components/property/favorite-button";
import { FadeIn } from "@/components/ui/motion";

import { CONTACT_CONFIG } from "@/lib/contact-config";
import { getPropertyDocuments, toVisibleDocuments } from "@/lib/document-access";
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
    "property-tag-type text-white/48";

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
        return { title: "Propiedad no encontrada | Black Capital" };
    }

    return {
        title: `${property.title} en Tijuana | Black Capital`,
        description: (property.description || `Propiedad en venta en Tijuana: ${property.title}`).slice(0, 160),
        openGraph: property.cover_image ? { images: [{ url: property.cover_image, alt: property.title }] } : undefined,
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

    const documents = toVisibleDocuments(getPropertyDocuments(property));

    const customAttrs: Record<string, string> = {};
    if (property.custom_attributes && typeof property.custom_attributes === "object") {
        Object.assign(customAttrs, property.custom_attributes);
    }

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
            
            <div className="min-h-screen w-full overflow-x-hidden bg-background">
                <section className="w-full overflow-x-clip border-b border-white/[0.06] pt-20 lg:pt-28">
                    <div className="mx-auto max-w-[90rem] min-w-0 px-4 pb-5 pt-4 sm:px-10 sm:pt-6 lg:px-16">
                        <ImageGallery
                            images={property.images || []}
                            title={property.title}
                            coverImage={property.cover_image}
                            propertyUse={property.property_use}
                        />
                    </div>
                </section>

                <div className="mx-auto max-w-[90rem] space-y-8 px-4 py-8 sm:px-10 md:space-y-10 md:py-16 lg:px-16">
                    
                    <FadeIn direction="up" delay={0.1}>
                        <div className="grid grid-cols-1 gap-4 sm:flex sm:items-center sm:justify-between">
                            <div className="min-w-0 overflow-hidden">
                                <Breadcrumbs
                                    items={[
                                        { label: "Inventario", href: "/inventario" },
                                        { label: property.business_type, href: `/inventario?business=${encodeURIComponent(property.business_type)}` },
                                        { label: property.title },
                                    ]}
                                />
                            </div>
                            <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
                                <FavoriteButton
                                    propertyId={property.id}
                                    variant="pill"
                                    className="flex-1 justify-center sm:flex-none"
                                />
                            </div>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                        <div className="min-w-0 space-y-10 md:space-y-16 lg:col-span-8">
                            
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
                                {property.description && (
                                    <div className="border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
                                        <PropertyDescription description={property.description} />
                                    </div>
                                )}
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

                            {similar.length > 0 && (
                                <FadeIn direction="up" delay={0.8}>
                                    <section className="space-y-6 border-t border-white/[0.06] pt-8">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="h-px w-10 bg-[var(--color-accent)]/60" aria-hidden="true" />
                                                <h2 className={SECTION_HEADING}>Propiedades Similares</h2>
                                            </div>
                                                <Link
                                                href={`/inventario?uso=${encodeURIComponent(property.property_use)}`}
                                                className="property-tag-type text-[var(--color-accent)]"
                                            >
                                                Ver inventario
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

                        <div className="lg:col-span-4">
                            <div className="space-y-8 lg:sticky lg:top-24">
                                <FadeIn direction="up" delay={0.4}>
                                    <PropertySidebar
                                        agents={agents}
                                        property={{
                                            id: property.id,
                                            title: property.title,
                                            m2_terrain: property.m2_terrain,
                                            m2_construction: property.m2_construction,
                                            property_type: property.property_type,
                                            business_type: property.business_type,
                                            property_use: property.property_use,
                                        }}
                                        documents={documents}
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
