import { Calendar, Ruler, Building2, ShieldCheck } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { getAttributeIcon } from "@/lib/property-constants";
import { formatShortDate, formatArea } from "@/lib/format";

interface PropertyMetricsProps {
    m2Terrain: number | null;
    m2Construction: number | null;
    customAttributes: Record<string, string>;
    propertyType: string | null;
    createdAt: string;
}

const SECTION_HEADING =
    "font-display text-xs font-bold uppercase tracking-wide-display text-foreground/50";

/**
 * The "Características" section. Groups metric cards (terrain, construction,
 * custom attributes, type, published date) in a responsive flex layout.
 */
export function PropertyMetrics({
    m2Terrain,
    m2Construction,
    customAttributes,
    propertyType,
    createdAt,
}: PropertyMetricsProps) {
    return (
        <section className="space-y-4">
            <h2 className={SECTION_HEADING}>Características</h2>
            <div className="flex flex-wrap gap-3">
                {m2Terrain ? (
                    <MetricCard
                        icon={<Ruler className="size-4 text-gold-500" />}
                        label="Terreno"
                        value={formatArea(m2Terrain, "")}
                    />
                ) : null}
                {m2Construction ? (
                    <MetricCard
                        icon={<Building2 className="size-4 text-gold-500" />}
                        label="Construcción"
                        value={formatArea(m2Construction, "")}
                    />
                ) : null}
                {Object.entries(customAttributes).map(([key, value]) => (
                    <MetricCard
                        key={key}
                        icon={getAttributeIcon(key) || <ShieldCheck className="size-4 text-gold-500" />}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={value}
                    />
                ))}
                <MetricCard
                    icon={<Calendar className="size-4 text-gold-500" />}
                    label="Publicado"
                    value={formatShortDate(createdAt)}
                />
                {propertyType ? (
                    <MetricCard
                        icon={<ShieldCheck className="size-4 text-gold-500" />}
                        label="Tipo"
                        value={propertyType}
                    />
                ) : null}
            </div>
        </section>
    );
}
