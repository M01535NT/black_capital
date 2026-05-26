"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BusinessHero() {
    const shouldReduceMotion = useReducedMotion();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (shouldReduceMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [shouldReduceMotion]);

    return (
        <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
            {/* ── Background Image ── */}
            <Image
                src="/business-hero.png"
                alt="Oficina corporativa premium"
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />

            {/* ── Cool Dark Overlay ── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />

            {/* ── Cursor Follow Glow ── */}
            {!shouldReduceMotion && (
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[120px] pointer-events-none z-0"
                    animate={{
                        x: mousePos.x - 250,
                        y: mousePos.y - 250,
                    }}
                    transition={{ type: "spring", damping: 30, stiffness: 150 }}
                />
            )}

            {/* ── Floating Orbs ── */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-gold-400/5 blur-[100px] animate-float-slow pointer-events-none" />
            <div className="absolute bottom-1/3 left-1/6 w-64 h-64 rounded-full bg-gold-600/5 blur-[80px] animate-float pointer-events-none" />

            {/* ── Noise Overlay ── */}
            <div className="grain-overlay" />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-5xl space-y-10">
                    {/* Vertical Label */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4"
                    >
                        <div className="w-12 h-px bg-gradient-to-r from-gold-700 to-gold-400" />
                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em]">
                            Black Business
                        </span>
                    </motion.div>

                    {/* ── Main Headline ── */}
                    <motion.h1
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="hero-title text-5xl md:text-7xl lg:text-[100px] text-foreground"
                    >
                        Espacios que
                        <br />
                        Impulsan{" "}
                        <span className="metallic-gold">Negocios</span>
                    </motion.h1>

                    {/* ── Gold Separator ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-24 h-px bg-gradient-to-r from-gold-500 to-gold-700 origin-left"
                    />

                    {/* ── Subtitle ── */}
                    <motion.p
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-base md:text-lg text-foreground/50 max-w-lg leading-relaxed"
                    >
                        Oficinas corporativas, locales comerciales y plazas premium
                        seleccionadas para empresas que exigen ubicación estratégica,
                        eficiencia operativa y retorno garantizado.
                    </motion.p>

                    {/* ── CTA ── */}
                    <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-wrap items-center gap-6"
                    >
                        <Link href="/inventario?brand=business">
                            <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase px-8 py-6 text-sm rounded-full group">
                                Explorar Portafolio
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link
                            href="#business-cta"
                            className="text-sm text-foreground/40 hover:text-gold-500 uppercase tracking-[0.3em] font-medium transition-colors"
                        >
                            Solicitar Asesoría Corporativa
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
                    <ChevronDown className="w-5 h-5 text-gold-500/60" />
                </motion.div>
            </motion.div>
        </section>
    );
}
