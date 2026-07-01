import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TOOLS = [
  {
    step: "01",
    title: "Valuación comercial",
    copy: "Estimamos valor de salida con comparables reales de la zona, no promedios genéricos.",
    cta: "Solicitar valuación",
    href: "/herramientas",
  },
  {
    step: "02",
    title: "Revisión documental",
    copy: "Escrituras, predial, uso de suelo y adeudos revisados antes de avanzar en la operación.",
    cta: "Revisar mis papeles",
    href: "/herramientas",
  },
  {
    step: "03",
    title: "Comparables de zona",
    copy: "Precio por m², tiempos de venta y demanda por corredor para ubicar tu activo con contexto.",
    cta: "Ver comparables",
    href: "/herramientas",
  },
] as const;

export function HomeTools() {
  return (
    <section className="border-t border-white/[0.08] bg-white/[0.02]">
      <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 property-tag-type gold-ink">Herramientas</p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Decide con datos, no corazonadas.
            </h2>
          </div>
          <p className="max-w-xs text-body leading-snug text-white/58">
            Instrumentos que usamos antes de publicar, visitar o hacer una
            oferta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.step}
              href={tool.href}
              className="group flex flex-col border border-white/[0.08] bg-background/60 p-7 transition-colors duration-300 hover:border-[var(--color-accent)]/40"
            >
              <span className="mb-6 font-display text-body-sm font-extrabold gold-ink">
                {tool.step}
              </span>
              <h3 className="mb-3 font-display text-display-4 font-extrabold text-white">
                {tool.title}
              </h3>
              <p className="mb-6 flex-1 text-body text-white/58">{tool.copy}</p>
              <span className="inline-flex items-center gap-2 property-tag-type text-[var(--color-accent)]">
                {tool.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
