"use client";

import { CinematicImage } from "@/components/visual/CinematicImage";
import { Reveal } from "./_motion";

const steps = [
  { title: "Conocer", text: "El inmueble. Su contexto." },
  { title: "Definir", text: "Precio y estrategia." },
  { title: "Conectar", text: "La propiedad con su comprador." },
  { title: "Acompañar", text: "Hasta el cierre." },
];

export function MethodologyStack() {
  return <section data-section="home-methodology" className="relative py-16 lg:py-24">
    <CinematicImage src="/industrial-hero.webp" alt="Perspectiva arquitectónica en Tijuana" className="relative min-h-[46rem] lg:min-h-[48rem]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/90" />
      <div className="relative mx-auto flex min-h-[46rem] max-w-[100rem] flex-col justify-between px-6 py-14 sm:px-10 lg:min-h-[48rem] lg:px-16 lg:py-20">
        <Reveal className="max-w-xl"><p className="mb-5 property-tag-type gold-ink">El método Black</p><h2 className="text-display-2 leading-display tracking-headline text-white">Criterio en<br />cada paso.</h2></Reveal>
        <ol className="mt-20 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4 lg:gap-10">
          {steps.map((step, i) => <li key={step.title} className="border-t border-white/35 pt-4"><span className="property-tag-type text-[var(--color-accent)]">0{i + 1}</span><h3 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-extrabold uppercase leading-tight text-white">{step.title}</h3><p className="mt-3 max-w-[13rem] text-body-lg text-white/70">{step.text}</p></li>)}
        </ol>
      </div>
    </CinematicImage>
  </section>;
}
