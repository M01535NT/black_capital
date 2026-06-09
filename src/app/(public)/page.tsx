import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  MapPin,
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
    title: "Residencial",
    href: "/black-luxury",
    inventoryHref: "/inventario?uso=Residencial",
    image: "/brand-luxury.webp",
    icon: Home,
    copy: "Casas en zona dorada.",
    zones: "Chapultepec · Zona Río · Playas",
  },
  {
    title: "Comercial",
    href: "/black-business",
    inventoryHref: "/inventario?uso=Comercial",
    image: "/brand-business.webp",
    icon: Building2,
    copy: "Locales y plazas comerciales.",
    zones: "Zona Río · Otay · Díaz Ordaz",
  },
  {
    title: "Industrial",
    href: "/black-industrial",
    inventoryHref: "/inventario?uso=Industrial",
    image: "/brand-industrial.webp",
    icon: Warehouse,
    copy: "Naves y suelo industrial.",
    zones: "Otay · Pacífico · El Florido",
  },
];

const process = [
  "Analizamos ubicación, condición y comparables.",
  "Definimos valor, mensaje y perfil objetivo.",
  "Gestionamos marketing, negociación y cierre.",
];

const advisoryPaths = [
  {
    audience: "Compradores",
    title: "Comprar con criterio.",
    copy: "Definimos perfil, filtramos opciones y negociamos con datos.",
    steps: ["Perfil de búsqueda", "Opciones viables", "Cierre acompañado"],
  },
  {
    audience: "Vendedores",
    title: "Vender con estrategia.",
    copy: "Opinión de valor, precio de salida y plan comercial.",
    steps: ["Dictamen inicial", "Marketing sobrio", "Seguimiento comercial"],
  },
  {
    audience: "Arrendadores",
    title: "Rentar sin improvisar.",
    copy: "Perfilamos interesados, cuidamos condiciones y documentamos entrega.",
    steps: ["Renta objetivo", "Prospectos calificados", "Contrato y entrega"],
  },
];

const values = [
  "Honestidad",
  "Compromiso",
  "Disciplina",
  "Conocimiento",
  "Transparencia",
  "Experiencia",
  "Integridad",
  "Resultados",
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
              <MapPin className="h-3.5 w-3.5 text-[var(--color-gold-light)]" />
              Tijuana, Baja California
            </div>
            <HomeHeroHeadline />
            <p className="mt-6 max-w-xl text-body text-white/66">
              Compra, venta y renta inmobiliaria en Tijuana con estrategia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inventario"
                className="brushed-gold premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full"
              >
                Ver inventario
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.04] text-white hover:border-[var(--color-gold-light)]"
              >
                Solicitar asesoría
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100svh-3.5rem)] z-20 sm:top-[calc(100svh-4rem)]">
          <div className="h-px bg-[var(--color-gold-light)]/25" />
          <div className="flex overflow-hidden whitespace-nowrap bg-background/88 py-4 backdrop-blur-md sm:py-5">
            {[0, 1].map((track) => (
              <div key={track} className="animate-marquee inline-flex shrink-0">
                {values.map((value, index) => (
                  <span key={`${track}-${value}-${index}`} className="inline-flex shrink-0 items-center">
                    <span className="px-5 property-tag-type text-white/78 transition-colors duration-300 hover:text-[var(--color-gold-light)] sm:px-10">
                      {value}
                    </span>
                    <span className="select-none text-[var(--color-gold-light)]" aria-hidden="true">
                      •
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-caption text-[var(--color-gold-light)]">
              Tres líneas de negocio
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Activos con demanda real.
            </h2>
          </div>
          <p className="max-w-xl text-body text-white/58">
            Residencial, comercial e industrial en Tijuana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <article key={segment.title} className="group overflow-hidden border border-white/[0.08] bg-white/[0.025]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={segment.image}
                    alt={`Ejemplo de propiedad ${segment.title.toLowerCase()} en Tijuana`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold-light)] text-black">
                      <Icon className="h-4 w-4" />
                    </span>
                  <h3 className="text-display-3 font-semibold text-white">{segment.title}</h3>
                  </div>
                </div>
                <div className="space-y-5 p-5">
                  <p className="text-body text-white/64">{segment.copy}</p>
                  <p className="property-tag-type text-[var(--color-gold-light)]/75">{segment.zones}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href={segment.inventoryHref} className="inline-flex flex-1 items-center justify-center gap-2 border border-[var(--color-gold-light)]/45 px-4 py-2.5 property-tag-type text-[var(--color-gold-light)]">
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
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:px-16 lg:py-24">
          <div className="lg:col-span-5">
            <p className="mb-3 property-tag-type text-[var(--color-gold-light)]">
              Asesoría inmobiliaria
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Según tu objetivo.
            </h2>
            <p className="mt-6 max-w-md text-body text-white/58">
              Comprar, vender o rentar exige procesos distintos. El punto de partida cambia; el criterio no.
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-7">
            {advisoryPaths.map((path) => (
              <article key={path.audience} className="border border-white/[0.08] bg-background/70 p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                                <p className="mb-2 property-tag-type text-[var(--color-gold-light)]">
                                    {path.audience}
                                </p>
                                <h3 className="text-display-3 text-white">{path.title}</h3>
                              </div>
                              <p className="max-w-sm text-body text-white/58">{path.copy}</p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {path.steps.map((step, index) => (
                                <div key={step} className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.025] px-3 py-3">
                                  <span className="property-tag-type text-[var(--color-gold-light)]">0{index + 1}</span>
                                  <span className="text-body text-white/68">{step}</span>
                                </div>
                              ))}
                            </div>
                          </article>
                        ))}
          </div>
        </div>
      </section>

      <HomeCounters />

      <section className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:px-16 lg:py-24">
          <div className="lg:col-span-5">
            <p className="mb-3 property-tag-type text-[var(--color-gold-light)]">
              Flujo comercial
            </p>
            <h2 className="text-display-2 leading-display tracking-headline text-white">
              Marketing y negociación.
            </h2>
          </div>
          <div className="grid gap-4 lg:col-span-7">
            {process.map((item, index) => (
              <div key={item} className="flex gap-4 border border-white/[0.08] bg-background/70 p-5">
                    <span className="property-tag-type text-[var(--color-gold-light)]">0{index + 1}</span>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold-light)]" />
                      <p className="text-body text-white/70">{item}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <JsonLd id="ld-org" data={ORGANIZATION_SCHEMA} />
    </main>
  );
}

