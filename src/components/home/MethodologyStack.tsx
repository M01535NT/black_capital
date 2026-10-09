"use client";

import Image from "next/image";
import { Reveal } from "./_motion";

const STEPS = [
  {
    step: "01",
    title: "Diagnóstico del activo",
    text: "Revisamos ubicación, uso, estado, documentos y comparables antes de definir precio o ruta.",
    signal: "Base real",
    image: "/hero-luxury.webp",
  },
  {
    step: "02",
    title: "Valor y estrategia",
    text: "Definimos valor de salida, perfil de comprador y argumentos de venta o renta según el tipo de propiedad.",
    signal: "Precio claro",
    image: "/hero-business.webp",
  },
  {
    step: "03",
    title: "Exposición y filtro",
    text: "Mostramos el activo donde corresponde, filtramos prospectos y ordenamos visitas, consultas y ofertas.",
    signal: "Demanda útil",
    image: "/industrial-hero.webp",
  },
  {
    step: "04",
    title: "Negociación y cierre",
    text: "Acompañamos contrapropuestas, condiciones, documentación y coordinación notarial hasta la firma.",
    signal: "Firma limpia",
    image: "/hero-industrial.webp",
  },
] as const;

export function MethodologyStack() {
  return (
    <section data-section="home-methodology" className="relative border-t border-white/[0.08]">
      <div className="mx-auto max-w-[90rem] px-6 pt-16 sm:px-10 lg:px-16 lg:pt-24">
        <Reveal className="max-w-2xl">
          <p className="mb-3 property-tag-type gold-ink">Metodología</p>
          <h2 className="text-display-2 leading-display tracking-headline text-white">
            Del diagnóstico a la firma.
          </h2>
          <p className="mt-4 max-w-md text-body text-white/58">
            Revisamos activo, precio y papeles antes de publicar.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 max-w-[90rem] px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
        <ol className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {STEPS.map((item) => (
            <li key={item.step} className="relative overflow-hidden border border-white/[0.1] p-6 sm:p-8">
              <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-20" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/50" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-4xl font-extrabold leading-none gold-ink sm:text-5xl">{item.step}</span>
                  <span className="h-px w-10 bg-[var(--color-accent)]/50" aria-hidden="true" />
                  <span className="property-tag-type text-white/60">{item.signal}</span>
                </div>
                <h3 className="font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-extrabold uppercase leading-tight text-white">{item.title}</h3>
                <p className="mt-4 max-w-md text-body-lg text-white/70">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
