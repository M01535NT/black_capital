export type SubBrand = "luxury" | "business" | "industrial";
export type Accent = "gold" | "steel";

export interface StatItem {
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
}

interface SubBrandStatsProps {
    brand: SubBrand;
    eyebrow?: string;
    title?: string;
    stats: StatItem[];
    accent: Accent;
    spacing?: "default" | "tight" | "loose" | "none";
}

const SPACING = {
    none: "py-0",
    tight: "py-12 sm:py-14 lg:py-16",
    default: "py-16 lg:py-24",
    loose: "py-20 lg:py-28",
} as const;

export function SubBrandStats({
    brand,
    eyebrow = "Indicadores de ejemplo",
    title = "Muestra visual editable desde el panel.",
    stats,
    spacing = "default",
}: SubBrandStatsProps) {
    return (
        <section
            id={`${brand}-stats`}
            aria-label={`Indicadores de ${brand}`}
            className={`border-y border-white/[0.06] bg-white/[0.02] ${SPACING[spacing]}`}
        >
            <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:px-16">
                <div className="lg:col-span-5">
                    <p className="mb-3 text-caption gold-ink">
                        {eyebrow}
                    </p>
                    <h2 className="text-display-2 text-white">
                        {title}
                    </h2>
                    <p className="mt-5 max-w-md text-body text-white/58">
                        Estos números son placeholders para validar jerarquía visual. Se reemplazarán por datos reales desde administración.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="flex min-h-[150px] flex-col justify-between border border-white/[0.08] bg-background/70 p-4 sm:min-h-[160px] sm:p-5"
                        >
                            <span className="property-tag-type gold-ink">
                                0{index + 1}
                            </span>
                            <div>
                                <p className="text-display-3 text-white">
                                    {stat.prefix ?? ""}
                                    {stat.value.toLocaleString()}
                                    {stat.suffix ?? ""}
                                </p>
                                <p className="mt-3 text-body-sm text-white/62">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
