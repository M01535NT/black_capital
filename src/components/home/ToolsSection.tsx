"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./_motion";

export function ToolsSection() {
  return (
    <section className="border-t border-white/[0.08] bg-white/[0.02]">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="mb-3 property-tag-type gold-ink">Para propietarios</p>
          <h2 className="text-display-2 leading-display tracking-headline text-white">Tu propiedad, con una estrategia.</h2>
          <p className="mt-4 max-w-md text-body leading-snug text-white/58">Venta o renta con valor comercial, revisión documental y una ruta de cierre desde el inicio.</p>
          <Link href="/propietarios" className="brushed-gold premium-cta mt-7 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-none active:scale-[0.98]">
            Vender o rentar mi propiedad
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal className="border border-white/[0.1] bg-background/60 p-7 sm:p-10">
          <ul className="space-y-4 text-body-lg text-white/60">
            <li>Valuación comercial con comparables de la zona.</li>
            <li>Revisión de documentos antes de avanzar.</li>
            <li>Promoción, visitas y negociación con seguimiento.</li>
          </ul>
          <div className="mt-7 border-t border-white/[0.1] pt-6">
            <p className="text-body text-white/58">¿Quieres explorar los números de tu operación?</p>
            <Link href="/herramientas" className="group mt-4 inline-flex items-center gap-2 property-tag-type text-[var(--color-accent)]">
              Ver calculadoras
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
