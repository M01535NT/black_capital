import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";

/**
 * SubBrandValue — three-up value proposition grid for the 3 sub-brand
 * landings.
 *
 * Replaces:
 *   - src/components/luxury/LuxuryValue.tsx
 *   - src/components/business/BusinessValue.tsx
 *   - src/components/industrial/IndustrialValue.tsx
 *
 * Premium Estilo A:
 *   - Sin glass cards ni floating orbs
 *   - 3-col grid con vlines doradas (mismo patrón que TrackRecord)
 *   - Steel accent conserva los corner accents como única diferenciación
 */

export type Accent = "gold" | "steel";

export interface SubBrandValueItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface SubBrandValueProps {
    brand: "luxury" | "business" | "industrial";
    eyebrow: string;
    /** h2 content. Pass a Fragment with a <span className="metallic-gold-static"> for the highlighted word. */
    title: ReactNode;
    description: string;
    items: SubBrandValueItem[];
    accent: Accent;
}

export function SubBrandValue({
    brand,
    eyebrow,
    title,
    description,
    items,
    accent,
}: SubBrandValueProps) {
    const isSteel = accent === "steel";

    return (
        <Section
            id={`${brand}-value`}
            label={`Propuesta de valor ${brand}`}
            spacing="default"
            containerWidth="wide"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-20">
                <div className="max-w-2xl">
                    <Eyebrow label={eyebrow} />
                    <h2 className="text-display-2 font-light text-white leading-display tracking-headline">
                        {title}
                    </h2>
                </div>
                <p className="text-body-fluid-sm text-white/55 leading-relaxed font-light max-w-md sm:text-right">
                    {description}
                </p>
            </div>

            {/* 3-col grid con vlines */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/[0.06]" role="list">
                {/* Vertical vlines (desktop) */}
                <div
                    className="hidden md:block absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="hidden md:block absolute top-0 bottom-0 left-2/3 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                {/* Horizontal hairline (mobile, entre filas) */}
                <div
                    className="md:hidden absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="md:hidden absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                />

                {items.map((item, i) => {
                    const Icon = item.icon;
                    const isTopRow = i < 3;
                    const isLeftCol = i % 3 === 0;
                    const isRightCol = i % 3 === 2;
                    return (
                        <div
                            key={item.title}
                            role="listitem"
                            className={
                                "relative p-8 sm:p-10 lg:p-12 flex flex-col items-start " +
                                (isTopRow ? "border-b md:border-b border-white/[0.06] " : "") +
                                (!isLeftCol ? "md:border-l md:border-white/[0.06] " : "") +
                                (!isRightCol ? "" : "")
                            }
                        >
                            {/* Corner accents (steel only) */}
                            {isSteel && (
                                <>
                                    <div
                                        className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--color-accent)]/30"
                                        aria-hidden="true"
                                    />
                                    <div
                                        className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--color-accent)]/30"
                                        aria-hidden="true"
                                    />
                                </>
                            )}

                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-6">
                                /{String(i + 1).padStart(2, "0")}
                            </span>
                            <div
                                className={
                                    "w-14 h-14 flex items-center justify-center mb-8 " +
                                    (isSteel
                                        ? "rounded-none border border-white/15"
                                        : "rounded-full border border-[var(--color-accent)]/40")
                                }
                                aria-hidden="true"
                            >
                                <Icon
                                    className="w-6 h-6 text-[var(--color-accent)]"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <h3 className="text-display-4 font-semibold text-white tracking-snug mb-3">
                                {item.title}
                            </h3>
                            <p className="text-body-sm text-white/60 leading-relaxed font-light max-w-xs">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </Section>
    );
}
