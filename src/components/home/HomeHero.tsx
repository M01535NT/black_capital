"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { EASE_OUT, useScrollScale, useSectionRef } from "./_motion";

const headlineWords: { t: string; gold?: boolean }[] = [
  { t: "Cada" },
  { t: "propiedad," },
  { t: "su", gold: true },
  { t: "estrategia.", gold: true },
];

const wordParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};
const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  show: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } },
};

const YEARS = String(CONTACT_CONFIG.business.yearsInBusiness).padStart(2, "0");
const FACTS: React.ReactNode[] = [
  "Tijuana · Baja California",
  "Residencial · Comercial · Industrial",
  "Compra · Venta · Renta",
  <>
    <span className="gold-ink font-extrabold">{YEARS}</span> años operando
  </>,
  "Valuación comercial sin costo",
];

/**
 * Ticker continuo seamless: dos copias del contenido en un track de ancho
 * natural que se desplaza -50% en loop (ver .marquee-track en globals). Cada
 * ítem lleva su separador en diamante, así el espaciado es uniforme incluso
 * en la costura. Firma de marca conservada; pausa en hover.
 */
function HeroTicker() {
  const items = [...FACTS, ...FACTS];
  return (
    <div className="marquee-viewport relative z-10 overflow-hidden border-t border-[var(--color-accent)]/15 bg-white/[0.03] py-3.5 backdrop-blur-sm sm:py-4">
      <div className="marquee-track items-center">
        {items.map((fact, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center property-tag-type text-white/70"
            aria-hidden={i >= FACTS.length ? "true" : undefined}
          >
            <span className="whitespace-nowrap">{fact}</span>
            <span aria-hidden="true" className="mx-5 h-1 w-1 rotate-45 bg-[var(--color-accent)]/80 sm:mx-8" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomeHero() {
  const reduce = useReducedMotion();
  const ref = useSectionRef<HTMLElement>();
  const bgTransform = useScrollScale(ref, 1.14, 1);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden border-b border-white/[0.08]"
    >
      {/* Fondo estático (imagen generada) con parallax de escala en scroll */}
      <motion.div className="absolute inset-0" style={bgTransform ? { transform: bgTransform } : undefined}>
        <Image
          src="/home-hero-bg.webp"
          alt="Residencia contemporánea en Tijuana al atardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* Scrim para legibilidad */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent"
      />
      <div className="grain-overlay" aria-hidden="true" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center xl:grid xl:grid-cols-[1.5fr_1fr] xl:items-center xl:gap-10 px-6 pb-10 pt-28 sm:px-10 lg:px-16 lg:pb-16">
        <div className="min-w-0">
          <motion.div
            className="mb-6 flex items-center gap-3"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="h-px w-8 bg-[var(--color-accent)]" aria-hidden="true" />
            <span className="property-tag-type gold-ink">Inmobiliaria en Tijuana</span>
          </motion.div>

          <motion.h1
            aria-label="Cada propiedad, su estrategia."
            className="max-w-4xl max-[360px]:-mx-4 font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[0.98] tracking-tight text-white"
            variants={reduce ? undefined : wordParent}
            initial={reduce ? false : "hidden"}
            animate={reduce ? false : "show"}
          >
            {headlineWords.map((w, i) => (
              <motion.span
                key={`${w.t}-${i}`}
                variants={reduce ? undefined : wordChild}
                className={`mr-[0.28em] inline-block max-w-full last:mr-0 [overflow-wrap:anywhere] ${w.gold ? "gold-ink" : ""}`}
              >
                {w.t}{i < headlineWords.length - 1 ? " " : null}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-body-lg text-white/70"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE_OUT }}
          >
            Compra, venta y renta en Tijuana. Sin sorpresas en precio, papeles
            ni cierre.
          </motion.p>
        </div>

        <form
          action="/inventario"
          method="get"
          role="search"
          aria-label="Buscar propiedades"
          className="mt-9 grid grid-cols-2 gap-4 border border-white/[0.14] bg-black/40 p-5 backdrop-blur-sm sm:grid-cols-3 xl:mt-0 xl:grid-cols-2"
        >
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Operación</span>
            <select name="tipo" defaultValue="Venta" className="min-h-11 w-full border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
              <option value="Venta">Venta</option>
              <option value="Renta">Renta</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Uso</span>
            <select name="uso" defaultValue="" className="min-h-11 w-full border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
              <option value="">Todos</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Zona</span>
            <input name="zona" type="search" placeholder="Ej. Zona Río" className="min-h-11 w-full min-w-0 border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]" />
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Moneda</span>
            <select name="moneda" defaultValue="MXN" className="min-h-11 w-full border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Precio mínimo</span>
            <input name="precioMin" type="number" min="0" step="any" inputMode="decimal" placeholder="Desde" className="min-h-11 w-full min-w-0 border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]" />
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="property-tag-type text-white/70">Precio máximo</span>
            <input name="precioMax" type="number" min="0" step="any" inputMode="decimal" placeholder="Hasta" className="min-h-11 w-full min-w-0 border border-white/[0.14] bg-background px-3 text-[0.95rem] font-semibold text-white placeholder:text-white/40 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]" />
          </label>
          <div className="col-span-full flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:items-stretch">
            <button type="submit" className="brushed-gold premium-cta inline-flex min-h-[52px] items-center justify-center gap-2 rounded-none active:scale-[0.98]">
              Buscar propiedades
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link href="/propietarios" className="group inline-flex w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]">
              <span className="property-tag-type relative pb-1">
                Quiero vender o rentar mi propiedad
                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </form>
      </div>

      {/* Marquee (firma conservada) */}
      <HeroTicker />
    </section>
  );
}
