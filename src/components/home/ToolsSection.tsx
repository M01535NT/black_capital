"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { Reveal } from "./_motion";

export function ToolsSection() {
  return <section data-section="home-owners" className="mx-auto grid max-w-[100rem] items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:px-16 lg:py-28">
    <div className="relative pb-12 pr-10 sm:pb-16 sm:pr-20">
      <CinematicImage src="/hero-luxury.webp" alt="Detalle de arquitectura residencial" className="aspect-[4/5] rounded-[1.25rem]" sizes="(min-width: 1024px) 50vw, 100vw" />
      <CinematicImage src="/line-residencial.webp" alt="Espacio residencial abierto al exterior" className="absolute bottom-0 right-0 aspect-[4/3] w-[54%] rounded-xl border-[6px] border-background" sizes="30vw" />
    </div>
    <Reveal className="max-w-lg">
      <p className="mb-5 property-tag-type gold-ink">Para propietarios</p>
      <h2 className="text-display-2 leading-display tracking-headline text-white">Tu propiedad.<br />Su siguiente capítulo.</h2>
      <p className="mt-6 max-w-xs text-body text-white/60">Una estrategia de venta o renta, pensada para tu inmueble.</p>
      <Link href="/propietarios" className="group mt-9 inline-flex min-h-12 items-center gap-7 rounded-full border border-[var(--color-accent)]/55 px-6 property-tag-type gold-ink transition-colors hover:bg-[var(--color-accent)] hover:text-black">Conocer el proceso<ArrowUpRight className="size-5" aria-hidden="true" /></Link>
      <Link href="/herramientas" className="mt-8 block w-fit property-tag-type text-white/45 underline decoration-white/20 underline-offset-8 transition-colors hover:text-white">Explorar calculadoras</Link>
    </Reveal>
  </section>;
}
