"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./_motion";

const TOOLS = [
  {
    step: "01",
    title: "Valuación comercial",
    copy: "Estimamos valor de salida con comparables reales de la zona, no promedios genéricos. Es el punto de partida de toda operación.",
    cta: "Solicitar valuación",
    href: "/herramientas",
    featured: true,
  },
  {
    step: "02",
    title: "Revisión documental",
    copy: "Escrituras, predial, uso de suelo y adeudos revisados antes de avanzar.",
    cta: "Revisar mis papeles",
    href: "/herramientas",
  },
  {
    step: "03",
    title: "Comparables de zona",
    copy: "Precio por m², tiempos de venta y demanda por corredor.",
    cta: "Ver comparables",
    href: "/herramientas",
  },
] as const;

export function ToolsSection() {
  const [featured, ...rest] = TOOLS;

  return (
    <section className="border-t border-white/[0.08] bg-white/[0.02]">
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <Reveal className="mb-12 max-w-2xl">
          <h2 className="text-display-2 leading-display tracking-headline text-white">
            Decide con números.
          </h2>
          <p className="mt-4 max-w-md text-body leading-snug text-white/58">
            Lo que usamos antes de publicar, visitar u ofertar.
          </p>
        </Reveal>

        {/* Bento asimétrico: 1 destacada + 2 secundarias */}
        <RevealStagger className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <RevealItem className="lg:col-span-3">
            <Link
              href={featured.href}
              className="group flex h-full min-h-[18rem] flex-col justify-between border border-white/[0.1] bg-background/60 p-8 transition-colors duration-300 hover:border-[var(--color-accent)]/40 sm:p-10"
            >
              <span className="font-display text-sm font-extrabold gold-ink">{featured.step}</span>
              <div className="mt-6">
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-extrabold uppercase leading-tight text-white">
                  {featured.title}
                </h3>
                <p className="mt-4 max-w-md text-body-lg text-white/60">{featured.copy}</p>
                <span className="mt-7 inline-flex items-center gap-2 property-tag-type text-[var(--color-accent)]">
                  {featured.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </RevealItem>

          <div className="grid grid-cols-1 gap-4 lg:col-span-2">
            {rest.map((tool) => (
              <RevealItem key={tool.step}>
                <Link
                  href={tool.href}
                  className="group flex h-full flex-col border border-white/[0.1] bg-background/60 p-7 transition-colors duration-300 hover:border-[var(--color-accent)]/40"
                >
                  <span className="mb-5 font-display text-sm font-extrabold gold-ink">{tool.step}</span>
                  <h3 className="font-display text-display-4 font-extrabold text-white">{tool.title}</h3>
                  <p className="mt-2 flex-1 text-body text-white/58">{tool.copy}</p>
                  <span className="mt-5 inline-flex items-center gap-2 property-tag-type text-[var(--color-accent)]">
                    {tool.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </div>
        </RevealStagger>
      </div>
    </section>
  );
}
