import { Calendar, Ruler, Building2, ShieldCheck } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { formatShortDate, formatArea } from "@/lib/format";

interface PropertyMetricsProps {
    m2Terrain: number | null;
    m2Construction: number | null;
    customAttributes: Record<string, string>;
    propertyType: string | null;
    createdAt: string;
}

const SECTION_HEADING =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-white/48";

/**
 * The "Características" section with premium styling.
 * Features hairline heading, grid layout with featured variants, and tags for custom attributes.
 */
export function PropertyMetrics({
    m2Terrain,
    m2Construction,
    customAttributes,
    propertyType,
    createdAt,
}: PropertyMetricsProps) {
    return (
        <section className="space-y-6">
            {/* Heading con hairline */}
            <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                <h2 className={SECTION_HEADING}>Características Principales</h2>
            </div>
            
            {/* Grid de métricas principales */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {m2Terrain && (
                    <MetricCard
                        icon={<Ruler className="size-4" />}
                        label="Terreno"
                        value={formatArea(m2Terrain, "")}
                    />
                )}
                {m2Construction && (
                    <MetricCard
                        icon={<Building2 className="size-4" />}
                        label="Construcción"
                        value={formatArea(m2Construction, "")}
                    />
                )}
                <MetricCard
                    icon={<Calendar className="size-4" />}
                    label="Publicado"
                    value={formatShortDate(createdAt)}
                />
                {propertyType && (
                    <MetricCard
                        icon={<ShieldCheck className="size-4" />}
                        label="Tipo"
                        value={propertyType}
                    />
                )}
            </div>
            
            {/* Custom Attributes como tags */}
            {Object.entries(customAttributes).length > 0 && (
                <div className="border-t border-white/[0.08] pt-6">
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(customAttributes).map(([key, value]) => (
                            <span 
                                key={key} 
                                className="border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]"
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
