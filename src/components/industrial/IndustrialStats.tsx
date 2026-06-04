"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";

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

        // Reduced motion: skip animation entirely
        if (shouldReduceMotion) {
            hasAnimated.current = true;
            setCount(to);
            return;
        }

        // In view: run animation
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

        // Fallback: if after 3 seconds we still haven't animated, force final value
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

const stats = [
    { value: 250000, label: "m² en Portafolio", suffix: "+", prefix: "" },
    { value: 45, label: "Naves Activas", suffix: "+", prefix: "" },
    { value: 12, label: "Parques Logísticos", suffix: "+", prefix: "" },
    { value: 8, label: "Estados Cubiertos", suffix: "", prefix: "" },
];

export function IndustrialStats() {
    return (
        <FadeIn direction="up">
            <section className="w-full bg-background-deep border-y border-steel-500/15 py-20 relative overflow-hidden">
                {/* Subtle grid background */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, oklch(1 0 0 / 30%) 1px, transparent 1px),
                            linear-gradient(to bottom, oklch(1 0 0 / 30%) 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px",
                    }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center p-6 space-y-3 relative"
                            >
                                {/* Vertical divider */}
                                {i > 0 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-steel-500/25 to-transparent" />
                                )}

                                {/* Gold top bar */}
                                <div className="w-8 h-[2px] bg-gradient-to-r from-gold-700 to-gold-500 mb-2" />

                                <h4 className="text-4xl md:text-5xl lg:text-6xl font-numerics font-bold metallic-gold flex items-center">
                                    <Counter
                                        from={0}
                                        to={stat.value}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                    />
                                </h4>
                                <p className="font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-foreground/50">
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
