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
    const [count, setCount] = useState(from);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (isInView && !shouldReduceMotion) {
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
        } else if (isInView && shouldReduceMotion) {
            setCount(to);
        }
    }, [isInView, from, to, duration, shouldReduceMotion]);

    return (
        <span ref={ref}>
            {prefix}
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

const stats = [
    { value: 420, label: "Millones USD en Transacciones", suffix: "+", prefix: "$" },
    { value: 85, label: "Oficinas Corporativas", suffix: "+", prefix: "" },
    { value: 18, label: "Plazas Comerciales", suffix: "+", prefix: "" },
    { value: 95, label: "Tasa de Ocupación", suffix: "%", prefix: "" },
];

export function BusinessStats() {
    return (
        <FadeIn direction="up">
            <section className="w-full bg-gradient-to-b from-background via-zinc-950 to-background border-y border-gold-500/10 py-24 relative overflow-hidden">
                {/* Floating gold orbs */}
                <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold-500/3 blur-[100px] animate-float-slow pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-gold-600/3 blur-[80px] animate-float pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center p-6 space-y-3 relative"
                            >
                                {/* Vertical divider */}
                                {i > 0 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-20 w-px bg-gradient-to-b from-transparent via-gold-500/15 to-transparent" />
                                )}

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
