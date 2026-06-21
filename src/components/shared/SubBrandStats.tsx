import { ScrollReveal } from "@/components/motion/ScrollReveal";

export type SubBrand = "luxury" | "business" | "industrial";
export type Accent = "gold" | "steel";

export interface StatItem {
    value: number | string;
    label: string;
    suffix?: string;
    prefix?: string;
}

interface SubBrandStatsProps {
    brand: SubBrand;
    eyebrow?: string;
    title?: string;
    description?: string;
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
    eyebrow = "Criterios de selección",
    title = "Datos útiles antes de visitar.",
    description = "Cada activo se compara por uso, ubicación, precio y condiciones reales.",
    stats,
    spacing = "default",
}: SubBrandStatsProps) {
    return (
        <section
            id={`${brand}-stats`}
            aria-label={`Indicadores de ${brand}`}
            className={`relative border-y border-white/[0.06] bg-white/[0.02] ${SPACING[spacing]}`}
        >
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent"
            />

            <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16">
                <div className="lg:col-span-5">
                    <p className="mb-3 text-caption gold-ink">{eyebrow}</p>
                    <h2 className="text-display-2 text-white">{title}</h2>
                    <span
                        aria-hidden="true"
                        className="mt-6 block h-px w-28 bg-gradient-to-r from-[var(--color-accent)] to-transparent"
                    />
                    <p className="mt-6 max-w-md text-body text-white/58">{description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={stat.label} delay={index * 0.07} className="h-full">
                            <article className="group flex h-full min-h-[180px] flex-col justify-between border border-white/[0.08] bg-background/60 p-6 transition-colors duration-500 hover:border-[var(--color-accent)]/35">
                                <span className="property-tag-type gold-ink">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <p className="text-display-3 leading-tight text-white">
                                        {stat.prefix ?? ""}
                                        {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                                        {stat.suffix ?? ""}
                                    </p>
                                    <span
                                        aria-hidden="true"
                                        className="mt-4 block h-px w-10 origin-left bg-[var(--color-accent)]/45 transition-all duration-500 group-hover:w-16"
                                    />
                                    <p className="mt-4 text-body-sm leading-relaxed text-white/60">{stat.label}</p>
                                </div>
                            </article>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
