import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { MediaShowcase } from "@/components/property/MediaShowcase";
import { TechnicalSheet, FichaPdfButton } from "@/components/property/TechnicalSheet";
import { PropertyFAQ } from "@/components/property/PropertyFAQ";
import { resolvePropertyFaqs } from "@/lib/property-faqs";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { AgentCard } from "@/components/property/AgentCard";
import { DocumentCard } from "@/components/property/DocumentCard";
import { StickyContactBar } from "@/components/property/StickyContactBar";
import { ArrowLeft } from "lucide-react";
import { PropertyJsonLd } from "@/components/property/PropertyJsonLd";
import { PropertyChapterNav, type Chapter } from "@/components/property/PropertyChapterNav";
import { FavoriteButton } from "@/components/property/favorite-button";
import { MortgageCalculator } from "@/components/tools/mortgage-calculator";
import { FadeIn } from "@/components/ui/motion";

import { CONTACT_CONFIG } from "@/lib/contact-config";
import { getPropertyDocuments, toVisibleDocuments } from "@/lib/document-access";
import { formatPrice, formatShortPrice, formatArea } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/property-constants";
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

    const technicalData = {
        title: property.title,
        // Código corto tipo plantilla (TIJ-XXXXXXXX) en lugar del slug truncado.
        reference: `TIJ-${property.id.toString().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
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
        createdAt: property.created_at,
        customAttributes: customAttrs,
    };

    const hasContactChapter = agents.length > 0 || documents.length > 0;
    const contactChapterLabel =
        agents.length > 0 && documents.length > 0
            ? "Asesor y documentos"
            : agents.length > 0
              ? "Tu asesor"
              : "Documentos";

    // Índice editorial de capítulos (plantilla "Propiedad Editorial Black": 01–0N).
    const chapters: Chapter[] = [
        { id: "galeria", label: "Galería" },
        { id: "propiedad", label: "La propiedad" },
        { id: "ficha-tecnica", label: "Ficha técnica" },
        ...(property.address ? [{ id: "ubicacion", label: "Ubicación" }] : []),
        ...(isForSale ? [{ id: "financiamiento", label: "Financiamiento" }] : []),
        ...(hasContactChapter ? [{ id: "asesor", label: contactChapterLabel }] : []),
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
            
            {/* overflow-x-clip (no hidden): hidden crea un scroll container y rompe el sticky del índice */}
            <div className="min-h-screen w-full overflow-x-clip bg-background">
                {/* Encabezado compacto (sin hero): volver + título + badges + precio */}
                <header className="border-b border-white/[0.06] pt-24 lg:pt-28">
                    <div className="mx-auto max-w-[90rem] px-6 pb-7 sm:px-10 lg:px-16">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <Link
                                href={`/inventario?tipo=${encodeURIComponent(property.business_type)}`}
                                className="group inline-flex items-center gap-2 property-tag-type text-white/55 transition-colors hover:text-[var(--color-accent)]"
                            >
                                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                                Volver a {property.business_type}
                            </Link>
                            <FavoriteButton propertyId={property.id} variant="pill" />
                        </div>
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="gold-gradient px-2.5 py-1 property-tag-type text-black">
                                        {property.business_type}
                                    </span>
                                    <span className="border border-white/25 px-2.5 py-1 property-tag-type text-white/85">
                                        {STATUS_LABELS[property.status] || property.status}
                                    </span>
                                    {property.address && (
                                        <span className="property-tag-type text-white/60">
                                            {property.address}
                                        </span>
                                    )}
                                </div>
                                <h1 className="font-display text-[clamp(1.9rem,4vw,3.1rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
                                    {property.title}
                                </h1>
                            </div>
                            <div className="shrink-0 lg:pb-1 lg:text-right">
                                <p className="mb-1 property-tag-type text-white/50">Precio publicado</p>
                                <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-none tabular-nums gold-ink">
                                    {formatPrice(property.price, property.currency)}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="galeria" className="w-full overflow-x-clip border-b border-white/[0.06] scroll-mt-24">
                    <div className="mx-auto max-w-[90rem] min-w-0 px-4 pb-8 pt-8 sm:px-10 lg:px-16">
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

                {/* Shell plantilla: índice lateral sticky (corto → siempre visible) + una columna */}
                <div className="mx-auto grid max-w-[90rem] grid-cols-1 px-4 sm:px-10 lg:grid-cols-[220px_1fr] lg:px-16">
                    <aside className="hidden border-r border-white/[0.06] py-10 pr-8 lg:block">
                        <div className="sticky top-24">
                            <PropertyChapterNav chapters={chapters} />
                        </div>
                    </aside>

                    <div className="min-w-0 space-y-12 py-8 md:space-y-14 md:py-10 lg:pl-12">

                        <section id="propiedad" className="scroll-mt-24">
                            <ChapterLabel number={chapterNumber("propiedad")} title="La propiedad" />
                            <FadeIn direction="up" delay={0.1}>
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
                                    <div className="min-w-0">
                                        {property.description ? (
                                            <PropertyDescription description={property.description} />
                                        ) : (
                                            <p className="max-w-prose text-body leading-relaxed text-white/66">
                                                {property.property_type || property.property_use} en{" "}
                                                {property.address || "Tijuana"} disponible en{" "}
                                                {property.business_type.toLowerCase()}. Solicita la
                                                información completa con un asesor.
                                            </p>
                                        )}
                                    </div>
                                    <div className="border-t border-white/[0.1] pt-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                                        {[
                                            ...(property.m2_terrain ? [["Terreno", formatArea(property.m2_terrain, "")]] : []),
                                            ...(property.m2_construction ? [["Construcción", formatArea(property.m2_construction, "")]] : []),
                                            ...(property.property_type ? [["Tipo", property.property_type]] : []),
                                            ["Estatus", STATUS_LABELS[property.status] || property.status],
                                        ].map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="flex items-baseline justify-between gap-4 border-b border-white/[0.1] py-3 last:border-b-0"
                                            >
                                                <span className="text-body-sm text-white/50">{label}</span>
                                                <span className="font-display text-body-lg font-extrabold text-white">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        </section>

                        <section id="ficha-tecnica" className="scroll-mt-24">
                            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                                <ChapterLabel number={chapterNumber("ficha-tecnica")} title="Ficha técnica" className="mb-0" />
                                <FichaPdfButton data={technicalData} />
                            </div>
                            <FadeIn direction="up" delay={0.1}>
                                <TechnicalSheet data={technicalData} />
                            </FadeIn>
                        </section>

                        {property.address && (
                            <section id="ubicacion" className="scroll-mt-24">
                                <ChapterLabel number={chapterNumber("ubicacion")} title="Ubicación" />
                                <FadeIn direction="up" delay={0.1}>
                                    <PropertyLocation address={property.address} title={property.title} />
                                </FadeIn>
                            </section>
                        )}

                        {isForSale && (
                            <section id="financiamiento" className="scroll-mt-24">
                                <ChapterLabel number={chapterNumber("financiamiento")} title="Financiamiento" />
                                <FadeIn direction="up" delay={0.1}>
                                    <MortgageCalculator
                                        price={property.price}
                                        currency={property.currency}
                                        businessType={property.business_type}
                                    />
                                </FadeIn>
                            </section>
                        )}

                        {hasContactChapter && (
                            <section id="asesor" className="scroll-mt-24">
                                <ChapterLabel number={chapterNumber("asesor")} title={contactChapterLabel} />
                                <FadeIn direction="up" delay={0.1}>
                                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                        {agents.length > 0 && (
                                            <div className="border border-white/[0.08] bg-white/[0.025] p-5">
                                                <p className="mb-4 property-tag-type text-white/48">
                                                    {agents.length === 1 ? "Tu asesor" : "Tus asesores"}
                                                </p>
                                                <div className="space-y-5">
                                                    {agents.map((agent) => (
                                                        <AgentCard key={agent.id} agent={agent} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {documents.length > 0 && (
                                            <div className="border border-white/[0.08] bg-white/[0.025] p-5">
                                                <p className="mb-4 property-tag-type text-white/48">
                                                    Documentos de la propiedad
                                                </p>
                                                <div className="space-y-2">
                                                    {documents.map((doc) => (
                                                        <DocumentCard
                                                            key={doc.id}
                                                            doc={doc}
                                                            propertyId={property.id}
                                                            propertyTitle={property.title}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </FadeIn>
                            </section>
                        )}

                        <section id="preguntas" className="scroll-mt-24">
                            <ChapterLabel number={chapterNumber("preguntas")} title="Preguntas frecuentes" />
                            <FadeIn direction="up" delay={0.1}>
                                <PropertyFAQ
                                    businessType={property.business_type}
                                    faqs={resolvePropertyFaqs(property.faqs)}
                                />
                            </FadeIn>
                        </section>

                        {similar.length > 0 && (
                            <FadeIn direction="up" delay={0.1}>
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
