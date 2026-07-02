import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyMetrics } from "@/components/property/PropertyMetrics";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { MediaShowcase } from "@/components/property/MediaShowcase";
import { TechnicalSheet, FichaPdfButton } from "@/components/property/TechnicalSheet";
import { PropertyFAQ } from "@/components/property/PropertyFAQ";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { PropertySidebar } from "@/components/property/PropertySidebar";
import { StickyContactBar } from "@/components/property/StickyContactBar";
import { PropertyJsonLd } from "@/components/property/PropertyJsonLd";
import { PropertyChapterNav, type Chapter } from "@/components/property/PropertyChapterNav";
import { FavoriteButton } from "@/components/property/favorite-button";
import { MortgageCalculator } from "@/components/tools/mortgage-calculator";
import { FadeIn } from "@/components/ui/motion";

import { CONTACT_CONFIG } from "@/lib/contact-config";
import { getPropertyDocuments, toVisibleDocuments } from "@/lib/document-access";
import { formatPrice, formatShortPrice, formatArea } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/property-constants";
import Image from "next/image";
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

/** Editorial numbered chapter heading (matches the reference "0X · Título"). */
function ChapterLabel({ number, title, className = "mb-7" }: { number: string; title: string; className?: string }) {
    return (
        <div className={`${className} flex items-baseline gap-3.5`}>
            <span className="font-display text-body-sm font-bold tabular-nums text-[var(--color-accent)]">
                {number}
            </span>
            <h2 className="font-display text-display-3 font-extrabold uppercase leading-none tracking-headline text-white">
                {title}
            </h2>
        </div>
    );
}

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

    const metaTitle = `${property.title} en Tijuana | Black Capital`;
    const metaDescription = (property.description || `Propiedad en venta en Tijuana: ${property.title}`).slice(0, 160);
    // Cuando la ficha tiene portada, la usamos como imagen social en OG y Twitter
    // (compartir listados en WhatsApp/X es el caso de uso central de los asesores).
    // Sin portada, omitimos las imágenes para heredar la convención opengraph-image.tsx.
    const socialImages = property.cover_image
        ? [{ url: property.cover_image, alt: property.title }]
        : undefined;

    return {
        title: metaTitle,
        description: metaDescription,
        openGraph: {
            type: "website",
            title: metaTitle,
            description: metaDescription,
            ...(socialImages ? { images: socialImages } : {}),
        },
        ...(socialImages
            ? {
                  twitter: {
                      card: "summary_large_image",
                      title: metaTitle,
                      description: metaDescription,
                      images: socialImages,
                  },
              }
            : {}),
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

    const isForSale = property.business_type === "Venta";
    const heroImage: string | null =
        property.cover_image || (property.images?.length ? property.images[0] : null);

    const technicalData = {
        title: property.title,
        reference: (property.slug || property.id).toString().toUpperCase().slice(0, 18),
        businessType: property.business_type,
        propertyUse: property.property_use,
        propertyType: property.property_type,
        status: property.status,
        statusLabel: STATUS_LABELS[property.status] || property.status,
        price: property.price,
        currency: property.currency,
        address: property.address,
        m2Terrain: property.m2_terrain,
        m2Construction: property.m2_construction,
        customAttributes: customAttrs,
    };

    // Índice editorial de capítulos (plantilla "Propiedad Editorial Black": 01–0N).
    const chapters: Chapter[] = [
        { id: "galeria", label: "Galería" },
        { id: "propiedad", label: "La propiedad" },
        { id: "ficha-tecnica", label: "Ficha técnica" },
        ...(property.address ? [{ id: "ubicacion", label: "Ubicación" }] : []),
        ...(isForSale ? [{ id: "financiamiento", label: "Financiamiento" }] : []),
        { id: "preguntas", label: "Preguntas" },
    ];
    const chapterNumber = (id: string) =>
        String(chapters.findIndex((c) => c.id === id) + 1).padStart(2, "0");

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
                {/* Full-bleed hero */}
                <section
                    className="relative flex h-[70svh] min-h-[460px] w-full items-end overflow-hidden"
                    style={{
                        background:
                            "repeating-linear-gradient(135deg,#151310 0 12px,#100e0c 12px 24px)",
                    }}
                >
                    {heroImage && (
                        <Image
                            src={heroImage}
                            alt={property.title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                    )}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg,rgba(5,5,5,.55) 0%,rgba(5,5,5,.1) 30%,rgba(5,5,5,.4) 62%,rgba(5,5,5,.96) 100%)",
                        }}
                    />
                    <div className="relative w-full">
                        <div className="mx-auto max-w-[90rem] px-6 pb-9 pt-24 sm:px-10 lg:px-16">
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="gold-gradient px-2.5 py-1 property-tag-type text-black">
                                    {property.business_type}
                                </span>
                                <span className="border border-white/40 px-2.5 py-1 property-tag-type text-white">
                                    {STATUS_LABELS[property.status] || property.status}
                                </span>
                                {property.address && (
                                    <span className="property-tag-type text-white/75">
                                        {property.address}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
                                {property.title}
                            </h1>
                            <div className="mt-7 flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-white/15 pt-6">
                                <div>
                                    <p className="mb-1.5 property-tag-type text-white/55">Precio</p>
                                    <p className="property-price-type gold-ink">
                                        {formatPrice(property.price, property.currency)}
                                    </p>
                                </div>
                                {property.m2_terrain ? (
                                    <div>
                                        <p className="mb-1.5 property-tag-type text-white/55">Terreno</p>
                                        <p className="font-display text-display-3 font-bold text-white">
                                            {formatArea(property.m2_terrain, "")}
                                        </p>
                                    </div>
                                ) : null}
                                {property.m2_construction ? (
                                    <div>
                                        <p className="mb-1.5 property-tag-type text-white/55">Construcción</p>
                                        <p className="font-display text-display-3 font-bold text-white">
                                            {formatArea(property.m2_construction, "")}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="galeria" className="w-full overflow-x-clip border-y border-white/[0.06] scroll-mt-24">
                    <div className="mx-auto max-w-[90rem] min-w-0 px-4 pb-8 pt-10 sm:px-10 lg:px-16">
                        <ChapterLabel number={chapterNumber("galeria")} title="Galería" />
                        <MediaShowcase
                            images={property.images || []}
                            title={property.title}
                            coverImage={property.cover_image}
                            propertyUse={property.property_use}
                            videoUrls={property.video_urls}
                            tourEmbeds={property.tour_embeds}
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
                        <div className="min-w-0 space-y-14 md:space-y-20 lg:col-span-8">

                            <section id="propiedad" className="scroll-mt-24 space-y-10">
                                <ChapterLabel number={chapterNumber("propiedad")} title="La propiedad" />
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
                                        showTitle={false}
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

                                {property.description && (
                                    <FadeIn direction="up" delay={0.4}>
                                        <div className="border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
                                            <PropertyDescription description={property.description} />
                                        </div>
                                    </FadeIn>
                                )}
                            </section>

                            <section id="ficha-tecnica" className="scroll-mt-24">
                                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                                    <ChapterLabel number={chapterNumber("ficha-tecnica")} title="Ficha técnica" className="mb-0" />
                                    <FichaPdfButton data={technicalData} />
                                </div>
                                <FadeIn direction="up" delay={0.5}>
                                    <TechnicalSheet data={technicalData} />
                                </FadeIn>
                            </section>

                            {property.address && (
                                <section id="ubicacion" className="scroll-mt-24">
                                    <ChapterLabel number={chapterNumber("ubicacion")} title="Ubicación" />
                                    <FadeIn direction="up" delay={0.6}>
                                        <PropertyLocation address={property.address} title={property.title} />
                                    </FadeIn>
                                </section>
                            )}

                            {isForSale && (
                                <section id="financiamiento" className="scroll-mt-24">
                                    <ChapterLabel number={chapterNumber("financiamiento")} title="Financiamiento" />
                                    <FadeIn direction="up" delay={0.7}>
                                        <MortgageCalculator
                                            price={property.price}
                                            currency={property.currency}
                                            businessType={property.business_type}
                                        />
                                    </FadeIn>
                                </section>
                            )}

                            <section id="preguntas" className="scroll-mt-24">
                                <ChapterLabel number={chapterNumber("preguntas")} title="Preguntas frecuentes" />
                                <FadeIn direction="up" delay={0.7}>
                                    <PropertyFAQ businessType={property.business_type} />
                                </FadeIn>
                            </section>

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
                                <div className="hidden border border-white/[0.08] bg-white/[0.02] p-6 lg:block">
                                    <PropertyChapterNav chapters={chapters} />
                                </div>
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

                {/* Barra de acción fija (todos los viewports, plantilla editorial) */}
                <StickyContactBar
                    propertyId={property.id}
                    agentPhone={agents?.[0]?.phone}
                    agentEmail={agents?.[0]?.email}
                    agentWhatsapp={CONTACT_CONFIG.phoneRaw}
                    propertyTitle={property.title}
                    priceLabel={formatShortPrice(property.price, property.currency, property.business_type)}
                    metaLabel={property.m2_construction ? formatArea(property.m2_construction, "") : undefined}
                />

                {/* Espaciador para que la barra fija no tape el footer */}
                <div className="h-16" />
            </div>
        </>
    );
}
