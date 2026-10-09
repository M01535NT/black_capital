/**
 * SubBrandCTA — cierre de las 3 landings (Luxury, Business, Industrial).
 *
 * Cierre fotográfico con acciones directas a asesoría y WhatsApp.
 * El contacto conserva el contexto de cada marca.
 */

import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CinematicImage } from "@/components/visual/CinematicImage";
import { CONTACT_CONFIG } from "@/lib/contact-config";

export type SubBrand = "luxury" | "business" | "industrial";

export interface SubBrandCTAConfig {
    brand: SubBrand;
    /** Lead source string (kept for analytics elsewhere). */
    source: string;
    /** Prefix for the `notes` field (kept for compatibility). */
    notesPrefix: string;
    notesFormat: "optional" | "always";

    /** id on the wrapping <section> so the SubBrandHero's secondary CTA can link to it. */
    sectionId?: string;
    spacing?: "default" | "tight" | "loose" | "none";

    /* ── Header content ───────────────────────────────────────────── */
    eyebrowIcon: "lock" | "download";
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    /** "Respuesta en menos de 24h" pill. */
    indicator?: string;

    /* ── Campos de formulario (deprecados, conservados por tipos) ──── */
    companyLabel?: string;
    companyPlaceholder?: string;
    companyRequired?: boolean;
    emailPlaceholder?: string;
    submitLabel?: string;
    successTitle?: string;
    successMessage?: string;
}

const BRAND_PHOTO: Record<SubBrand, { src: string; alt: string }> = {
    luxury: { src: "/line-residencial.webp", alt: "Arquitectura residencial contemporánea" },
    business: { src: "/line-comercial.webp", alt: "Espacio comercial contemporáneo" },
    industrial: { src: "/line-industrial.webp", alt: "Espacio industrial y logístico" },
};

export function SubBrandCTA({ config }: { config: SubBrandCTAConfig }) {
    const contactHref = `/contacto?brand=${config.brand}&objetivo=buscar-propiedad`;
    const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(`Hola, busco asesoría de Black ${config.brand}. Quisiera compartir los requisitos de mi búsqueda.`)}`;
    const photo = BRAND_PHOTO[config.brand];

    return (
        <section id={config.sectionId ?? `${config.brand}-cta`} aria-label={`Contacto ${config.brand}`} className="relative isolate flex min-h-[680px] w-full items-end overflow-hidden px-6 py-14 sm:px-10 lg:min-h-[800px] lg:px-20 lg:py-20">
            <CinematicImage src={photo.src} alt={photo.alt} className="!absolute inset-0" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_10%,rgba(0,0,0,.2)_35%,rgba(0,0,0,.85)_100%)]" />
            <div className="relative mx-auto w-full max-w-[90rem]">
                <ScrollReveal className="max-w-3xl">
                    <p className="mb-6 text-caption text-white/80">{config.eyebrow}</p>
                    <h2 className="text-display-2 text-balance text-white">{config.title}<span className="block text-[var(--color-accent)]">{config.titleHighlight}</span></h2>
                    <p className="mt-5 max-w-md text-body text-white/75">{config.description}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link href={contactHref} className="group inline-flex min-h-12 items-center gap-5 rounded-full bg-white px-6 py-3 text-body-sm font-medium text-black transition-colors hover:bg-[var(--color-accent)]">Hablemos<ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" /></Link>
                        <Link href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/45 px-5 text-body-sm text-white transition-colors hover:bg-white/15"><MessageCircle className="size-4" aria-hidden="true" />WhatsApp</Link>
                    </div>
                    {config.indicator && <p className="mt-7 flex items-center gap-2 footer-legal-type text-white/65"><span className="size-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />{config.indicator}</p>}
                </ScrollReveal>
            </div>
        </section>
    );
}
