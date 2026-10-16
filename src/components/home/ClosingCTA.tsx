"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePublicContact } from "@/components/public/site-settings-provider";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { Reveal } from "./_motion";

export function ClosingCTA() {
  const CONTACT_CONFIG = usePublicContact();
  return <section className="px-3 pb-6 sm:px-6 lg:px-10">
    <CinematicImage src="/closing-cta-bg.webp" alt="Arquitectura residencial al atardecer" className="flex min-h-[36rem] items-end rounded-[1.5rem] lg:min-h-[42rem]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <Reveal className="relative mx-auto flex w-full max-w-[90rem] flex-col items-start justify-between gap-10 px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:py-16">
        <div><p className="mb-5 property-tag-type text-white/65">Lo que sigue comienza aquí</p><h2 className="max-w-3xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[1.03] tracking-headline text-white">Hablemos de<br /><span className="gold-ink">tu inmueble.</span></h2></div>
        <div className="flex items-center gap-6"><Link href="/contacto" className="group flex size-20 items-center justify-center rounded-full bg-[var(--color-accent)] text-black transition-transform duration-500 hover:rotate-45 sm:size-24" aria-label="Hablar con un asesor"><ArrowUpRight className="size-9" aria-hidden="true" /></Link><a href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(CONTACT_CONFIG.whatsAppTemplate)}`} target="_blank" rel="noopener noreferrer" className="property-tag-type text-white/80 underline decoration-white/30 underline-offset-8">WhatsApp</a></div>
      </Reveal>
    </CinematicImage>
  </section>;
}
