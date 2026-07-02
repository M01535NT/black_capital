import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LINES = [
  {
    step: "01",
    category: "Residencial",
    title: "Black Luxury",
    href: "/black-luxury",
    image: "/brand-luxury.webp",
    copy: "Casas y residencias por zona, presupuesto y estilo de vida.",
    zones: "Chapultepec · Zona Río · Playas",
  },
  {
    step: "02",
    category: "Comercial",
    title: "Black Business",
    href: "/black-business",
    image: "/brand-business.webp",
    copy: "Locales y oficinas por ubicación, flujo y condiciones de renta.",
    zones: "Zona Río · Otay · Díaz Ordaz",
  },
  {
    step: "03",
    category: "Industrial",
    title: "Black Industrial",
    href: "/black-industrial",
    image: "/brand-industrial.webp",
    copy: "Naves y bodegas por superficie, accesos y trabajo diario.",
    zones: "Otay · Pacífico · El Florido",
  },
] as const;

export function HomeLines() {
  return (
    <section className="border-t border-white/[0.08]">
      <div className="mx-auto max-w-[90rem] px-6 pt-16 sm:px-10 lg:px-16 lg:pt-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 property-tag-type gold-ink">Qué trabajamos</p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Elige lo que estás buscando.
            </h2>
          </div>
          <p className="max-w-xs text-body leading-snug text-white/58">
            Casas, locales, oficinas y naves en Tijuana. Cada tipo se revisa con lo que importa.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem]">
        {LINES.map((line) => (
          <Link
            key={line.step}
            href={line.href}
            className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-5 border-t border-white/[0.08] px-6 py-6 transition-colors duration-300 hover:bg-white/[0.03] sm:grid-cols-[3rem_7rem_1fr_auto] sm:gap-7 sm:px-10 lg:px-16"
          >
            <span className="font-display text-2xl font-extrabold gold-ink">
              {line.step}
            </span>
            <div className="relative hidden aspect-[3/2] w-full overflow-hidden rounded-sm border border-[var(--color-accent)]/15 sm:block">
              <Image
                src={line.image}
                alt={`Línea ${line.title}`}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="min-w-0">
              <p className="property-tag-type gold-ink">{line.category}</p>
              <h3 className="mt-1.5 font-display text-display-3 font-extrabold uppercase leading-tight text-white">
                {line.title}
              </h3>
              <p className="mt-2 max-w-2xl text-body text-white/58">
                {line.copy}
                <span className="text-white/35"> · {line.zones}</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start pt-2 property-tag-type text-white/85 transition-colors group-hover:text-[var(--color-accent)] sm:self-center sm:pt-0">
              <span className="hidden sm:inline">Ver opciones</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
        <div className="border-t border-white/[0.08]" />
      </div>
    </section>
  );
}
