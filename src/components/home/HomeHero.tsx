"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Oswald } from "next/font/google";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { PropertyFinder } from "./PropertyFinder";
import { EASE_OUT } from "./_motion";
import { useState, useSyncExternalStore } from "react";
import styles from "./HomeHero.module.css";

const heroFont = Oswald({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });
const processLabels = ["Precio correcto", "Presentación", "Exposición", "Seguimiento", "Negociación", "Cierre", "Resultados", "Valor real"];

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function motionAllowed() { return !window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

export function HomeHero({ imageUrl = "", videoUrl = "" }: { imageUrl?: string; videoUrl?: string }) {
  const reduce = useReducedMotion();
  const allowVideo = useSyncExternalStore(subscribeMotion, motionAllowed, () => false);
  const [failedVideo, setFailedVideo] = useState("");
  return <section data-section="cinematic-hero" className="relative isolate flex min-h-[48rem] flex-col overflow-hidden bg-background lg:h-[100svh] lg:min-h-[48rem]">
    <CinematicImage src={imageUrl || "/home-hero-bg.webp"} alt="Arquitectura residencial contemporánea en Tijuana al atardecer" priority sizes="(max-width: 640px) 180vh, 100vw" className="absolute inset-0 -z-20" imageClassName="object-[57%_center] brightness-[0.72] saturate-[0.65] sepia-[0.35]" />
    {allowVideo && videoUrl && failedVideo !== videoUrl && <video src={videoUrl} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" onError={() => setFailedVideo(videoUrl)} />}
    <div className="pointer-events-none absolute inset-0 -z-10 bg-black/40" />

    <div className="mx-auto flex w-full max-w-[70rem] flex-1 flex-col items-center justify-center px-5 pb-12 pt-32 text-center sm:px-10 sm:pb-16 lg:pb-10 lg:pt-28">
      <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className={`${heroFont.className} mb-7 text-xs font-semibold uppercase tracking-[0.3em] text-[#e4c078] sm:mb-8`}>
        Baja California
      </motion.p>
      <h1 aria-label="Tu propiedad, vendida como debe ser." className={`${heroFont.className} w-full text-[clamp(2.75rem,6.15vw,6.5rem)] font-semibold uppercase leading-[1.05] tracking-[0.015em] text-[#f6f3ec]`}>
        <motion.span className="block" initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}>Tu propiedad,</motion.span>
        <motion.span className="block" initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT }}>vendida <span className="text-[#e4c078]">como</span></motion.span>
        <motion.span className="block text-[#e4c078]" initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}>debe ser.</motion.span>
      </h1>
      <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }} className="mt-7 flex flex-col items-center sm:mt-8">
        <p className={`${heroFont.className} max-w-[23rem] text-base font-normal leading-[1.8] text-white/75 sm:text-lg`}>Valoración y representación seria en Tijuana,<br className="hidden sm:block" /> Rosarito, Ensenada y Tecate.</p>
        <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10 sm:gap-6">
          <Link href="/propietarios?service=opinion-de-valor#solicitud" className={`${heroFont.className} inline-flex min-h-[52px] items-center justify-center border border-[#cda953] bg-[#080808] px-9 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#e4c078] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c078] sm:min-w-[250px]`}>Solicitar valoración</Link>
          <Link href="/inventario" className={`${heroFont.className} group inline-flex min-h-11 items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-[#e4c078] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c078]`}>Explorar inventario<ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" /></Link>
        </div>
      </motion.div>
    </div>
    <div className="mx-auto flex w-full max-w-[100rem] flex-col items-center justify-between gap-5 px-6 pb-6 sm:flex-row sm:px-10 lg:px-16">
        <nav aria-label="Tipos de propiedad" className="flex flex-wrap justify-center gap-x-6 gap-y-3 property-tag-type text-white/65">
          <Link href="/black-luxury" className="transition-colors hover:text-[var(--color-accent)]">Residencial</Link>
          <Link href="/black-business" className="transition-colors hover:text-[var(--color-accent)]">Comercial</Link>
          <Link href="/black-industrial" className="transition-colors hover:text-[var(--color-accent)]">Industrial</Link>
        </nav>
        <PropertyFinder />
    </div>
    <div aria-hidden="true" data-hero-marquee className={`${styles.marquee} overflow-hidden border-t border-white/10 bg-black/75 py-3 sm:py-4`}>
      <div className={`${styles.marqueeTrack} ${heroFont.className} flex w-max text-lg font-semibold uppercase tracking-[0.11em] text-[#f6f3ec] sm:text-xl lg:text-2xl`}>
        {[0, 1].map(copy => <div key={copy} className="flex min-w-[100vw] shrink-0 items-center justify-around gap-10 pr-10 sm:gap-14 sm:pr-14">
          {processLabels.map(label => <span key={label} className="shrink-0">{label}</span>)}
        </div>)}
      </div>
    </div>
  </section>;
}
