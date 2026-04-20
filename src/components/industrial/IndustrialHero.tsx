"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
    { value: "250K+", label: "m² en portafolio" },
    { value: "45+", label: "naves activas" },
    { value: "8", label: "estados" },
];

export function IndustrialHero() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
            {/* ── Background Image ── */}
            <Image
                src="/industrial-hero.png"
                alt="Complejo industrial moderno"
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />

            {/* ── Dark Overlay ── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />

            {/* ── Grid Lines (decorative) ── */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(to right, oklch(1 0 0 / 20%) 1px, transparent 1px),
                        linear-gradient(to bottom, oklch(1 0 0 / 20%) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }} />
            </div>

            {/* ── Noise Overlay ── */}
            <div className="grain-overlay" />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-5xl space-y-10">
                    {/* Vertical Label */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-px bg-steel-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-steel-400">
                            Black Industrial
                        </span>
                    </motion.div>

                    {/* ── Main Headline ── */}
                    <motion.h1
                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-[96px] font-display font-bold text-foreground leading-[0.92] tracking-[-0.03em] uppercase"
                    >
                        Infraestructura
                        <br />
                        <span className="metallic-gold">que Escala</span>
                    </motion.h1>

                    {/* ── Steel Separator ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-32 h-px bg-gradient-to-r from-steel-500 to-gold-700 origin-left"
                    />

                    {/* ── Subtitle ── */}
                    <motion.p
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed"
                    >
                        Terrenos macro, naves industriales clase A y parques logísticos
                        en los principales corredores de México. Análisis estructurado
                        para decisiones de inversión institucional.
                    </motion.p>

                    {/* ── Quick Stats Bar ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-wrap gap-8 md:gap-12 pt-4"
                    >
                        {highlights.map((stat) => (
                            <div key={stat.label} className="flex flex-col">
                                <span className="text-3xl md:text-4xl font-numerics font-bold metallic-gold">
                                    {stat.value}
                                </span>
                                <span className="text-xs uppercase tracking-[0.2em] text-foreground/40 font-medium mt-1">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* ── CTA ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Link href="/inventario?brand=industrial">
                            <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase px-8 py-6 text-sm group">
                                Ver Inventario Industrial
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ── Scroll Indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/25 font-medium">
                    Descubre más
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-steel-500/60" />
                </motion.div>
            </motion.div>
        </section>
    );
}
