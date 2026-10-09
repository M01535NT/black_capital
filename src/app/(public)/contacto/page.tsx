import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { ContactLeadForm } from "@/components/public/contact-lead-form";

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
    <div className="w-full flex-1 bg-background pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-[90rem] items-start gap-10 px-6 pb-16 sm:px-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8 lg:px-16 lg:pb-24">
        <header className="min-w-0 lg:col-span-5">
          <p className="mb-4 property-tag-type text-[var(--color-accent)]">Contacto directo · Tijuana</p>
          <h1 className="text-display-1 leading-hero tracking-tight text-white text-balance">Hablemos de tu inmueble.</h1>
          <p className="mt-5 max-w-2xl text-body-fluid leading-relaxed text-white/65">Comprar, vender, rentar o saber cuánto puede valer una propiedad. Comparte tu consulta o elige el canal que prefieras.</p>
        </header>
          <section id="solicitud" aria-labelledby="solicitud-title" className="min-w-0 scroll-mt-28 border border-white/10 bg-white/[0.025] p-5 sm:p-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <h2 id="solicitud-title" className="mb-3 text-display-2 leading-display tracking-headline text-white">Cuéntanos qué necesitas.</h2>
            <p className="mb-7 text-body-sm leading-relaxed text-white/55">Usaremos tus datos para responder esta consulta. El teléfono es opcional.</p>
            <Suspense fallback={<p className="text-body text-white/60">Cargando formulario…</p>}><ContactLeadForm /></Suspense>
          </section>
          <aside id="canales" aria-label="Canales de atención" className="min-w-0 lg:col-span-5 lg:row-start-2">
            <h2 className="mb-6 text-display-2 leading-display tracking-headline text-white">También estamos aquí.</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {contactChannels.map(({ icon: Icon, title, lines, ...channel }) => (
                <div key={title} className="min-w-0 border-t border-white/10 pt-4">
                  <div className="min-w-0 [&>p+p]:mt-0"><h3 className="mb-2 flex items-center gap-3 text-display-3 text-white"><Icon className="h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />{title}</h3>
                    {lines.map((line) => <p key={line} className="break-words text-body-sm leading-relaxed text-white/60 sm:text-body">{line}</p>)}
                    {"href" in channel && <a href={channel.href} {...(channel.href?.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-1 inline-flex min-h-11 items-center text-body-sm text-[var(--color-accent)] underline underline-offset-4">{channel.label}</a>}
                  </div>
                </div>
              ))}
            </div>
          </aside>
      </div>
    </div>
  );
}
