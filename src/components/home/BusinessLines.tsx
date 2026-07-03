"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { EASE_OUT, Reveal } from "./_motion";

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
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = LINES[active];

  return (
    <section className="relative border-t border-white/[0.08]">
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

      <div className="mx-auto mt-12 grid max-w-[90rem] grid-cols-1 lg:grid-cols-2">
        {/* Imagen sticky que cambia con la línea activa (desktop) */}
        <div className="relative hidden lg:block">
          <div className="sticky top-24 h-[calc(100dvh-8rem)] overflow-hidden border-r border-[var(--color-accent)]/15">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.image}
                initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={`${current.title}, ${current.category} en Tijuana`}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
            <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
              <span className="font-display text-[6rem] font-extrabold leading-none gold-ink opacity-90">
                {current.step}
              </span>
              <ol className="flex flex-col items-end gap-2">
                {LINES.map((l, i) => (
                  <li
                    key={l.step}
                    className={`h-1 w-10 transition-colors duration-500 ${
                      i === active ? "bg-[var(--color-accent)]" : "bg-white/15"
                    }`}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Panels de líneas: cada uno activa la imagen al entrar */}
        <div>
          {LINES.map((line, i) => (
            <motion.article
              key={line.step}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.6, margin: "-20% 0px -20% 0px" }}
              className="flex min-h-[62vh] flex-col justify-center border-t border-white/[0.08] px-6 py-14 first:border-t-0 sm:px-10 lg:min-h-[calc(100dvh-8rem)] lg:px-16"
            >
              {/* Imagen inline en móvil */}
              <div className="relative mb-7 aspect-[16/10] overflow-hidden border border-white/[0.08] lg:hidden">
                <Image
                  src={line.image}
                  alt={`${line.title}, ${line.category} en Tijuana`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute left-4 top-4 font-display text-3xl font-extrabold gold-ink">
                  {line.step}
                </span>
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
