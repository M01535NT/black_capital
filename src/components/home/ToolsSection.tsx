import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import { ArrowRight } from "lucide-react";

const categoryFont = Oswald({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const CATEGORIES = [
  {
    title: "Residencial",
    label: "Vivir bien",
    href: "/black-luxury",
    image: "/categories-residencial.webp",
    alt: "Residencia contemporánea blanca en una ladera al anochecer",
    description: "Casas, departamentos y terrenos para la vida diaria en Tijuana, Rosarito, Ensenada y Tecate. Decisiones acompañadas, con datos y sin prisa.",
  },
  {
    title: "Comercial",
    label: "Ubicación que produce",
    href: "/black-business",
    image: "/categories-comercial.webp",
    alt: "Edificio de oficinas con fachada de cristal al atardecer",
    description: "Oficinas, locales y espacios comerciales evaluados por flujo, visibilidad, accesos y utilidad real para tu operación.",
  },
  {
    title: "Industrial",
    label: "Escala y logística",
    href: "/black-industrial",
    image: "/categories-industrial.webp",
    alt: "Nave industrial con una línea de andenes de carga al atardecer",
    description: "Naves, terrenos y espacios industriales con enfoque en capacidad, accesos, patios, altura y continuidad operativa.",
  },
];

export function ToolsSection() {
  return (
    <section id="categorias" data-section="home-categories" aria-labelledby="home-categories-title" className={`${categoryFont.className} mx-auto max-w-[90rem] scroll-mt-24 px-6 py-16 sm:px-10 lg:px-16 lg:py-24`}>
      <h2 id="home-categories-title" className="sr-only">Residencial, comercial e industrial</h2>
      <p className="mb-10 max-w-[24rem] text-lg font-normal leading-[1.8] text-[#939089]">
        Residencial, comercial e industrial con el mismo criterio de presentación y seguimiento.
      </p>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {CATEGORIES.map(category => (
          <article key={category.title}>
            <Link href={category.href} aria-label={`Ver ${category.title}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#d2a73c]">
              <div className="relative mb-5 aspect-[4/5] overflow-hidden border border-transparent transition-[border-color,transform] duration-300 group-hover:-translate-y-2 group-hover:border-[#b89749] group-focus-visible:border-[#b89749] motion-reduce:transform-none motion-reduce:transition-none">
                <Image src={category.image} alt={category.alt} fill sizes="(min-width: 1440px) 420px, (min-width: 768px) 30vw, 100vw" className="object-cover brightness-[0.78] transition-[filter,transform] duration-500 group-hover:scale-[1.025] group-hover:brightness-100 motion-reduce:transform-none motion-reduce:transition-none" />
              </div>
              <p className="mb-2 text-[11px] uppercase leading-5 tracking-[0.2em] text-[#d2a73c]">{category.label}</p>
              <h3 className="text-2xl font-semibold uppercase leading-[1.2] text-[#f3f0e9]">{category.title}</h3>
              <p className="mt-2 text-sm font-normal leading-[1.8] text-[#939089]">{category.description}</p>
              <span className="mt-3 inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d2a73c]">
                Ver {category.title}<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
