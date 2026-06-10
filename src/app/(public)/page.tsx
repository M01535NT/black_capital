import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Home,
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
  { label: "Vender", href: "/contacto?objetivo=vender" },
  { label: "Comprar", href: "/contacto?objetivo=comprar" },
  { label: "Rentar", href: "/inventario?tipo=Renta" },
  { label: "Invertir", href: "/contacto?objetivo=invertir" },
];
const rotatingInventoryWords = ["Residencial", "Comercial", "Industrial"];
const MARQUEE_ROTATE_INTERVAL_MS = 3000;

type Segment = (typeof segments)[number];
type SegmentVariant = "hero" | "compact" | "mobile" | "mosaic";

function HeroMarqueeStrip({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="animate-marquee inline-flex min-w-full shrink-0 items-center justify-around gap-x-5 px-6 sm:gap-x-10 sm:px-10 lg:px-16"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <span className="property-tag-type inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap">
        <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-accent)]" />
        Tijuana · Baja California
      </span>
      <span className="h-3 w-px shrink-0 bg-[var(--color-accent)]/40" />
      <span className="property-tag-type inline-flex shrink-0 items-baseline gap-2 whitespace-nowrap">
        Encuentra inventario
        <span className="hero-marquee-rotate-wrap" aria-hidden="true">
          {rotatingInventoryWords.map((word, index) => (
            <span
              key={word}
              className="hero-marquee-word property-tag-type normal-case"
              style={{ animationDelay: `${index * (MARQUEE_ROTATE_INTERVAL_MS / 1000)}s` }}
            >
              {index === rotatingInventoryWords.length - 1 ? word : `${word},`}
            </span>
          ))}
        </span>
      </span>
      <span className="h-3 w-px shrink-0 bg-[var(--color-accent)]/40" />
      <span className="property-tag-type inline-flex shrink-0 items-baseline gap-2 whitespace-nowrap">
        <span className="gold-ink text-base font-extrabold leading-none">08</span>
        Años operando
      </span>
    </div>
  );
}

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
  const isMosaic = variant === "mosaic";
  const isMosaicLike = isMosaic || isMobile;
  const imageAspect = isHero
    ? "aspect-[4/3] lg:aspect-[16/11]"
    : isMosaicLike
    ? "aspect-[16/11]"
    : "aspect-[16/9] lg:aspect-[16/10]";
  const imageSizes =
    isMosaicLike
      ? "(max-width: 768px) 100vw, 32vw"
      : isHero
        ? "(max-width: 768px) 100vw, 58vw"
        : "(max-width: 768px) 100vw, 42vw";
  const titleClass = isHero
    ? "mt-1 text-display-2 font-extrabold leading-none text-white"
    : isMosaicLike
      ? "mt-1 text-display-4 leading-tight text-white"
      : "mt-1 text-display-3 font-semibold leading-tight text-white";
  const panelPadding = isHero ? "lg:p-7" : isMosaicLike ? "lg:p-6" : "";
  const bodyTextClass = isHero
    ? "lg:text-body-lg"
    : isMosaicLike
      ? "text-sm"
      : "";
  const showZones = true;
  const cardHeight = isMobile
    ? "min-h-[min(470px,54svh)] sm:min-h-[min(560px,56svh)] md:min-h-[min(620px,58svh)]"
    : "min-h-[clamp(28rem,35vw,32rem)]";
  const articleTransition = isMosaicLike
    ? `group relative flex h-full ${cardHeight} flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025] transition-all duration-500 lg:hover:-translate-y-1 lg:hover:border-[var(--color-accent)]/45 lg:focus-within:-translate-y-1 lg:focus-within:border-[var(--color-accent)]/45 lg:hover:shadow-[0_24px_55px_-28px_rgba(0,0,0,0.95)]`
    : "group relative flex h-full flex-col overflow-hidden border border-white/[0.08] bg-white/[0.025] transition-colors duration-500 lg:hover:border-[var(--color-accent)]/40";
  const hoverReveal = isMosaic
    ? "lg:opacity-0 lg:translate-y-2 lg:transition-all lg:duration-500 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:focus-within:opacity-100 lg:focus-within:translate-y-0"
    : "";
  const imageScale = isMosaicLike
    ? "group-focus-within:scale-[1.05] lg:group-hover:scale-[1.09]"
    : "lg:group-hover:scale-[1.06]";
  const detailsReveal = isMosaicLike
    ? "max-h-0 overflow-hidden opacity-0 translate-y-2 transition-all duration-500 group-focus-within:max-h-80 group-focus-within:opacity-100 group-focus-within:translate-y-0 lg:group-hover:max-h-80 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
    : "";
  const mosaicImageOverlay = isMosaicLike
    ? "from-black/35 via-black/40 to-black/75 transition-all duration-500 group-focus-within:from-black/55 group-focus-within:via-black/60 group-focus-within:to-black/85 lg:group-hover:from-black/55 lg:group-hover:via-black/60 lg:group-hover:to-black/85"
    : "from-black/90 via-black/30 to-transparent transition-all duration-500 lg:group-hover:from-black/95 lg:group-hover:via-black/50";

  return (
    <article
      className={articleTransition}
      tabIndex={isMosaicLike ? 0 : undefined}
      aria-label={isMosaicLike ? `Mostrar detalles de ${segment.title}` : undefined}
    >
      {isMosaicLike ? (
        <>
          <Image
            src={segment.image}
            alt={`Línea inmobiliaria ${segment.title} en Tijuana`}
            fill
            sizes={imageSizes}
            className={`absolute inset-0 object-cover transition-transform duration-[1100ms] ease-out ${imageScale}`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${mosaicImageOverlay}`}
          />
          <span className="pointer-events-none absolute right-[-36%] top-0 h-full w-[58%] rotate-6 bg-[linear-gradient(115deg,rgba(210,167,60,0.22),transparent_68%)] opacity-35" />
          <div className="absolute inset-0 flex flex-col p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-1">
              <p className="property-tag-type gold-ink">{segment.category}</p>
              <h3 className={titleClass}>{segment.title}</h3>
            </div>

            <div className={`mt-5 flex flex-1 flex-col gap-4 min-h-0 ${detailsReveal}`}>
              <p className={`text-body text-white/68 ${bodyTextClass}`}>
                {segment.copy}
              </p>

              {showZones ? (
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
              ) : null}

              <p className="text-body-sm leading-relaxed text-white/58">
                {segment.metric}
              </p>
          </div>
            <div className="mt-auto pt-1">
              <Link
                href={segment.href}
                className="group/cta inline-flex items-center gap-2 text-[var(--color-accent)] transition-colors duration-300 hover:text-[var(--color-accent)]"
              >
                <span className="property-tag-type relative pb-1">
                  Ver línea
                  <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover/cta:opacity-100" />
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`relative overflow-hidden ${imageAspect}`}>
            <Image
              src={segment.image}
              alt={`Línea inmobiliaria ${segment.title} en Tijuana`}
              fill
              sizes={imageSizes}
              className={`object-cover transition-transform duration-[1100ms] ease-out ${imageScale}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${mosaicImageOverlay}`} />
            <div className={`absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 ${hoverReveal}`}>
              <div className={hoverReveal}>
                <p className={`property-tag-type gold-ink ${hoverReveal}`}>{segment.category}</p>
                <h3 className={`${titleClass} ${hoverReveal}`}>
                  {segment.title}
                </h3>
              </div>
              <span className={`gold-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black transition-all duration-500 ${hoverReveal} group-hover:rotate-[-8deg]`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div
            className={`flex flex-1 flex-col gap-4 p-4 sm:p-5 ${panelPadding} ${hoverReveal}`}
          >
            <p className={`text-body text-white/68 ${bodyTextClass} ${hoverReveal}`}>
              {segment.copy}
            </p>

            {showZones ? (
              <ul className={`flex flex-wrap gap-1.5 ${hoverReveal}`}>
                {segment.zones.map((zone) => (
                  <li
                    key={zone}
                    className="border border-white/12 px-2.5 py-1 property-tag-type text-white/65"
                  >
                    {zone}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="hidden text-body-sm leading-relaxed text-white/55 transition-all duration-500 md:block md:max-h-0 md:translate-y-1 md:overflow-hidden md:opacity-0 md:group-hover:max-h-32 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {segment.metric}
            </p>

            <div className="mt-auto pt-1">
            <Link
                href={segment.href}
                className={`group/cta inline-flex items-center gap-2 transition-colors duration-300 ${hoverReveal} ${
                  isMosaicLike ? "text-[var(--color-accent)]" : "text-white/85"
                } hover:text-[var(--color-accent)]`}
              >
                <span className="property-tag-type relative pb-1">
                  Ver línea
                  <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover/cta:opacity-100" />
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </div>
        </>
      )}
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

        <div className="absolute inset-x-0 bottom-5 z-20 border-t border-white/[0.06] bg-background/45 backdrop-blur-sm sm:bottom-6 lg:bottom-8">
          <div className="mx-auto flex max-w-[90rem] overflow-hidden py-3.5 text-white/68 sm:py-4">
            <HeroMarqueeStrip />
            <HeroMarqueeStrip duplicate />
          </div>
        </div>
      </section>

      <HomeCounters />

      <section className="mx-auto mt-8 max-w-[90rem] overflow-hidden px-6 py-12 sm:mt-8 sm:px-10 sm:py-14 md:py-16 lg:mt-0 lg:px-16 lg:py-14">
        <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between md:mb-5 lg:mb-6">
          <div>
            <p className="mb-1.5 property-tag-type gold-ink">
              Tres líneas de negocio
            </p>
            <h2 className="mb-0 text-display-2 leading-tight tracking-headline text-white">
              Explora por categoría.
            </h2>
          </div>
          <p className="mb-0 max-w-xl text-body leading-snug text-white/58">
            Tres líneas inmobiliarias, un mismo criterio de inversión.
          </p>
        </div>

        <div className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 sm:-mx-10 sm:px-10 lg:hidden">
          {segments.map((segment) => (
            <div key={`mobile-${segment.title}`} className="min-w-[82vw] snap-center sm:min-w-[54vw] md:min-w-[48vw]">
              <SegmentCard segment={segment} variant="mobile" />
            </div>
          ))}
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {segments.map((segment) => (
            <SegmentCard key={`desktop-${segment.title}`} segment={segment} variant="mosaic" />
          ))}
        </div>
      </section>

      <Testimonials />

      <MethodologySection />

      <section className="relative border-t border-white/[0.06] bg-white/[0.02]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
        />
        <div className="mx-auto max-w-[90rem] px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
          <div className="relative overflow-hidden border border-white/[0.08] bg-background/70">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent"
            />
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
                <div className="flex items-center justify-between gap-4">
                  <p className="property-tag-type gold-ink">Manifiesto</p>
                  <span className="h-px flex-1 bg-white/[0.08]" aria-hidden="true" />
                </div>
                <p className="mt-5 mb-0 max-w-4xl text-[clamp(1.8rem,7vw,2.65rem)] font-extrabold leading-[1.02] tracking-headline text-white/92 lg:text-display-2">
                  Menos ruido.{" "}
                  <span className="gold-ink">Más claridad para decidir</span>.
                </p>
                <p className="mt-4 mb-0 max-w-2xl text-body leading-snug text-white/58">
                  Compra, venta, renta e inversión con criterio comercial desde
                  el primer paso.
                </p>
              </div>

              <div className="border-t border-white/[0.08] bg-white/[0.025] lg:border-l lg:border-t-0">
                <div className="grid grid-cols-2 lg:grid-cols-1">
                  {intentCtas.map((cta, index) => (
                    <Link
                      key={cta.label}
                      href={cta.href}
                      className="group flex min-h-[68px] items-center justify-between gap-3 border-white/[0.08] px-4 py-3 transition-colors duration-500 hover:bg-white/[0.04] odd:border-r lg:min-h-[76px] lg:border-b lg:odd:border-r-0 lg:last:border-b-0"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="property-tag-type gold-ink">
                          0{index + 1}
                        </span>
                        <span className="text-[0.95rem] font-semibold leading-none text-white transition-colors duration-500 group-hover:text-[var(--color-accent)] sm:text-[1rem]">
                          {cta.label}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-white/[0.08] px-5 py-3 sm:px-7 lg:px-9">
              <p className="mb-0 text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.1em] text-white/45">
                Cada ruta empieza con una lectura clara del activo, del mercado y
                del objetivo.
              </p>
            </div>
          </div>
        </div>
      </section>
      <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
    </main>
  );
}

