"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./_motion";

const LINES = [
  {
    step: "01",
    category: "Residencial",
    title: "Black Luxury",
    href: "/black-luxury",
    image: "/line-residencial.webp",
    copy: "Casas y residencias filtradas por zona, privacidad, presupuesto y etapa de compra.",
    zones: "Chapultepec · Zona Río · Playas",
  },
  {
    step: "02",
    category: "Comercial",
    title: "Black Business",
    href: "/black-business",
    image: "/line-comercial.webp",
    copy: "Locales, oficinas y plazas por flujo, visibilidad, uso permitido y potencial de renta.",
    zones: "Zona Río · Otay · Díaz Ordaz",
  },
  {
    step: "03",
    category: "Industrial",
    title: "Black Industrial",
    href: "/black-industrial",
    image: "/line-industrial.webp",
    copy: "Naves y bodegas por superficie, accesos, maniobra y corredor industrial.",
    zones: "Otay · Pacífico · El Florido",
  },
] as const;

export function BusinessLines() {
  return (
    <section data-section="home-segments" className="relative border-t border-white/[0.08]">
      <div className="mx-auto max-w-[90rem] px-6 pt-16 sm:px-10 lg:px-16 lg:pt-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-display-2 leading-display tracking-headline text-white">
            Un método, tres líneas.
          </h2>
          <p className="mt-4 max-w-md text-body leading-snug text-white/58">
            Filtramos cada activo con criterios propios.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-10 grid max-w-[90rem] grid-cols-1 gap-6 px-6 pb-16 sm:px-10 lg:grid-cols-[1fr_1fr_1.2fr] lg:px-16 xl:grid-cols-3 lg:pb-24">
        {LINES.map((line) => (
          <article key={line.step} className="flex min-w-0 flex-col border border-white/[0.08] bg-white/[0.015] p-6 lg:px-5 xl:px-6">
            <div className="relative mb-7 aspect-[16/10] overflow-hidden border border-white/[0.08]">
              <Image src={line.image} alt={`${line.title}, ${line.category} en Tijuana`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-4 top-4 font-display text-3xl font-extrabold gold-ink">{line.step}</span>
            </div>
            <p className="property-tag-type gold-ink">{line.category}</p>
            <h3 className="mt-2 font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-tight text-white">
              {line.title}
            </h3>
            <p className="mt-4 max-w-md text-body-lg text-white/65">{line.copy}</p>
            <p className="mt-4 property-tag-type text-white/40">{line.zones}</p>
            <Link
              href={line.href}
              className="group mt-8 inline-flex w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
            >
              <span className="property-tag-type relative pb-1">
                Ver {line.title}
                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
