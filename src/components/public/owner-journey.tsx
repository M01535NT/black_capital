"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Plus } from "lucide-react";
import { ContactLeadForm } from "@/components/public/contact-lead-form";
import { CinematicImage } from "@/components/visual/CinematicImage";

const services = [
  { title: "Opinión de valor", body: "Una referencia comercial para definir el precio de salida y revisar expectativas.", service: "opinion-de-valor" },
  { title: "Revisión de factibilidad", body: "Identificamos la información y las condiciones que deben revisarse antes de ofrecer el inmueble.", service: "dictamen-factibilidad" },
  { title: "Plan de comercialización", body: "Definimos el público, los canales y la presentación de acuerdo con tu objetivo.", service: "plan-comercializacion" },
  { title: "Fotografía y video", body: "Preparamos el material visual que ayuda a conocer los espacios y sus características.", service: "fotografia-video" },
];
const steps = [
  { title: "Conocer", body: "Tu inmueble, su ubicación y tu objetivo." },
  { title: "Definir", body: "Precio, condiciones y estrategia." },
  { title: "Presentar", body: "Difusión, consultas y visitas." },
  { title: "Acompañar", body: "Propuestas, acuerdos y cierre." },
];

export function OwnerJourney() {
  const searchParams = useSearchParams();
  const [goal, setGoal] = useState(["rentar", "renta", "poner-en-renta"].includes(searchParams.get("objetivo") || "") ? "Poner en renta" : "Vender");
  const goalParam = goal === "Vender" ? "vender" : "rentar";
  return (
    <div className="w-full flex-1 bg-background">
      <section aria-label="Para propietarios" className="relative">
        <CinematicImage src="/hero-luxury.webp" alt="Arquitectura residencial contemporánea al atardecer" priority className="min-h-[92svh]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
          <div className="relative mx-auto flex min-h-[92svh] max-w-[90rem] flex-col justify-end px-6 pb-16 pt-36 sm:px-10 lg:px-16 lg:pb-24">
            <p className="mb-5 property-tag-type text-[var(--color-accent)]">Para propietarios · Tijuana</p>
            <h1 className="max-w-4xl text-display-1 leading-hero tracking-tight text-white text-balance">Tu inmueble.<br />Su siguiente capítulo.</h1>
            <p className="mt-6 max-w-md text-body-fluid leading-relaxed text-white/75">Una estrategia para vender o rentar, desde el primer paso.</p>
            <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Qué quieres hacer con tu inmueble">
              {["Vender", "Poner en renta"].map((option) => <button key={option} type="button" onClick={() => setGoal(option)} aria-pressed={goal === option} className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-body font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] ${goal === option ? "brushed-gold border-[var(--color-accent)] text-black" : "border-white/35 bg-black/20 text-white backdrop-blur-sm hover:border-[var(--color-accent)]"}`}>{goal === option && <Check className="h-4 w-4" aria-hidden="true" />}{option}</button>)}
            </div>
            <a href="#solicitud" className="mt-5 inline-flex min-h-11 w-fit items-center gap-3 text-body-sm text-white/85">Hablar de mi inmueble<ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </CinematicImage>
      </section>

      <section aria-labelledby="servicios-title" className="mx-auto grid max-w-[90rem] items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:px-16 lg:py-32">
        <CinematicImage src="/line-residencial.webp" alt="Residencia en una ladera con vista a la ciudad" sizes="(min-width: 1024px) 45vw, 100vw" className="h-[420px] rounded-[1.25rem] sm:h-[540px] lg:col-span-6 lg:h-[700px]" />
        <div className="lg:col-span-6">
          <p className="mb-4 property-tag-type text-[var(--color-accent)]">A la medida de tu inmueble</p>
          <h2 id="servicios-title" className="max-w-xl text-display-2 leading-display tracking-headline text-white">Cada propiedad pide una estrategia.</h2>
          <p className="mt-5 max-w-md text-body leading-relaxed text-white/60">Acordamos contigo los servicios y su alcance.</p>
          <div className="mt-9">{services.map((service, index) => <details key={service.service} className="group border-b border-white/15 py-1">
            <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 text-body-lg font-medium text-white/90 transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-[var(--color-accent)] [&::-webkit-details-marker]:hidden"><span className="text-caption text-white/35">0{index + 1}</span><span className="flex-1">{service.title}</span><Plus className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" /></summary>
            <div className="pb-6 pl-8"><p className="max-w-md text-body leading-relaxed text-white/60">{service.body}</p><Link href={`/contacto?servicio=${service.service}&objetivo=${goalParam}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-body-sm text-[var(--color-accent)]">Consultar servicio<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          </details>)}</div>
        </div>
      </section>

      <section aria-labelledby="proceso-title" className="px-3 sm:px-6">
        <CinematicImage src="/closing-cta-bg.webp" alt="" className="rounded-[1.5rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
          <div className="relative mx-auto flex min-h-[620px] max-w-[90rem] flex-col justify-between gap-28 px-6 py-12 sm:px-10 lg:min-h-[700px] lg:px-16 lg:py-16">
            <div><p className="mb-4 property-tag-type text-[var(--color-accent)]">Nuestro método</p><h2 id="proceso-title" className="max-w-xl text-display-2 leading-display tracking-headline text-white">De la intención<br />a la operación.</h2></div>
            <ol className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, index) => <li key={step.title} className="border-t border-white/30 pt-5"><span className="property-tag-type text-[var(--color-accent)]">0{index + 1}</span><h3 className="mb-2 mt-4 text-display-3 text-white">{step.title}</h3><p className="max-w-xs text-body-sm leading-relaxed text-white/70">{step.body}</p></li>)}</ol>
          </div>
        </CinematicImage>
      </section>

      <section id="solicitud" aria-labelledby="owner-form-title" className="mx-auto grid max-w-[90rem] scroll-mt-28 items-start gap-10 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:gap-24 lg:px-16 lg:py-32">
        <div><p className="mb-4 property-tag-type text-[var(--color-accent)]">Comencemos</p><h2 id="owner-form-title" className="max-w-lg text-display-2 leading-display tracking-headline text-white">Cuéntanos sobre tu inmueble.</h2><p className="mt-5 max-w-md text-body leading-relaxed text-white/60">Tipo de propiedad, zona y objetivo. Lo demás lo conversamos contigo.</p><p className="mt-6 text-body-sm text-white/45">Sin documentos en este primer paso.</p></div>
        <div className="min-w-0 rounded-[1.5rem] bg-white/[0.035] p-5 sm:p-8"><ContactLeadForm ownerGoal={goal} onOwnerGoalChange={setGoal} /></div>
      </section>
    </div>
  );
}
