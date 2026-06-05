import { PropertyCard, type PropertyCardData } from "./PropertyCard";
import { AgentCard, type AgentInfo } from "./AgentCard";
import { SpecRow } from "./SpecRow";
import { DocumentCard, type DocumentLink } from "./DocumentCard";
import { ContactCTA } from "./ContactCTA";
import { formatArea } from "@/lib/format";

const SECTION_HEADING =
    "font-display text-caption font-bold uppercase tracking-wide-display text-foreground/50";

const CARD_CLASS = "bg-card border border-foreground/10 rounded-2xl p-5 space-y-4";

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
            {/* Agent Card */}
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

            {/* Property Specs Card */}
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

            {/* Contact CTA */}
            <ContactCTA variant="sidebar" whatsappHref={whatsappHref} />
        </aside>
    );
}
