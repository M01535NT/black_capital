import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
  MapPin,
  Warehouse,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeCounters } from "@/components/home/HomeCounters";
import { HomeHeroHeadline } from "@/components/home/HomeHeroHeadline";
import { MethodologySection } from "@/components/home/MethodologySection";
import { Testimonials } from "@/components/home/Testimonials";

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
    image: "/brand-luxury.webp",
    icon: Home,
    copy: "Residencias seleccionadas por ubicación, plusvalía y narrativa de vida. Para propietarios y familias que compran para quedarse.",
    zones: ["Chapultepec", "Zona Río", "Playas"],
    metric: "Acompañamiento dedicado en cada operación residencial.",
  },
  {
    title: "Black Business",
    category: "Comercial",
    href: "/black-business",
    image: "/brand-business.webp",
    icon: Building2,
    copy: "Locales, oficinas y plazas evaluadas por flujo, visibilidad y rentabilidad operativa antes de salir al mercado.",
    zones: ["Zona Río", "Otay", "Díaz Ordaz"],
    metric: "Lectura comercial del activo antes de la primera visita.",
  },
  {
    title: "Black Industrial",
    category: "Industrial",
    href: "/black-industrial",
    image: "/brand-industrial.webp",
    icon: Warehouse,
    copy: "Naves, bodegas y parques industriales conectados a los corredores logísticos de Tijuana.",
    zones: ["Otay", "Pacífico", "El Florido"],
    metric: "Criterio operativo y expansión por encima del metraje.",
  },
];

const intentCtas = [
  { label: "Quiero vender una propiedad", href: "/contacto?objetivo=vender" },
  { label: "Busco comprar", href: "/contacto?objetivo=comprar" },
  { label: "Necesito opinión de valor", href: "/contacto?objetivo=opinion-de-valor" },
  { label: "Quiero evaluar una propiedad", href: "/contacto?objetivo=evaluar" },
];

type Segment = (typeof segments)[number];
type SegmentVariant = "hero" | "compact" | "mobile";

function SegmentCard({
  segment,
  variant,
}: {
  segment: Segment;
  variant: SegmentVariant;
}) {
  const Icon = segment.icon;
  const isHero = variant === "hero";
  const isMobile = variant === "mobile";
  const imageAspect = isHero
    ? "aspect-[4/3] lg:aspect-[16/11]"
    : isMobile
      ? "aspect-[4/5]"
      : "aspect-[16/9] lg:aspect-[16/10]";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025] transition-colors duration-500 hover:border-[var(--color-accent)]/40">
      <div className={`relative overflow-hidden ${imageAspect}`}>
        <Image
          src={segment.image}
          alt={`Línea inmobiliaria ${segment.title} en Tijuana`}
          fill
          sizes={
            isHero
              ? "(max-width: 768px) 100vw, 58vw"
              : "(max-width: 768px) 100vw, 42vw"
          }
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
          <div>
            <p className="property-tag-type gold-ink">{segment.category}</p>
            <h3
              className={
                isHero
                  ? "mt-1 text-display-2 font-extrabold leading-none text-white"
                  : "mt-1 text-display-3 font-semibold leading-tight text-white"
              }
            >
              {segment.title}
            </h3>
          </div>
          <span className="gold-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black">
            <Icon className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className={`flex flex-1 flex-col gap-5 p-5 ${isHero ? "lg:p-7" : ""}`}>
        <p className={`text-body text-white/68 ${isHero ? "lg:text-body-lg" : ""}`}>
          {segment.copy}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {segment.zones.map((zone) => (
            <li
              key={zone}
              className="border border-white/12 px-2.5 py-1 property-tag-type text-white/65"
            >
              {zone}
            </li>
          ))}
        </ul>

        <p className="text-body-sm leading-relaxed text-white/55 transition-all duration-500 md:max-h-0 md:translate-y-1 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {segment.metric}
        </p>

        <div className="mt-auto pt-1">
          <Link
            href={segment.href}
            className="group/cta inline-flex items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
          >
            <span className="property-tag-type relative pb-1">
              Ver línea
              <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover/cta:opacity-100" />
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.06] pt-24 lg:pt-28">
        <video
          src="/hero.webm"
          poster="/hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40 motion-reduce:hidden"
        />
        <Image
          src="/hero-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
          className="hidden object-cover opacity-35 motion-reduce:block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div
          aria-hidden="true"
          className="absolute inset-0 mix-blend-screen opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 82% 18%, rgba(210, 167, 60, 0.55), transparent 55%)",
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-6rem)] max-w-[90rem] grid-cols-1 items-center px-6 pb-32 pt-10 sm:px-10 sm:pb-36 lg:grid-cols-12 lg:px-16">
          <div className="lg:col-span-8">
            <div className="mb-6 inline-flex items-center gap-2.5 border border-white/10 bg-black/35 px-3 py-2 text-caption text-white/72">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Tijuana, Baja California
            </div>
            <HomeHeroHeadline />
            <p className="mt-6 max-w-xl text-body text-white/66">
              Residencial, comercial e industrial en ubicaciones estratégicas.
            </p>

            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
              <Link
                href="/inventario"
                className="brushed-gold premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none"
              >
                Ver inventario
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="group inline-flex w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
              >
                <span className="property-tag-type relative pb-1">
                  Hablar con un asesor
                  <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/[0.06] bg-background/45 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-center gap-x-6 gap-y-2.5 px-6 py-3.5 text-white/68 sm:flex-nowrap sm:gap-x-10 sm:px-10 sm:py-4 lg:px-16">
            <span className="property-tag-type inline-flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-accent)]" />
              Tijuana · Baja California
            </span>
            <span className="hidden h-3 w-px bg-[var(--color-accent)]/40 sm:block" />
            <span className="property-tag-type">
              Residencial · Comercial · Industrial
            </span>
            <span className="hidden h-3 w-px bg-[var(--color-accent)]/40 sm:block" />
            <span className="property-tag-type inline-flex items-baseline gap-2">
              <span className="gold-ink text-base font-extrabold leading-none">08</span>
              Años operando
            </span>
          </div>
        </div>
      </section>

      <HomeCounters />

      <section className="mx-auto max-w-[90rem] overflow-hidden px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 property-tag-type gold-ink">
              Tres líneas de negocio
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Explora por categoría.
            </h2>
          </div>
          <p className="max-w-xl text-body text-white/58">
            Tres líneas inmobiliarias, un mismo criterio de inversión.
          </p>
        </div>

        <div className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 md:hidden">
          {segments.map((segment) => (
            <div key={`mobile-${segment.title}`} className="min-w-[82vw] snap-center sm:min-w-[68vw]">
              <SegmentCard segment={segment} variant="mobile" />
            </div>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-12 md:gap-5 lg:gap-6">
          <div className="md:col-span-7">
            <SegmentCard segment={segments[0]} variant="hero" />
          </div>
          <div className="flex flex-col gap-5 md:col-span-5 lg:gap-6">
            <SegmentCard segment={segments[1]} variant="compact" />
            <SegmentCard segment={segments[2]} variant="compact" />
          </div>
        </div>
      </section>

      <Testimonials />

      <MethodologySection />

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
    </main>
  );
}

