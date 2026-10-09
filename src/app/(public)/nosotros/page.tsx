import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { CinematicImage } from "@/components/visual/CinematicImage";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Black Capital es una inmobiliaria en Tijuana para compra, venta y renta residencial, comercial e industrial.",
  alternates: { canonical: "https://blackmx.vercel.app/nosotros" },
};

const miembros = [
  { nombre: "Moisés Núñez", cargo: "Director General", descripcion: "Define precio, estrategia y seguimiento con propietarios e inversionistas." },
  { nombre: "Omar Medina Yañez", cargo: "Asesor Senior", descripcion: "Especialista en residencial y fraccionamientos privados." },
];
const hitos = [
  { anio: "2018", titulo: "Inicio", descripcion: "Nacemos en Tijuana con enfoque residencial." },
  { anio: "2020", titulo: "Comercial", descripcion: "Integramos locales y oficinas en zonas de flujo." },
  { anio: "2022", titulo: "Industrial", descripcion: "Sumamos naves y bodegas en corredores logísticos." },
  { anio: "2024", titulo: "Método", descripcion: "Mejoramos la revisión de precio, documentos y seguimiento." },
  { anio: "2026", titulo: "Hoy", descripcion: "Residencial, comercial e industrial con atención directa." },
];
const principios = [
  { titulo: "Revisión y criterio", descripcion: "Documentos, estado, precio y condiciones. Revisión legal, fiscal y técnica cuando aplica; comparables de la zona para decidir mejor." },
  { titulo: "Trato directo", descripcion: "Una línea de comunicación con propietarios, compradores e inversionistas. Análisis claro y seguimiento hasta la firma o decisión final." },
  { titulo: "Enfoque especializado", descripcion: "Residencial, comercial e industrial con enfoque propio. Rapidez sin perder análisis, cuidando información, precio y condiciones." },
];

export default function NosotrosPage() {
  return (
    <div className="w-full flex-1 bg-background">
      <section aria-label="Nosotros">
        <CinematicImage src="/hero-business.webp" alt="Espacios comerciales y arquitectura contemporánea al atardecer" priority className="min-h-[85svh]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
          <div className="relative mx-auto flex min-h-[85svh] max-w-[90rem] flex-col justify-end px-6 pb-16 pt-36 sm:px-10 lg:px-16 lg:pb-24">
            <p className="mb-5 property-tag-type text-[var(--color-accent)]">Black Capital · Tijuana</p>
            <h1 className="max-w-4xl text-display-1 text-white leading-hero tracking-tight text-balance">Visión local.<br />Perspectiva amplia.</h1>
            <p className="mt-6 max-w-xl text-body-fluid leading-relaxed text-white/75">Con propietarios, compradores e inversionistas. En residencial, comercial e industrial.</p>
          </div>
        </CinematicImage>
      </section>

      <nav aria-label="Secciones de nosotros" className="mx-auto flex max-w-[90rem] flex-wrap gap-x-6 gap-y-2 px-6 py-6 sm:px-10 lg:px-16">
        {[["#equipo", "Equipo"], ["#valores", "Cómo trabajamos"], ["#historia", "Trayectoria"], ["#contacto", "Contacto"]].map(([href, title]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center text-body-sm text-white/55 transition-colors hover:text-[var(--color-accent)]">{title}</Link>)}
      </nav>

      <section id="equipo" aria-labelledby="equipo-title" className="mx-auto grid max-w-[90rem] scroll-mt-28 items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-12 lg:gap-20 lg:px-16 lg:py-24">
        <div className="lg:col-span-7">
          <p className="mb-4 property-tag-type text-[var(--color-accent)]">Nuestro equipo</p>
          <h2 id="equipo-title" className="max-w-xl text-display-2 text-white leading-display tracking-headline">Personas, antes que propiedades.</h2>
          <div className="mt-10 space-y-8">
            {miembros.map((miembro, index) => <article key={miembro.nombre} className="flex gap-5 border-t border-white/15 pt-6"><span className="pt-1 text-caption text-[var(--color-accent)]">0{index + 1}</span><div><p className="mb-2 property-tag-type text-white/45">{miembro.cargo}</p><h3 className="text-display-3 text-white">{miembro.nombre}</h3><p className="mt-3 max-w-md text-body leading-relaxed text-white/60">{miembro.descripcion}</p></div></article>)}
          </div>
        </div>
        <figure className="lg:col-span-5 lg:pt-20">
          <CinematicImage src="/line-comercial.webp" alt="Detalle de arquitectura comercial contemporánea" sizes="(min-width: 1024px) 40vw, 100vw" className="h-[400px] rounded-[1.25rem] sm:h-[540px]" />
          <figcaption className="mt-4 property-tag-type text-white/35">Arquitectura · Espacio · Entorno</figcaption>
        </figure>
      </section>

      <section id="valores" aria-labelledby="valores-title" className="scroll-mt-28 px-3 sm:px-6">
        <CinematicImage src="/hero-luxury.webp" alt="" className="rounded-[1.5rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/60" />
          <div className="relative mx-auto grid min-h-[680px] max-w-[90rem] items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-24 lg:px-16 lg:py-24">
            <div><p className="mb-4 property-tag-type text-[var(--color-accent)]">Cómo trabajamos</p><h2 id="valores-title" className="max-w-lg text-display-2 text-white leading-display tracking-headline">La claridad guía cada decisión.</h2></div>
            <div>{principios.map((principio, index) => <details key={principio.titulo} open={index === 0} className="group border-b border-white/25 py-2"><summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 text-display-3 text-white focus-visible:outline focus-visible:outline-[var(--color-accent)] [&::-webkit-details-marker]:hidden">{principio.titulo}<Plus className="h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" /></summary><p className="max-w-lg pb-6 text-body leading-relaxed text-white/75">{principio.descripcion}</p></details>)}</div>
          </div>
        </CinematicImage>
      </section>

      <section id="historia" aria-labelledby="historia-title" className="mx-auto max-w-[90rem] scroll-mt-28 px-6 py-20 sm:px-10 lg:px-16 lg:py-32">
        <p className="mb-4 property-tag-type text-[var(--color-accent)]">Nuestra trayectoria</p>
        <h2 id="historia-title" className="max-w-2xl text-display-2 text-white leading-display tracking-headline">Hecha en Tijuana.<br />En constante evolución.</h2>
        <ol className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">{hitos.map((hito) => <li key={hito.anio} className="border-t border-white/20 pt-6"><span className="text-display-2 tabular-nums text-[var(--color-accent)]">{hito.anio}</span><h3 className="mb-3 mt-5 text-body-lg text-white">{hito.titulo}</h3><p className="max-w-xs text-body-sm leading-relaxed text-white/55">{hito.descripcion}</p></li>)}</ol>
      </section>

      <section id="contacto" aria-labelledby="contacto-title" className="mx-auto max-w-[90rem] scroll-mt-28 px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[1.5rem] bg-white/[0.04] px-6 py-10 sm:p-12 lg:flex-row lg:items-center"><div><p className="mb-3 property-tag-type text-[var(--color-accent)]">Contacto directo</p><h2 id="contacto-title" className="text-display-2 leading-display tracking-headline text-white">Conversemos.</h2></div><Link href="/contacto" className="brushed-gold inline-flex min-h-14 items-center gap-8 rounded-full px-8 text-body-sm font-semibold text-black">Hablar con el equipo<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
      </section>
    </div>
  );
}
