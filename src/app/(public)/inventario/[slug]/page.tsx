import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { MediaShowcase } from "@/components/property/MediaShowcase";
import { TechnicalSheet, FichaPdfButton } from "@/components/property/TechnicalSheet";
import { PropertyFAQ } from "@/components/property/PropertyFAQ";
import { resolvePropertyFaqs } from "@/lib/property-faqs";
import { getFaqCatalog } from "@/lib/faq-catalog";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { AgentCard } from "@/components/property/AgentCard";
import { DocumentCard } from "@/components/property/DocumentCard";
import { StickyContactBar } from "@/components/property/StickyContactBar";
import { ArrowLeft } from "lucide-react";
import { PropertyJsonLd } from "@/components/property/PropertyJsonLd";
import { PropertySummaryCard } from "@/components/property/PropertySummaryCard";
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

const SECTION_HEADING = "property-tag-type text-white/48";

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
    const faqCatalog = await getFaqCatalog();

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

    // ── Resumen sticky (columna derecha) ──
    const primaryAgent = agents[0] ?? null;
    const extraAgents = agents.slice(1);
    const pricePerM2 = property.m2_construction
        ? formatPrice(Math.round(property.price / property.m2_construction), property.currency)
        : null;

    const summaryFacts: { label: string; value: string }[] = [
        ...(property.m2_terrain ? [{ label: "Terreno", value: formatArea(property.m2_terrain, "") }] : []),
        ...(property.m2_construction ? [{ label: "Construcción", value: formatArea(property.m2_construction, "") }] : []),
        ...(property.property_type ? [{ label: "Tipo", value: property.property_type }] : []),
        { label: "Uso", value: property.property_use },
        { label: "Estatus", value: STATUS_LABELS[property.status] || property.status },
        { label: "Referencia", value: technicalData.reference },
    ];

    // Secciones de contenido (columna izquierda), numeradas desde 02 (Galería = 01).
    const contentSections = [
        { id: "propiedad", label: "Descripción" },
        { id: "ficha-tecnica", label: "Ficha técnica" },
        ...(property.address ? [{ id: "ubicacion", label: "Ubicación" }] : []),
        ...(isForSale ? [{ id: "financiamiento", label: "Financiamiento" }] : []),
        ...(documents.length > 0 ? [{ id: "documentos", label: "Documentos" }] : []),
        ...(extraAgents.length > 0 ? [{ id: "asesores", label: "Asesores" }] : []),
        { id: "preguntas", label: "Preguntas frecuentes" },
    ];
    const num = (id: string) => String(contentSections.findIndex((c) => c.id === id) + 1).padStart(2, "0");

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

            {/* overflow-x-clip (no hidden): hidden crea un scroll container y rompe el sticky */}
            <div className="min-h-screen w-full overflow-x-clip bg-background">
                {/* Encabezado compacto: volver + título + badges + precio */}
                <header className="border-b border-white/[0.06] pt-20 lg:pt-24">
                    <div className="mx-auto max-w-[90rem] px-6 pb-6 sm:px-10 lg:px-16">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <Link
                                href={`/inventario?tipo=${encodeURIComponent(property.business_type)}`}
                                className="group inline-flex items-center gap-2 property-tag-type text-white/55 transition-colors duration-200 ease-out hover:text-[var(--color-accent)]"
                            >
                                <ArrowLeft className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" aria-hidden="true" />
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
                                        <span className="property-tag-type text-white/60">{property.address}</span>
                                    )}
                                </div>
                                <h1 className="font-display text-[clamp(1.9rem,4vw,3.1rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
                                    {property.title}
                                </h1>
                            </div>
                            <div className="shrink-0 lg:pb-1 lg:text-right">
                                <p className="mb-1 property-tag-type text-white/50">Precio</p>
                                <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-none tabular-nums gold-ink">
                                    {formatPrice(property.price, property.currency)}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 01 · Galería (full-width) */}
                <section id="galeria" className="w-full overflow-x-clip border-b border-white/[0.06] scroll-mt-24">
                    <div className="mx-auto min-w-0 max-w-[90rem] px-4 pb-8 pt-5 sm:px-10 lg:px-16">
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

                {/* Dos columnas: contenido (izq) + resumen sticky (der) */}
                <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-x-12 px-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-16">
                    {/* Resumen sticky. DOM-first → en móvil aparece arriba (precio/CTA temprano);
                        en desktop se coloca explícitamente en la columna 2. */}
                    <aside className="lg:col-start-2 lg:row-start-1">
                        <div className="py-8 lg:sticky lg:top-24 lg:py-10">
                            <PropertySummaryCard
                                price={property.price}
                                currency={property.currency}
                                businessType={property.business_type}
                                pricePerM2={pricePerM2}
                                facts={summaryFacts}
                                agent={primaryAgent}
                                whatsappFallback={CONTACT_CONFIG.phoneRaw}
                                propertyTitle={property.title}
                            />
                        </div>
                    </aside>

                    {/* Contenido */}
                    <main className="min-w-0 space-y-12 py-8 md:space-y-14 lg:col-start-1 lg:row-start-1 lg:py-10 lg:pr-12">
                        <section id="propiedad" className="scroll-mt-24">
                            <ChapterLabel number={num("propiedad")} title="Descripción" />
                            <FadeIn direction="up">
                                {property.description ? (
                                    <PropertyDescription description={property.description} />
                                ) : (
                                    <p className="max-w-prose text-body leading-relaxed text-white/66">
                                        {property.property_type || property.property_use} en{" "}
                                        {property.address || "Tijuana"} disponible en{" "}
                                        {property.business_type.toLowerCase()}. Pide la ficha completa para revisar detalles.
                                    </p>
                                )}
                            </FadeIn>
                        </section>

                        <section id="ficha-tecnica" className="scroll-mt-24">
                            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                                <ChapterLabel number={num("ficha-tecnica")} title="Ficha técnica" className="mb-0" />
                                <FichaPdfButton data={technicalData} />
                            </div>
                            <FadeIn direction="up">
                                <TechnicalSheet data={technicalData} />
                            </FadeIn>
                        </section>

                        {property.address && (
                            <section id="ubicacion" className="scroll-mt-24">
                                <ChapterLabel number={num("ubicacion")} title="Ubicación" />
                                <FadeIn direction="up">
                                    <PropertyLocation address={property.address} title={property.title} />
                                </FadeIn>
                            </section>
                        )}

                        {isForSale && (
                            <section id="financiamiento" className="scroll-mt-24">
                                <ChapterLabel number={num("financiamiento")} title="Financiamiento" />
                                <FadeIn direction="up">
                                    <MortgageCalculator
                                        price={property.price}
                                        currency={property.currency}
                                        businessType={property.business_type}
                                    />
                                </FadeIn>
                            </section>
                        )}

                        {documents.length > 0 && (
                            <section id="documentos" className="scroll-mt-24">
                                <ChapterLabel number={num("documentos")} title="Documentos" />
                                <FadeIn direction="up">
                                    <div className="border border-white/[0.08] bg-white/[0.02] p-5">
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
                                </FadeIn>
                            </section>
                        )}

                        {extraAgents.length > 0 && (
                            <section id="asesores" className="scroll-mt-24">
                                <ChapterLabel number={num("asesores")} title="Asesores" />
                                <FadeIn direction="up">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        {extraAgents.map((agent) => (
                                            <div key={agent.id} className="border border-white/[0.08] bg-white/[0.02] p-5">
                                                <AgentCard agent={agent} />
                                            </div>
                                        ))}
                                    </div>
                                </FadeIn>
                            </section>
                        )}

                        <section id="preguntas" className="scroll-mt-24">
                            <ChapterLabel number={num("preguntas")} title="Preguntas frecuentes" />
                            <FadeIn direction="up">
                                <PropertyFAQ
                                    businessType={property.business_type}
                                    faqs={resolvePropertyFaqs(property.faqs, faqCatalog)}
                                />
                            </FadeIn>
                        </section>
                    </main>
                </div>

                {/* Similares (full-width) */}
                {similar.length > 0 && (
                    <div className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-10 lg:px-16">
                        <FadeIn direction="up">
                            <section className="space-y-6 border-t border-white/[0.06] pt-10">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="h-px w-10 bg-[var(--color-accent)]/60" aria-hidden="true" />
                                        <h2 className={SECTION_HEADING}>Propiedades similares</h2>
                                    </div>
                                    <Link
                                        href={`/inventario?uso=${encodeURIComponent(property.property_use)}`}
                                        className="property-tag-type text-[var(--color-accent)]"
                                    >
                                        Ver inventario
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {similar.map((sp, i) => (
                                        <PropertyCard key={sp.id} property={sp} variant="similar" index={i} />
                                    ))}
                                </div>
                            </section>
                        </FadeIn>
                    </div>
                )}

                {/* Barra de acción fija (solo móvil/tablet; en desktop manda el resumen sticky) */}
                <StickyContactBar
                    propertyId={property.id}
                    agentPhone={agents?.[0]?.phone}
                    agentEmail={agents?.[0]?.email}
                    agentWhatsapp={CONTACT_CONFIG.phoneRaw}
                    propertyTitle={property.title}
                    priceLabel={formatShortPrice(property.price, property.currency, property.business_type)}
                    metaLabel={property.m2_construction ? formatArea(property.m2_construction, "") : undefined}
                />

                {/* Espaciador para que la barra fija (móvil) no tape el footer */}
                <div className="h-16 lg:h-0" />
            </div>
        </>
    );
}
