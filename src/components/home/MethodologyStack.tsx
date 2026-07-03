"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

function StackCard({ item, index, total }: { item: (typeof STEPS)[number]; index: number; total: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 110px", "end 110px"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.3]);
  const isLast = index === total - 1;
  const applyMotion = !reduce && !isLast;

  return (
    <div ref={ref} className="sticky top-[110px] h-[74vh] min-h-[30rem]">
      <motion.article
        style={applyMotion ? { scale, opacity } : undefined}
        className="relative flex h-full origin-top flex-col justify-end overflow-hidden border border-white/[0.1]"
      >
        <Image
          src={item.image}
          alt={`${item.title}, Black Capital`}
          fill
          sizes="(max-width: 1024px) 100vw, 90vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
        <div className="relative z-10 flex items-end justify-between gap-6 p-6 sm:p-10 lg:p-14">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold leading-none gold-ink sm:text-5xl">
                {item.step}
              </span>
              <span className="h-px w-10 bg-[var(--color-accent)]/50" aria-hidden="true" />
              <span className="property-tag-type text-white/60">{item.signal}</span>
            </div>
            <h3 className="font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-extrabold uppercase leading-tight text-white">
              {item.title}
            </h3>
            <p className="mt-4 max-w-md text-body-lg text-white/70">{item.text}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function MethodologyStack() {
  return (
    <section className="relative border-t border-white/[0.08]">
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

      <div className="mx-auto max-w-[80rem] px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
        <div className="flex flex-col gap-6">
          {STEPS.map((item, i) => (
            <StackCard key={item.step} item={item} index={i} total={STEPS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
