import { CheckCircle2 } from "lucide-react";

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
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        {eyebrow}
                    </p>
                    <h2 className="text-display-2 font-light leading-display tracking-headline text-white">
                        {title}
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-7 text-white/58">
                        Estos números son placeholders para validar jerarquía visual. Se reemplazarán por datos reales desde administración.
                    </p>
                </div>

                <div className="grid gap-4 lg:col-span-7">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="flex gap-4 border border-white/[0.08] bg-background/70 p-5"
                        >
                            <span className="min-w-8 text-sm font-bold text-[var(--color-accent)]">
                                0{index + 1}
                            </span>
                            <div className="flex flex-1 items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                                    <p className="text-sm leading-6 text-white/70">{stat.label}</p>
                                </div>
                                <p className="shrink-0 text-right text-xl font-light text-white">
                                    {stat.prefix ?? ""}
                                    {stat.value.toLocaleString()}
                                    {stat.suffix ?? ""}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
