/**
 * SubBrandStats — animated counter grid for the 3 sub-brand landings.
 *
 * Replaces:
 *   - src/components/luxury/LuxuryStats.tsx
 *   - src/components/business/BusinessStats.tsx
 *   - src/components/industrial/IndustrialStats.tsx
 *
 * Premium Estilo A: 4-col grid con vlines doradas (mismo patrón que
 * TrackRecord). Steel accent conserva el top accent bar como única
 * diferenciación. El counter local se preserva para mantener el
 * trigger de `useInView`.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";

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
    /** Optional: override the default panel padding (e.g. "py-20" for industrial). */
    spacing?: "default" | "tight" | "loose" | "none";
}

function Counter({
    from,
    to,
    duration = 2,
    suffix = "",
    prefix = "",
}: {
    from: number;
    to: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}) {
    const shouldReduceMotion = useReducedMotion();
    const [count, setCount] = useState(shouldReduceMotion ? to : from);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        if (shouldReduceMotion) {
            hasAnimated.current = true;
            return;
        }
        if (isInView) {
            hasAnimated.current = true;
            let startTime: number;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min(
                    (timestamp - startTime) / (duration * 1000),
                    1
                );
                setCount(Math.floor(progress * (to - from) + from));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
            return;
        }
        const timer = setTimeout(() => {
            if (!hasAnimated.current) {
                hasAnimated.current = true;
                setCount(to);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isInView, shouldReduceMotion, from, to, duration]);

    return (
        <span ref={ref}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

export function SubBrandStats({
    brand,
    eyebrow,
    title,
    stats,
    accent,
    spacing = "default",
}: SubBrandStatsProps) {
    const isSteel = accent === "steel";

    return (
        <Section
            id={`${brand}-stats`}
            label={`Estadísticas de ${brand}`}
            spacing={spacing}
            containerWidth="wide"
            className={isSteel ? "bg-background" : ""}
        >
            {(eyebrow || title) && (
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-20">
                    <div className="max-w-2xl">
                        {eyebrow && <Eyebrow label={eyebrow} />}
                        {title && (
                            <h2 className="text-display-2 font-light text-white leading-display tracking-headline">
                                {title}
                            </h2>
                        )}
                    </div>
                </div>
            )}

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/[0.06]" role="list">
                {/* Vertical vlines (desktop) */}
                <div
                    className="hidden lg:block absolute top-0 bottom-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="hidden lg:block absolute top-0 bottom-0 left-2/4 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="hidden lg:block absolute top-0 bottom-0 left-3/4 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/35 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                {/* Horizontal hairline (mobile, entre filas) */}
                <div
                    className="lg:hidden absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                />

                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        role="listitem"
                        className="relative flex flex-col items-start justify-center py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10 first:pl-0 lg:first:pl-2 last:pr-0 lg:last:pr-2"
                    >
                        {/* Top accent bar (steel only) */}
                        {isSteel && (
                            <div
                                className="w-8 h-px bg-[var(--color-accent)] mb-5"
                                aria-hidden="true"
                            />
                        )}

                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-4">
                            /{String(i + 1).padStart(2, "0")}
                        </span>

                        <div className="text-stat-lg font-light metallic-gold-static tabular-nums leading-stat mb-5">
                            <Counter
                                from={0}
                                to={stat.value}
                                prefix={stat.prefix ?? ""}
                                suffix={stat.suffix ?? ""}
                            />
                        </div>

                        <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/55 font-semibold leading-[1.5] max-w-[16ch]">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
}
