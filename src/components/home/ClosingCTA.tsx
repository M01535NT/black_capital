"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { Reveal, useParallax, useSectionRef } from "./_motion";

const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
  "Hola, quiero asesoría sobre un inmueble en Tijuana.",
)}`;

export function ClosingCTA() {
  const ref = useSectionRef<HTMLElement>();
  const bgTransform = useParallax(ref, 80);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/[0.08]">
      {/* Fondo estático con parallax */}
      <motion.div className="absolute inset-x-0 -top-[18%] bottom-[-18%]" style={bgTransform ? { transform: bgTransform } : undefined}>
        <Image
          src="/closing-cta-bg.webp"
          alt="Arquitectura residencial al atardecer en Tijuana"
          fill
          sizes="100vw"
          className="object-cover opacity-45"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      <div className="grain-overlay opacity-[0.1]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[90rem] px-6 py-24 text-center sm:px-10 lg:px-16 lg:py-36">
        <Reveal>
          <p className="mx-auto max-w-4xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold uppercase leading-[1.03] tracking-headline text-white">
            Hablemos de <span className="gold-ink">tu inmueble</span>.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-white/65">
            Te decimos por dónde empezar. Sin costo, sin compromiso.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
            <Link
              href="/contacto"
              className="brushed-gold premium-cta inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-none active:scale-[0.98] sm:w-auto"
            >
              Hablar con un asesor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
            >
              <MessageCircle className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              <span className="property-tag-type relative pb-1">
                Escribir por WhatsApp
                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
