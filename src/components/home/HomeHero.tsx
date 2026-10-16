"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { PropertyFinder } from "./PropertyFinder";
import { EASE_OUT } from "./_motion";
import { useState, useSyncExternalStore } from "react";

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
  return <section data-section="cinematic-hero" className="relative isolate flex min-h-[48rem] flex-col justify-end overflow-hidden bg-background pb-7 pt-32 sm:min-h-[56rem] lg:h-[100svh] lg:min-h-[46rem]">
    <CinematicImage src={imageUrl || "/home-hero-bg.webp"} alt="Arquitectura residencial contemporánea en Tijuana al atardecer" priority className="absolute inset-0 -z-20" imageClassName="object-[57%_center]" />
    {allowVideo && videoUrl && failedVideo !== videoUrl && <video src={videoUrl} autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" onError={() => setFailedVideo(videoUrl)} />}
    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/10 to-black/20" />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

    <div className="mx-auto w-full max-w-[100rem] px-6 sm:px-10 lg:px-16">
      <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }} className="mb-7 flex items-center gap-3 property-tag-type text-white/85">
        <span className="h-px w-8 bg-[var(--color-accent)]" aria-hidden="true" />Tijuana, Baja California
      </motion.p>
      <h1 aria-label="Cada propiedad, su estrategia." className="max-w-6xl font-display text-[clamp(2.25rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-white">
        {["Cada propiedad,", "su estrategia."].map((line, i) => <span key={line} className="block overflow-hidden pb-[0.13em]">
          <motion.span className={`block ${i ? "gold-ink" : ""}`} initial={reduce ? false : { y: "110%", rotate: 2 }} animate={{ y: "0%", rotate: 0 }} transition={{ duration: 1.2, delay: 0.25 + i * 0.16, ease: EASE_OUT }}>{line}</motion.span>
        </span>)}
      </h1>
      <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.75, ease: EASE_OUT }} className="mt-7 flex flex-col justify-between gap-8 pb-10 sm:flex-row sm:items-end lg:pb-14">
        <p className="max-w-[25rem] text-body-lg text-white/80">Espacios para vivir.<br />Lugares para lo que sigue.</p>
        <div className="flex flex-wrap items-center gap-5">
          <PropertyFinder />
          <Link href="/inventario" className="group flex size-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-black transition-transform duration-500 hover:rotate-45" aria-label="Explorar todas las propiedades"><ArrowUpRight className="size-6" aria-hidden="true" /></Link>
        </div>
      </motion.div>
      <div className="flex items-center justify-between gap-5 border-t border-white/25 pt-5">
        <div className="flex flex-wrap gap-x-6 gap-y-3 property-tag-type text-white/65">
          <Link href="/black-luxury" className="transition-colors hover:text-[var(--color-accent)]">Residencial</Link>
          <Link href="/black-business" className="transition-colors hover:text-[var(--color-accent)]">Comercial</Link>
          <Link href="/black-industrial" className="transition-colors hover:text-[var(--color-accent)]">Industrial</Link>
        </div>
        <a href="#seleccion" aria-label="Descubrir la selección" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white"><ArrowDown className="size-4" aria-hidden="true" /></a>
      </div>
    </div>
  </section>;
}
