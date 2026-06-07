import { AgentCard, type AgentInfo } from "./AgentCard";
import { SpecRow } from "./SpecRow";
import { DocumentCard, type DocumentLink } from "./DocumentCard";
import { formatArea } from "@/lib/format";
import { MessageCircle } from "lucide-react";

const SECTION_HEADING =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-white/48";

const CARD_CLASS = "border border-white/[0.08] bg-white/[0.025] p-5 space-y-4";

interface PropertySidebarProps {
    agents: AgentInfo[];
    property: {
        id: string;
        m2_terrain: number | null;
        m2_construction: number | null;
        property_type: string | null;
        business_type: string | null;
        property_use: string | null;
    };
    documents: DocumentLink[];
    whatsappHref: string;
}

const SECTION_CARD_TITLE = SECTION_HEADING;

/**
 * Right column of the property detail page: agent(s), technical sheet, documents, CTA.
 * Composes the small extracted components into the full sidebar.
 */
export function PropertySidebar({ agents, property, documents, whatsappHref }: PropertySidebarProps) {
    return (
        <aside className="lg:w-[360px] xl:w-[380px] shrink-0 lg:self-start lg:sticky lg:top-24 space-y-5">
            <div className="border border-[var(--color-accent)]/25 bg-white/[0.035] p-5">
                <p className={SECTION_CARD_TITLE}>Siguiente paso</p>
                <h2 className="mt-4 text-2xl font-light leading-tight text-white">
                    Confirma disponibilidad y agenda visita.
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/58">
                    Un asesor puede validar condiciones, documentación y tiempos de respuesta.
                </p>
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brushed-gold mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-bold"
                >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Contactar por WhatsApp
                </a>
            </div>

            <div className={CARD_CLASS}>
                <h3 className={SECTION_CARD_TITLE}>Ficha Técnica</h3>
                <div className="space-y-3">
                    {property.m2_terrain ? (
                        <SpecRow label="Terreno" value={formatArea(property.m2_terrain, "")} />
                    ) : null}
                    {property.m2_construction ? (
                        <SpecRow label="Construcción" value={formatArea(property.m2_construction, "")} />
                    ) : null}
                    {property.property_type ? (
                        <SpecRow label="Tipo" value={property.property_type} />
                    ) : null}
                    {property.business_type ? (
                        <SpecRow label="Operación" value={property.business_type} />
                    ) : null}
                    {property.property_use ? (
                        <SpecRow label="Uso" value={property.property_use} />
                    ) : null}
                    <SpecRow label="ID" value={property.id?.slice(0, 8) || "—"} mono />
                </div>
            </div>

            {agents.length > 0 && (
                <div className={CARD_CLASS}>
                    <h3 className={SECTION_CARD_TITLE}>
                        {agents.length === 1 ? "Asesor a Cargo" : "Asesores a Cargo"}
                    </h3>
                    <div className={agents.length > 1 ? "space-y-5" : ""}>
                        {agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </div>
            )}

            {/* Documents */}
            {documents.length > 0 && (
                <div className={CARD_CLASS}>
                    <h3 className={SECTION_CARD_TITLE}>Documentos</h3>
                    <div className="space-y-2">
                        {documents.map((doc, i) => (
                            <DocumentCard key={i} doc={doc} />
                        ))}
                    </div>
                </div>
            )}

        </aside>
    );
}
