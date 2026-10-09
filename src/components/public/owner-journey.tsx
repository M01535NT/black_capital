"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { ContactLeadForm } from "@/components/public/contact-lead-form";

const services = [
  { title: "Opinión de valor", body: "Una referencia comercial para definir el precio de salida y revisar expectativas.", service: "opinion-de-valor" },
  { title: "Revisión de factibilidad", body: "Identificamos la información y las condiciones que deben revisarse antes de ofrecer el inmueble.", service: "dictamen-factibilidad" },
  { title: "Plan de comercialización", body: "Definimos el público, los canales y la presentación de acuerdo con tu objetivo.", service: "plan-comercializacion" },
  { title: "Fotografía y video", body: "Preparamos el material visual que ayuda a conocer los espacios y sus características.", service: "fotografia-video" },
];
const steps = [
  { title: "Conocemos tu inmueble", body: "Revisamos ubicación, características y lo que quieres lograr." },
  { title: "Definimos la estrategia", body: "Acordamos condiciones, precio de salida y alcance del servicio." },
  { title: "Presentamos y damos seguimiento", body: "Organizamos la difusión, las consultas y las visitas conforme al encargo." },
  { title: "Acompañamos la operación", body: "Damos seguimiento a las propuestas, los acuerdos y los requisitos del cierre." },
];

export function OwnerJourney() {
  const searchParams = useSearchParams();
  const [goal, setGoal] = useState(["rentar", "renta", "poner-en-renta"].includes(searchParams.get("objetivo") || "") ? "Poner en renta" : "Vender");
  const goalParam = goal === "Vender" ? "vender" : "rentar";
  return (
    <div className="w-full flex-1 bg-background">
      <section className="relative overflow-hidden border-b border-white/10 pt-28 sm:pt-36">
        <Image src="/hero-poster.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="relative mx-auto max-w-[90rem] px-6 py-12 sm:px-10 lg:px-16 lg:py-20">
          <p className="mb-5 property-tag-type text-[var(--color-accent)]">Para propietarios · Tijuana</p>
          <h1 className="max-w-5xl text-display-1 leading-hero tracking-tight text-white text-balance">Vende o renta tu inmueble con una estrategia definida.</h1>
          <p className="mt-6 max-w-2xl text-body-fluid leading-relaxed text-white/65">Partimos de tu objetivo, las condiciones del inmueble y su mercado para acordar cómo avanzar.</p>
          <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Qué quieres hacer con tu inmueble">
            {["Vender", "Poner en renta"].map((option) => <button key={option} type="button" onClick={() => setGoal(option)} aria-pressed={goal === option} className={`inline-flex min-h-12 items-center gap-2 border px-6 text-body font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)] ${goal === option ? "brushed-gold border-[var(--color-accent)] text-black" : "border-white/25 bg-black/30 text-white hover:border-[var(--color-accent)]"}`}>{goal === option && <Check className="h-4 w-4" aria-hidden="true" />}{option}</button>)}
          </div>
          <a href="#solicitud" className="mt-7 inline-flex min-h-11 items-center gap-2 text-body-sm text-[var(--color-accent)] underline underline-offset-4">Hablar de mi inmueble<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
      </section>
      <section aria-labelledby="servicios-title" className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <p className="mb-3 property-tag-type text-[var(--color-accent)]">Servicios</p>
        <h2 id="servicios-title" className="max-w-3xl text-display-2 leading-display tracking-headline text-white">El apoyo que necesita tu operación.</h2>
        <p className="mt-4 max-w-2xl text-body text-white/60">Definimos contigo cuáles aplican a tu inmueble y su alcance antes de comenzar.</p>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{services.map((service) => <article key={service.service} className="flex flex-col border border-white/10 bg-white/[0.02] p-6"><h3 className="mb-4 text-body-lg font-semibold text-white">{service.title}</h3><p className="mb-6 text-body leading-relaxed text-white/55">{service.body}</p><Link href={`/contacto?servicio=${service.service}&objetivo=${goalParam}`} className="mt-auto inline-flex min-h-11 items-center gap-2 text-body-sm text-[var(--color-accent)]">Consultar servicio<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></article>)}</div>
      </section>
      <section aria-labelledby="proceso-title" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <p className="mb-3 property-tag-type text-[var(--color-accent)]">Proceso</p><h2 id="proceso-title" className="text-display-2 leading-display tracking-headline text-white">Un siguiente paso claro.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, index) => <li key={step.title}><span className="property-tag-type text-[var(--color-accent)]">0{index + 1}</span><h3 className="mb-3 mt-4 text-body-lg font-semibold text-white">{step.title}</h3><p className="text-body leading-relaxed text-white/55">{step.body}</p></li>)}</ol>
        </div>
      </section>
      <section id="solicitud" aria-labelledby="owner-form-title" className="mx-auto grid max-w-[90rem] scroll-mt-28 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        <div><p className="mb-3 property-tag-type text-[var(--color-accent)]">Para comenzar</p><h2 id="owner-form-title" className="text-display-2 leading-display tracking-headline text-white">Cuéntanos sobre tu inmueble.</h2><p className="mt-5 text-body leading-relaxed text-white/60">Con el tipo de inmueble, la zona y tu objetivo podemos iniciar una conversación. No necesitas subir documentos en este paso.</p><ul className="mt-7 space-y-4 text-body text-white/65">{["Tipo de inmueble y ubicación aproximada.", "Si buscas vender o poner en renta.", "Un correo para responderte; teléfono opcional."].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />{item}</li>)}</ul></div>
        <div className="min-w-0 border border-white/10 bg-white/[0.025] p-5 sm:p-8"><ContactLeadForm ownerGoal={goal} onOwnerGoalChange={setGoal} /></div>
      </section>
    </div>
  );
}
