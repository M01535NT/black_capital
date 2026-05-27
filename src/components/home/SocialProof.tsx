"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";

function Counter({ from, to, duration = 2, suffix = "" }: { from: number; to: number; duration?: number; suffix?: string }) {
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
            let rafHandle: number;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                setCount(Math.floor(progress * (to - from) + from));
                if (progress < 1) {
                    rafHandle = window.requestAnimationFrame(step);
                }
            };
            rafHandle = window.requestAnimationFrame(step);
            return () => {
                if (rafHandle) window.cancelAnimationFrame(rafHandle);
            };
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

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
    { value: 15, label: "Años de Experiencia", suffix: "+" },
    { value: 500, label: "Negocios Cerrados", suffix: "+" },
    { value: 1200, label: "Clientes Satisfechos", suffix: "+" },
    { value: 2800, label: "Millones MXN en Portafolio", suffix: "" },
];

export function SocialProof() {
    return (
        <FadeIn direction="up">
            <section className="w-full bg-gradient-to-b from-background via-zinc-950 to-background border-y border-gold-500/10 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-6 space-y-3 relative">
                                {/* Vertical divider (hidden on first) */}
                                {i > 0 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent" />
                                )}
                                <h4 className="text-4xl md:text-5xl lg:text-6xl font-numerics font-bold metallic-gold flex items-center">
                                    <Counter from={0} to={stat.value} suffix={stat.suffix} />
                                </h4>
                                <p className="font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-foreground/60">
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
