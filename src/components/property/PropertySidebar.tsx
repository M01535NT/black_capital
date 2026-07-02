import { MessageCircle, Phone } from "lucide-react";
import { AgentCard, type AgentInfo } from "./AgentCard";
import { DocumentCard, type DocumentLink } from "./DocumentCard";
import { CONTACT_CONFIG } from "@/lib/contact-config";

const SECTION_HEADING =
    "property-tag-type text-white/48";

const CARD_CLASS = "border border-white/[0.08] bg-white/[0.025] p-5 space-y-4";

interface PropertySidebarProps {
    agents: AgentInfo[];
    property: {
        id: string;
        title: string;
        m2_terrain: number | null;
        m2_construction: number | null;
        property_type: string | null;
        business_type: string | null;
        property_use: string | null;
    };
    documents: DocumentLink[];
}

/**
 * Columna derecha de la ficha: asesor(es), box de documentos y siguiente paso.
 * La ficha técnica completa vive en el capítulo 03 de la página (no se duplica aquí).
 */
export function PropertySidebar({ agents, property, documents }: PropertySidebarProps) {
    const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
        `Hola, quiero agendar una visita a: ${property.title}`,
    )}`;

    return (
        <aside className="w-full min-w-0 space-y-5 lg:w-[360px] lg:shrink-0 lg:self-start lg:sticky lg:top-24 xl:w-[380px]">
            {agents.length > 0 && (
                <div className={CARD_CLASS}>
                    <h3 className={SECTION_HEADING}>
                        {agents.length === 1 ? "Tu asesor" : "Tus asesores"}
                    </h3>
                    <div className={agents.length > 1 ? "space-y-5" : ""}>
                        {agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </div>
            )}

            {/* Box de documentos de la propiedad */}
            {documents.length > 0 && (
                <div className={CARD_CLASS}>
                    <h3 className={SECTION_HEADING}>Documentos</h3>
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

            <div className="border border-[var(--color-accent)]/25 bg-white/[0.035] p-5">
                <p className={SECTION_HEADING}>Siguiente paso</p>
                <h2 className="mt-3 text-display-3 leading-tight text-white">
                    Confirma disponibilidad y agenda visita.
                </h2>
                <p className="mt-2 text-body-sm text-white/58">
                    Un asesor valida condiciones, documentación y tiempos de respuesta.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gold-gradient inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] text-black transition-[filter] hover:brightness-110"
                    >
                        <MessageCircle className="size-3.5" aria-hidden="true" />
                        Agendar visita
                    </a>
                    <a
                        href={`tel:${CONTACT_CONFIG.phoneRaw}`}
                        className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/[0.14] px-4 font-display text-[0.68rem] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-[var(--color-accent)]"
                    >
                        <Phone className="size-3.5" aria-hidden="true" />
                        Llamar
                    </a>
                </div>
            </div>
        </aside>
    );
}
