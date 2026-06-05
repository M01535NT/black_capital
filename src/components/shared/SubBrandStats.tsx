/**
 * SubBrandStats — animated counter grid for the 3 sub-brand landings.
 *
 * Replaces:
 *   - src/components/luxury/LuxuryStats.tsx
 *   - src/components/business/BusinessStats.tsx
 *   - src/components/industrial/IndustrialStats.tsx
 *
 * Each sub-brand page now passes a `brand` + `stats` + `accent` config;
 * the old component names are kept alive via thin re-exports in the
 * per-brand folders so import paths don't break elsewhere.
 *
 * Design rules (per FRONTEND_RECOMMENDATIONS.md):
 *   - font-numerics + metallic-gold for the value (tabular nums)
 *   - text-foreground/50 for the label (AA-compliant)
 *   - Gold dividers for "gold" accent, steel for "steel"
 *   - "steel" accent enables the industrial grid background + top accent bar
 *     per stat
 *   - The `Counter` is inlined here (was duplicated 3× in the old files).
 *     set-state-in-effect is bypassed by checking the ref synchronously
 *     before scheduling a rAF; the synchronous setState in the previous
 *     files was the source of 3 ESLint errors.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";

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
    stats: StatItem[];
    accent: Accent;
    /** Optional: override the default panel padding (e.g. "py-20" for industrial). */
    panelClassName?: string;
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

        // Reduced motion: initial state was already set to `to`
        // (see useState above), so we just mark as done.
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

        // Fallback: if after 3 seconds we still haven't animated, force
        // the final value. The setState lives inside a setTimeout callback
        // (not the effect body), so it doesn't trip set-state-in-effect.
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
    stats,
    accent,
    panelClassName,
}: SubBrandStatsProps) {
    const isSteel = accent === "steel";
    const dividerColor = isSteel ? "via-steel-500/25" : "via-gold-500/15";
    const dividerHeight = isSteel ? "h-16" : "h-20";

    // Panel chrome: gold uses a deep-zinc gradient; steel uses the
    // background-deep token + subtle industrial grid overlay.
    const panelChrome = isSteel
        ? "bg-background-deep"
        : "bg-gradient-to-b from-background via-background-deep to-background";

    return (
        <FadeIn direction="up">
            <section
                aria-label={`Estadísticas de ${brand}`}
                className={`w-full ${panelChrome} border-y ${isSteel ? "border-steel-500/15" : "border-gold-500/10"} ${panelClassName ?? (isSteel ? "py-20" : "py-24")} relative overflow-hidden`}
            >
                {/* Subtle grid background (steel only) */}
                {isSteel && (
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.02]"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, oklch(1 0 0 / 30%) 1px, transparent 1px),
                                linear-gradient(to bottom, oklch(1 0 0 / 30%) 1px, transparent 1px)
                            `,
                            backgroundSize: "60px 60px",
                        }}
                        aria-hidden="true"
                    />
                )}

                {/* Floating orbs (gold only) */}
                {!isSteel && (
                    <>
                        <div
                            className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold-500/[0.03] blur-[100px] animate-float-slow pointer-events-none"
                            aria-hidden="true"
                        />
                        <div
                            className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-gold-600/[0.03] blur-[80px] animate-float pointer-events-none"
                            aria-hidden="true"
                        />
                    </>
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center justify-center p-6 space-y-3 relative"
                            >
                                {/* Vertical divider (desktop only) */}
                                {i > 0 && (
                                    <div
                                        className={`hidden md:block absolute left-0 top-1/2 -translate-y-1/2 ${dividerHeight} w-px bg-gradient-to-b from-transparent ${dividerColor} to-transparent`}
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Top accent bar (steel only) */}
                                {isSteel && (
                                    <div
                                        className="w-8 h-0.5 bg-gradient-to-r from-gold-700 to-gold-500 mb-2"
                                        aria-hidden="true"
                                    />
                                )}

                                <h4 className="text-4xl md:text-5xl lg:text-6xl font-numerics font-bold metallic-gold flex items-center">
                                    <Counter
                                        from={0}
                                        to={stat.value}
                                        prefix={stat.prefix ?? ""}
                                        suffix={stat.suffix ?? ""}
                                    />
                                </h4>
                                <p className="font-display text-caption md:text-body-sm font-bold uppercase tracking-wide-display text-foreground/50">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </FadeIn>
    );
}
