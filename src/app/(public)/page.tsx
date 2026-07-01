import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeCounters } from "@/components/home/HomeCounters";
import { HomeLines } from "@/components/home/HomeLines";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeZones } from "@/components/home/HomeZones";
import { HomeTools } from "@/components/home/HomeTools";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { MethodologySection } from "@/components/home/MethodologySection";
import { Testimonials } from "@/components/home/Testimonials";

export const metadata: Metadata = {
  title: "Inmobiliaria en Tijuana",
  description:
    "Compra, venta y renta de inmuebles residenciales, comerciales e industriales en Tijuana con valor comercial, revisión documental y ruta de cierre.",
  openGraph: {
    title: "Black Capital | Inmobiliaria en Tijuana",
    description:
      "Representación inmobiliaria para comprar, vender, rentar o conocer el valor comercial de un inmueble en Tijuana.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Capital",
    // Al redefinir openGraph aquí se pierde la imagen de convención (opengraph-image.tsx),
    // así que la referenciamos explícitamente para conservar el preview social.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Black Capital - Inmobiliaria en Tijuana" }],
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

const intentCtas = [
  { label: "Vender", href: "/contacto?objetivo=vender" },
  { label: "Comprar", href: "/contacto?objetivo=comprar" },
  { label: "Rentar", href: "/inventario?tipo=Renta" },
  { label: "Invertir", href: "/contacto?objetivo=invertir" },
];
const rotatingInventoryWords = ["Residencial", "Comercial", "Industrial"];
const MARQUEE_ROTATE_INTERVAL_MS = 3000;

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

export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative border-b border-white/[0.08]">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Text column */}
          <div className="flex flex-col justify-center px-6 pb-14 pt-28 sm:px-10 lg:px-16 lg:py-32">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--color-accent)]" aria-hidden="true" />
              <span className="property-tag-type gold-ink">
                Inmobiliaria en Tijuana · B.C.
              </span>
            </div>
            <h1 className="font-display text-display-1 font-extrabold uppercase leading-[1.02] tracking-tight text-white">
              Representación<br />
              inmobiliaria<br />
              <span className="gold-ink">con criterio.</span>
            </h1>
            <p className="mt-6 max-w-md text-body text-white/60">
              Ordenamos precio, zona, documentos y ruta de cierre antes de que
              avances. Residencial, comercial e industrial.
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

          {/* Media column */}
          <div
            className="relative min-h-[340px] overflow-hidden border-t border-[var(--color-accent)]/15 sm:min-h-[440px] lg:min-h-0 lg:border-l lg:border-t-0"
            style={{
              background:
                "repeating-linear-gradient(135deg,#151310 0 11px,#100e0c 11px 22px)",
            }}
          >
            <video
              src="/hero.webm"
              poster="/hero-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            />
            <Image
              src="/hero-poster.webp"
              alt="Residencia en Tijuana representada por Black Capital"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="hidden object-cover motion-reduce:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-background/30" />
          </div>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden border-t border-[var(--color-accent)]/15 bg-white/[0.02]">
          <div className="mx-auto flex max-w-[90rem] overflow-hidden py-3.5 text-white/68 sm:py-4">
            <HeroMarqueeStrip />
            <HeroMarqueeStrip duplicate />
          </div>
        </div>
      </section>

      <HomeCounters />

      <HomeLines />

      <MethodologySection />

      <HomeFeatured />

      <HomeZones />

      <Testimonials />

      <HomeTools />

      <HomeFAQ />

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
                  Primero el activo.{" "}
                  <span className="gold-ink">Luego la operación</span>.
                </p>
                <p className="mt-4 mb-0 max-w-2xl text-body leading-snug text-white/58">
                  Ordenamos precio, zona, documentos y ruta antes de avanzar.
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
                Compra, venta, renta e inversión inmobiliaria en Tijuana.
              </p>
            </div>
          </div>
        </div>
      </section>
      <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
    </main>
  );
}
