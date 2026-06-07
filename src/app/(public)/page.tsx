import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Home,
  MapPin,
  Search,
  Warehouse,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Inmobiliaria en Tijuana | Residencial, Comercial e Industrial | Black Capital",
  description:
    "Explora oportunidades residenciales, comerciales e industriales en Tijuana. Inventario ejemplo, filtros por zona y contacto directo para compradores, empresarios e inversionistas.",
  openGraph: {
    title: "Black Capital | Inmobiliaria en Tijuana",
    description:
      "Propiedades residenciales, comerciales e industriales en Tijuana con atención directa para leads comerciales.",
    type: "website",
    locale: "es_MX",
    siteName: "Black Capital",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Black Capital",
  url: "https://blackcorporativo.com",
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
    copy: "Casas, departamentos y preventas para familias e inversionistas.",
    zones: "Playas, Chapultepec, Zona Río",
  },
  {
    title: "Comercial",
    href: "/black-business",
    inventoryHref: "/inventario?uso=Comercial",
    image: "/brand-business.webp",
    icon: Building2,
    copy: "Locales, oficinas y plazas para operación, renta o inversión.",
    zones: "Otay, Centro, Díaz Ordaz",
  },
  {
    title: "Industrial",
    href: "/black-industrial",
    inventoryHref: "/inventario?uso=Industrial",
    image: "/brand-industrial.webp",
    icon: Warehouse,
    copy: "Naves, bodegas y suelo industrial cerca de corredores logísticos.",
    zones: "Otay, Pacífico, Florido",
  },
];

const process = [
  "Filtramos por presupuesto, zona, m² y uso de suelo.",
  "Validamos información comercial antes de presentarla al cliente.",
  "Capturamos el lead y lo dejamos listo para seguimiento desde admin.",
];

export default function HomePage() {
  return (
    <main className="bg-background">
      <section className="relative min-h-[92svh] overflow-hidden border-b border-white/[0.06] pt-24 lg:pt-28">
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

        <div className="relative z-10 mx-auto grid min-h-[calc(92svh-6rem)] max-w-[90rem] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-12 lg:px-16">
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Tijuana, Baja California
            </div>
            <h1 className="max-w-4xl text-display-1 font-light leading-hero tracking-tight text-white text-balance">
              Encuentra el activo inmobiliario correcto.
            </h1>
            <p className="mt-6 max-w-2xl text-body-fluid text-white/72 leading-relaxed">
              Una experiencia más clara para compradores, empresarios e inversionistas:
              inventario por tipo, filtros útiles y contacto directo para iniciar seguimiento comercial.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inventario"
                className="brushed-gold inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full px-7 text-sm font-bold"
              >
                Ver inventario ejemplo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-7 text-sm font-semibold text-white hover:border-[var(--color-accent)]"
              >
                Hablar con un asesor
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-background/82 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Búsqueda rápida</p>
                  <p className="text-xs text-white/50">Placeholder editable desde admin</p>
                </div>
              </div>
              <div className="grid gap-3 py-4">
                {["Tipo de operación", "Zona de Tijuana", "Rango de precio", "m² o uso de suelo"].map((label) => (
                  <div key={label} className="flex items-center justify-between border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-white/65">{label}</span>
                    <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">Seleccionar</span>
                  </div>
                ))}
              </div>
              <Link
                href="/inventario"
                className="inline-flex w-full items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-bold text-black"
              >
                Buscar propiedades
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Tres líneas de negocio
            </p>
            <h2 className="text-display-2 font-light leading-display tracking-headline text-white">
              Segmenta desde el primer clic.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/58">
            El contenido real se cargará desde el panel de administración. Por ahora se muestran ejemplos para validar estructura, ritmo visual y conversión.
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-xl font-semibold text-white">{segment.title}</h3>
                  </div>
                </div>
                <div className="space-y-5 p-5">
                  <p className="text-sm leading-6 text-white/64">{segment.copy}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/42">{segment.zones}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href={segment.inventoryHref} className="inline-flex flex-1 items-center justify-center gap-2 border border-[var(--color-accent)]/45 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                      Inventario
                    </Link>
                    <Link href={segment.href} className="inline-flex flex-1 items-center justify-center gap-2 border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white/75">
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
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Flujo comercial
            </p>
            <h2 className="text-display-2 font-light leading-display tracking-headline text-white">
              Menos fricción, mejor seguimiento.
            </h2>
          </div>
          <div className="grid gap-4 lg:col-span-7">
            {process.map((item, index) => (
              <div key={item} className="flex gap-4 border border-white/[0.08] bg-background/70 p-5">
                <span className="text-sm font-bold text-[var(--color-accent)]">0{index + 1}</span>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-sm leading-6 text-white/70">{item}</p>
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
