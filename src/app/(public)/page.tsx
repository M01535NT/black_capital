import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileCheck2,
  FileText,
  Handshake,
  Home,
  KeyRound,
  MapPin,
  SearchCheck,
  Warehouse,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeCounters } from "@/components/home/HomeCounters";
import { HomeHeroHeadline } from "@/components/home/HomeHeroHeadline";

export const metadata: Metadata = {
  title: "Inmobiliaria Premium en Tijuana",
  description:
    "Compra, venta y renta de casas en zona dorada de Tijuana, plazas comerciales y naves industriales con opinión de valor, dictamen comercial y plan de marketing.",
  openGraph: {
    title: "Black Capital | Inmobiliaria Premium en Tijuana",
    description:
      "Representación inmobiliaria para vender, comprar o rentar activos residenciales, comerciales e industriales en Tijuana.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Capital",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Black Capital",
  url: "https://blackmx.vercel.app",
  areaServed: {
    "@type": "City",
    name: "Tijuana",
    containedInPlace: { "@type": "State", name: "Baja California" },
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
    addressLocality: "Tijuana",
    addressRegion: "Baja California",
  },
};

const segments = [
  {
    title: "Black Luxury",
    category: "Residencial",
    href: "/black-luxury",
    inventoryHref: "/inventario?uso=Residencial",
    image: "/brand-luxury.webp",
    icon: Home,
    copy: "Residencias, casas y oportunidades habitacionales con criterio de ubicación, plusvalía y estilo de vida.",
    zones: "Chapultepec · Zona Río · Playas",
  },
  {
    title: "Black Business",
    category: "Comercial",
    href: "/black-business",
    inventoryHref: "/inventario?uso=Comercial",
    image: "/brand-business.webp",
    icon: Building2,
    copy: "Locales, oficinas, plazas y activos comerciales evaluados por flujo, visibilidad y operación.",
    zones: "Zona Río · Otay · Díaz Ordaz",
  },
  {
    title: "Black Industrial",
    category: "Industrial",
    href: "/black-industrial",
    inventoryHref: "/inventario?uso=Industrial",
    image: "/brand-industrial.webp",
    icon: Warehouse,
    copy: "Naves, bodegas, parques y tierra industrial para producción, logística y expansión empresarial.",
    zones: "Otay · Pacífico · El Florido",
  },
];

const services = [
  { title: "Asesoría en compra y venta", icon: Handshake },
  { title: "Opinión de valor / avalúo comercial", icon: FileText },
  { title: "Opinión de factibilidad y curación de inventario", icon: SearchCheck },
  { title: "Comercialización de propiedades", icon: Building2 },
  { title: "Gestoría de traslación de dominio", icon: KeyRound },
  { title: "Acompañamiento documental y cierre", icon: FileCheck2 },
];

const whyBlackCapital = [
  {
    step: "01",
    title: "Conocimiento local",
    text: "Leemos Tijuana como ciudad: barrios, uso de suelo y dinámica real de demanda.",
    signal: "Ventaja territorial",
  },
  {
    step: "02",
    title: "Diagnóstico de activo",
    text: "Cada caso se evalúa por tipología, potencial de ocupación y contexto legal.",
    signal: "Ruta clara desde el inicio",
  },
  {
    step: "03",
    title: "Estrategia de ruta",
    text: "Combinamos marketing, negociación y acompañamiento para ir directo al cierre.",
    signal: "Sin ruido operativo",
  },
  {
    step: "04",
    title: "Cierre con respaldo",
    text: "Documentación, valor y negociación con criterio comercial para decisiones seguras.",
    signal: "Decisión con criterio",
  },
];

const serviceProcess = [
  "Diagnóstico del objetivo",
  "Revisión de propiedad / mercado / documentos",
  "Opinión de valor o factibilidad",
  "Estrategia comercial o búsqueda",
  "Negociación, gestoría y cierre",
];

const intentCtas = [
  { label: "Quiero vender una propiedad", href: "/contacto?objetivo=vender" },
  { label: "Busco comprar", href: "/contacto?objetivo=comprar" },
  { label: "Necesito opinión de valor", href: "/contacto?objetivo=opinion-de-valor" },
  { label: "Quiero evaluar una propiedad", href: "/contacto?objetivo=evaluar" },
];

const videoInsights = [
  {
    title: "Ruta de Compraventa",
    tag: "Ruta de Compraventa",
    video: "/hero.webm",
    poster: "/hero-luxury.webp",
    copy: "Definimos objetivo, comparables y estrategia inicial para comprar o vender.",
    href: "/inventario",
    label: "Ver rutas",
  },
  {
    title: "Ruta Residencial",
    tag: "Ruta Residencial",
    video: "/hero.webm",
    poster: "/hero-business.webp",
    copy: "Selección por ubicación, plusvalía y condición para propiedades residenciales.",
    href: "/black-luxury",
    label: "Ver ruta",
  },
  {
    title: "Ruta Comercial",
    tag: "Ruta Comercial",
    video: "/hero.webm",
    poster: "/industrial-hero.webp",
    copy: "Análisis de flujo, demanda y estrategia de posicionamiento comercial.",
    href: "/black-business",
    label: "Ver ruta de renta",
  },
  {
    title: "Ruta Industrial",
    tag: "Ruta Industrial",
    video: "/hero.webm",
    poster: "/hero-industrial.webp",
    copy: "Conectamos operación logística, rentabilidad y viabilidad de activo industrial.",
    href: "/black-industrial",
    label: "Ver ruta documental",
  },
];

const marqueeItems = [
  "RESIDENCIAL PREMIUM",
  "ESPACIOS COMERCIALES",
  "PROPIEDADES INDUSTRIALES",
  "UBICACIONES ESTRATÉGICAS",
];

export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.06] pt-24 lg:pt-28">
        <Image
          src="/hero-poster.webp"
          alt="Propiedades e inversión inmobiliaria en Tijuana"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-6rem)] max-w-[90rem] grid-cols-1 items-center px-6 pb-28 pt-10 sm:px-10 sm:pb-32 lg:grid-cols-12 lg:px-16">
          <div className="lg:col-span-8">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 text-caption text-white/70">
              <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Tijuana, Baja California
            </div>
            <HomeHeroHeadline />
            <p className="mt-6 max-w-xl text-body text-white/66">
              Residencial, comercial e industrial en ubicaciones estratégicas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inventario"
                className="brushed-gold premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none"
              >
                Ver inventario
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none border border-white/18 bg-white/[0.04] text-white hover:border-[var(--color-accent)]"
              >
                Solicitar asesoría
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="flex h-10 items-center overflow-hidden whitespace-nowrap bg-transparent sm:h-12">
            {[0, 1].map((track) => (
              <div key={track} className="animate-marquee inline-flex shrink-0">
                {marqueeItems.map((value, index) => (
                  <span key={`${track}-${value}-${index}`} className="inline-flex shrink-0 items-center">
                    <span className="px-5 property-tag-type text-white/72 transition-colors duration-300 hover:text-[var(--color-accent)] sm:px-10">
                      {value}
                    </span>
                    <span className="select-none gold-ink" aria-hidden="true">
                      ·
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-3 text-caption gold-ink">
              Qué hacemos
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Algunos de nuestros servicios
            </h2>
            <p className="mt-6 max-w-md text-body text-white/58">
              Acompañamos compra, venta y renta de activos con lectura de mercado, documentación y cierre.
            </p>
          </div>
          <div className="grid gap-x-12 sm:grid-cols-2 lg:col-span-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="group flex min-h-[108px] items-start gap-5 border-t border-white/[0.10] py-6">
                  <span className="gold-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="max-w-sm text-display-4 leading-tight text-white transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                    {service.title}
                  </h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] overflow-hidden px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-caption gold-ink">
              Tres líneas de negocio
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Explora por categoría.
            </h2>
          </div>
          <p className="max-w-xl text-body text-white/58">
            Tres líneas inmobiliarias, una misma experiencia.
          </p>
        </div>

        <div className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <article key={segment.title} className="group flex min-w-[82vw] snap-center flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025] sm:min-w-[68vw] md:min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] md:aspect-[4/5] lg:aspect-[16/10]">
                  <Image
                    src={segment.image}
                    alt={`Ejemplo de propiedad ${segment.title.toLowerCase()} en Tijuana`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="gold-gradient flex h-9 w-9 items-center justify-center rounded-full text-black">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="property-tag-type gold-ink">{segment.category}</p>
                      <h3 className="text-display-3 font-semibold text-white">{segment.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col space-y-5 p-5">
                  <p className="text-body text-white/64">{segment.copy}</p>
                  <p className="property-tag-type gold-ink opacity-75">{segment.zones}</p>
                  <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                    <Link href={segment.inventoryHref} className="inline-flex flex-1 items-center justify-center gap-2 border border-[var(--color-accent)]/45 px-4 py-2.5 property-tag-type gold-ink">
                      Inventario
                    </Link>
                    <Link href={segment.href} className="inline-flex flex-1 items-center justify-center gap-2 border border-white/10 px-4 py-2.5 property-tag-type text-white/75">
                      Ver línea
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="mb-10">
            <p className="mb-3 property-tag-type gold-ink">
              Carrusel de video
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Entiende nuestras rutas en 60 segundos.
            </h2>
            <p className="mt-6 max-w-2xl text-body text-white/58">
              Selecciona una ruta y revisa el enfoque visual de cada etapa clave.
            </p>
          </div>

          <div className="md:-mx-10 md:px-10">
            <div className="scrollbar-none -mx-6 flex gap-4 overflow-x-auto px-6 pb-3 sm:gap-5 sm:px-10 md:mx-0 md:grid md:grid-cols-2 md:px-0 md:pb-0 lg:grid-cols-4">
              {videoInsights.map((item) => (
                <article
                  key={item.title}
                  className="group min-w-[82vw] snap-center rounded-none border border-white/[0.12] bg-white/[0.03] md:min-w-0"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      poster={item.poster}
                      className="h-full w-full object-cover"
                    >
                      <source src={item.video} type="video/webm" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex rounded-none border border-white/20 bg-black/30 px-3 py-1 text-caption property-tag-type gold-ink">
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-3 border-t border-white/[0.08] p-5">
                    <h3 className="text-display-4 leading-tight text-white">{item.title}</h3>
                    <p className="text-body text-white/70">{item.copy}</p>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-caption gold-ink transition-opacity duration-300 hover:opacity-85"
                    >
                      {item.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeCounters />

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent" />
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:px-16 lg:py-24">
          <div className="lg:col-span-5">
            <p className="mb-3 property-tag-type gold-ink">
              Por qué Black Capital
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Así convertimos información en decisiones.
            </h2>
            <p className="mt-6 max-w-md text-body text-white/58">
              Cada ruta empieza con contexto real y termina con claridad operativa para decidir con precisión.
            </p>
          </div>
          <div className="relative lg:col-span-7">
            <div className="timeline-track absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/40 to-transparent md:left-6" />
            <div className="pl-8 md:pl-12">
            {whyBlackCapital.map((item) => (
              <article
                key={item.step}
                className="group relative timeline-item border-b border-white/[0.08] py-5 transition-colors duration-300 last:border-b-0 md:py-6"
                style={{ animationDelay: `${Number(item.step) * 110}ms` }}
              >
                <span className="absolute -left-[26px] top-6 h-3 w-3 rounded-full border border-[var(--color-accent)] bg-background shadow-[0_0_0_6px_rgba(0,0,0,0.2)] md:-left-[33px]" />
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="property-tag-type gold-ink">{item.step}</p>
                  <span className="w-fit border-b border-[var(--color-accent)]/35 pb-1 text-caption text-white/72 transition-colors duration-300 group-hover:text-white">
                    {item.signal}
                  </span>
                </div>
                <h3 className="text-display-4 text-white transition-colors duration-300 group-hover:text-[var(--color-accent)]">{item.title}</h3>
                <p className="mt-2 text-body text-white/70">{item.text}</p>
              </article>
            ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </section>

      <section className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 property-tag-type gold-ink">
              Nuestro proceso
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              De la intención al cierre.
            </h2>
          </div>
          <p className="max-w-xl text-body text-white/58">
            Integramos evaluación, estrategia comercial, búsqueda, negociación y gestoría en una sola ruta de trabajo.
          </p>
        </div>

        <div className="grid border-y border-white/[0.08] lg:grid-cols-5">
          {serviceProcess.map((item, index) => (
            <article key={item} className="group relative flex min-h-[170px] flex-col justify-between border-b border-white/[0.08] py-6 transition-colors duration-300 last:border-b-0 lg:border-b-0 lg:border-r lg:px-5 lg:last:border-r-0">
              <div className="mb-8 flex items-center justify-between">
                <span className="property-tag-type gold-ink">0{index + 1}</span>
                <ClipboardList className="h-5 w-5 text-[var(--color-accent)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div>
                <span className="mb-4 block h-px w-10 bg-[var(--color-accent)]/45 transition-all duration-300 group-hover:w-16" />
                <p className="text-display-4 leading-tight text-white transition-colors duration-300 group-hover:text-[var(--color-accent)]">{item}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-8 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:px-16 lg:py-20">
          <div className="lg:col-span-4">
            <p className="mb-3 property-tag-type gold-ink">
              Siguiente paso
            </p>
            <h2 className="text-display-3 leading-tight text-white">
              Elige cómo quieres iniciar.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {intentCtas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className="group flex min-h-[64px] items-center justify-between gap-4 border border-white/[0.08] bg-background/70 px-5 py-4 text-left transition-colors duration-300 hover:border-[var(--color-accent)]"
              >
                <span className="property-tag-type text-white/78 transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {cta.label}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
      <style>{`
        .timeline-item {
          animation: timeline-reveal 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(18px);
        }

        @keyframes timeline-reveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

