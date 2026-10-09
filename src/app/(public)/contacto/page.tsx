import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { ContactLeadForm } from "@/components/public/contact-lead-form";
import { CinematicImage } from "@/components/visual/CinematicImage";

export const metadata: Metadata = {
  alternates: { canonical: "/contacto" },
  title: "Contacto",
  description: "Contacta a Black Capital para comprar, vender, rentar o saber cuánto puede valer una propiedad en Tijuana.",
  openGraph: {
    title: "Contacto | Black Capital",
    description: "Consulta directa para propietarios, compradores, arrendatarios e inversionistas en Tijuana.",
    type: "website", locale: "es_MX", siteName: "Black Capital",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Black Capital - Inmobiliaria en Tijuana" }],
  },
};

const contactChannels = [
  { icon: Phone, title: "WhatsApp", lines: [CONTACT_CONFIG.phone], href: `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, quiero orientación sobre una propiedad.")}`, label: "Escribir por WhatsApp" },
  { icon: Mail, title: "Correo", lines: [CONTACT_CONFIG.email], href: `mailto:${CONTACT_CONFIG.email}`, label: "Enviar correo" },
  { icon: MapPin, title: "Ubicación", lines: CONTACT_CONFIG.addressLines },
  { icon: Clock, title: "Horario", lines: CONTACT_CONFIG.hours },
];

export default function ContactoPage() {
  return (
    <div className="w-full flex-1 bg-background pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-[90rem] items-start gap-10 px-6 pb-20 sm:px-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-16 lg:px-16 lg:pb-28">
        <header className="min-w-0 lg:col-span-5">
          <CinematicImage src="/line-residencial.webp" alt="Arquitectura residencial con vistas al atardecer" priority sizes="(min-width: 1024px) 42vw, 100vw" className="h-[360px] rounded-[1.25rem] sm:h-[480px] lg:h-[720px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="mb-4 property-tag-type text-[var(--color-accent)]">Contacto directo · Tijuana</p>
              <h1 className="text-display-1 leading-hero tracking-tight text-white text-balance">Hola.</h1>
              <p className="mt-5 max-w-sm text-body-fluid leading-relaxed text-white/75">Tu próximo paso empieza aquí.</p>
            </div>
          </CinematicImage>
        </header>
        <section id="solicitud" aria-labelledby="solicitud-title" className="min-w-0 scroll-mt-28 lg:col-span-7 lg:pt-7">
          <p className="mb-4 property-tag-type text-[var(--color-accent)]">Comprar · Vender · Rentar</p>
          <h2 id="solicitud-title" className="mb-4 text-display-2 leading-display tracking-headline text-white">Cuéntanos qué necesitas.</h2>
          <p className="mb-8 max-w-md text-body-sm leading-relaxed text-white/55">Usaremos tus datos para responder tu consulta. El teléfono es opcional.</p>
          <Suspense fallback={<p className="text-body text-white/60">Cargando formulario…</p>}><ContactLeadForm /></Suspense>
        </section>
        <aside id="canales" aria-label="Canales de atención" className="min-w-0 pt-4 lg:col-span-12">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-3"><h2 className="text-display-3 text-white">También estamos aquí.</h2><p className="property-tag-type text-white/40">Elige cómo conversar</p></div>
          <div className="grid gap-x-9 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {contactChannels.map(({ icon: Icon, title, lines, ...channel }) => (
              <div key={title} className="min-w-0 border-t border-white/15 pt-5">
                <h3 className="mb-3 flex items-center gap-3 text-body-lg text-white"><Icon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />{title}</h3>
                {lines.map((line) => <p key={line} className="break-words text-body-sm leading-relaxed text-white/60">{line}</p>)}
                {"href" in channel && <a href={channel.href} {...(channel.href?.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-2 inline-flex min-h-11 items-center text-body-sm text-[var(--color-accent)] underline underline-offset-4">{channel.label}</a>}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
