"use client";

import { useEffect, useRef } from "react";
import { Oswald } from "next/font/google";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { usePublicContact } from "@/components/public/site-settings-provider";
import type { HomeMetrics } from "@/lib/home-metrics";
import { EASE_OUT } from "./_motion";

const methodFont = Oswald({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });
const statement = "Una propiedad bien vendida no es suerte. Es precio correcto, presentación seria y seguimiento todos los días. Así trabajamos.";
const lines = ["Una propiedad bien", "vendida no es", "suerte. Es precio", "correcto,", "presentación seria y", "seguimiento todos", "los días. Así", "trabajamos."];

function RotatingNumber({ value, label }: { value: number | null; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const digits = value === null ? [] : String(Math.max(0, Math.floor(value))).split("");
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const reels = root.current?.querySelectorAll<HTMLElement>("[data-digit-reel]");
      if (!reels?.length) return;
      gsap.fromTo(reels, { y: 0, yPercent: 0 }, {
        yPercent: (_, reel) => -(20 + Number(reel.dataset.digit)) / 30 * 100,
        duration: 2.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
      });
    }, root);
    return () => media.revert();
  }, [value]);

  return <div ref={root} className="min-w-0 text-center" data-method-counter data-value={value ?? "unknown"}>
    <span className="sr-only">{value === null ? "Dato no disponible" : value} {label}</span>
    <div aria-hidden="true" className="flex justify-center text-[clamp(2.125rem,4vw,2.75rem)] font-semibold leading-none tabular-nums text-[#d8b45c]">
      {value === null ? <span>—</span> : digits.map((digit, index) => <span key={index} className="relative inline-block h-[1.15em] w-[0.62em] overflow-hidden">
        <span data-digit-reel data-digit={digit} className="absolute inset-x-0 top-0 flex flex-col" style={{ transform: `translateY(${-(20 + Number(digit)) / 30 * 100}%)` }}>
          {Array.from({ length: 30 }, (_, row) => <span key={row} className="flex h-[1.15em] shrink-0 items-center justify-center">{row % 10}</span>)}
        </span>
      </span>)}
    </div>
    <p aria-hidden="true" className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[#b0aaa0] sm:tracking-[0.2em]">{label}</p>
  </div>;
}

export function MethodologyStack({ metrics }: { metrics: HomeMetrics }) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const contact = usePublicContact();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(root.current!.querySelectorAll("[data-method-line]"),
        { yPercent: 110, opacity: 0, rotationX: -25, transformOrigin: "50% 100%" },
        { yPercent: 0, opacity: 1, rotationX: 0, duration: 0.9, stagger: 0.085, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
    }, root);
    return () => media.revert();
  }, []);

  return <section ref={root} id="asi-trabajamos" data-section="home-methodology" aria-labelledby="method-statement" className={`${methodFont.className} relative isolate scroll-mt-20 overflow-hidden bg-[#080807] px-5 pb-10 pt-20 text-center sm:px-10 lg:pb-8 lg:pt-24`}>
    <CinematicImage src="/home-hero-bg.webp" alt="Arquitectura contemporánea al anochecer" className="absolute inset-0 -z-20" imageClassName="brightness-[0.5] saturate-[0.5]" />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-black/[0.88]" />
    <h2 id="method-statement" aria-label={statement} className="mx-auto max-w-[31rem] text-[clamp(1.7rem,8.2vw,3rem)] font-semibold uppercase leading-[1.1] tracking-[-0.01em] text-[#f5f2eb]">
      {lines.map((line, index) => <span key={line} className="block overflow-hidden">
        <span data-method-line className={`block ${index === 7 ? "text-[#d8b45c]" : ""}`}>
          {index === 6 ? <>Los días. <span className="text-[#d8b45c]">Así</span></> : line}
        </span>
      </span>)}
    </h2>
    <div role="region" aria-label="Indicadores comerciales Black Capital" className="mx-auto mt-10 grid max-w-[40rem] grid-cols-4 gap-2 sm:gap-6">
      <RotatingNumber value={metrics.properties} label="Propiedades" />
      <RotatingNumber value={metrics.sectors} label="Sectores" />
      <RotatingNumber value={metrics.cities} label="Ciudades" />
      <RotatingNumber value={metrics.advisors} label="Asesores" />
    </div>
    <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.75, ease: EASE_OUT }} className="mx-auto mt-11 max-w-2xl" data-method-contact>
      <h3 className="text-[clamp(1.4rem,5.6vw,1.9rem)] font-semibold uppercase leading-tight text-[#f5f2eb]">¿Hablamos de tu propiedad?</h3>
      <p className="mt-3 text-xs font-normal text-[#aaa49a]">Respuesta directa, sin formularios eternos.</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
        <motion.a href={`https://wa.me/${contact.phoneRaw}?text=${encodeURIComponent("Hola, me gustaría recibir información sobre la venta de mi propiedad.")}`} target="_blank" rel="noopener noreferrer" whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.98 }} className="inline-flex min-h-11 items-center justify-center bg-[#d8b45c] px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#ecd18d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b45c]">Pedir información</motion.a>
        <a href={`tel:+${contact.phoneRaw}`} className="inline-flex min-h-11 items-center text-xs tracking-[0.16em] text-[#aaa49a] transition-colors hover:text-[#d8b45c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b45c]">{contact.phone}</a>
      </div>
    </motion.div>
  </section>;
}
