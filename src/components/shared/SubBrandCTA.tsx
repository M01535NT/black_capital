/**
 * SubBrandCTA — cierre de las 3 landings (Luxury, Business, Industrial).
 *
 * Banda final sin captura de datos: copy + acciones directas
 * (asesor / WhatsApp). El formulario de lead se retiro por decision
 * de producto; el contacto vive en las paginas de contacto por marca.
 */

import Link from "next/link";
import { ArrowRight, Lock, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
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

const SECTION_SPACING = {
    none: "py-0",
    tight: "py-12 sm:py-14 lg:py-16",
    default: "py-16 lg:py-24",
    loose: "py-20 lg:py-28",
} as const;

export function SubBrandCTA({ config }: { config: SubBrandCTAConfig }) {
    const contactHref = `/black-${config.brand}/contacto`;
    const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}`;

    return (
        <section
            id={config.sectionId ?? `${config.brand}-cta`}
            aria-label={`Contacto ${config.brand}`}
            className={`relative w-full overflow-hidden border-y border-white/[0.06] bg-white/[0.02] ${SECTION_SPACING[config.spacing ?? "default"]}`}
        >
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-50"
                style={{
                    background:
                        "radial-gradient(ellipse at 50% 0%, rgba(210,167,60,0.14), transparent 55%)",
                }}
            />

            <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
                <ScrollReveal>
                    <div className="mb-6 inline-flex items-center gap-2">
                        {config.eyebrowIcon === "lock" ? (
                            <Lock className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                        ) : (
                            <Download className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                        )}
                        <span className="text-caption text-white/70">{config.eyebrow}</span>
                    </div>

                    <h2
                        className="text-display-2 text-balance text-white"
                        aria-label={`${config.title} ${config.titleHighlight}`}
                    >
                        {config.title}{" "}
                        <span className="metallic-gold-static">{config.titleHighlight}</span>
                    </h2>

                    <span
                        aria-hidden="true"
                        className="mx-auto mt-7 block h-px w-32 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
                    />

                    <p className="mx-auto mt-7 max-w-xl text-body leading-relaxed text-white/65">
                        {config.description}
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href={contactHref} className="w-full sm:w-auto">
                            <Button className="brushed-gold premium-cta group/cta inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-none sm:w-auto">
                                Hablar con un asesor
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover/cta:translate-x-1" aria-hidden="true" />
                            </Button>
                        </Link>
                        <Link
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 border border-white/15 px-7 text-white/85 transition-colors duration-300 hover:border-[var(--color-accent)]/40 hover:text-white sm:w-auto"
                        >
                            <MessageCircle className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                            <span className="property-tag-type">WhatsApp</span>
                        </Link>
                    </div>

                    {config.indicator && (
                        <p className="mt-7 inline-flex items-center justify-center gap-2 footer-legal-type text-white/55">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                            {config.indicator}
                        </p>
                    )}
                </ScrollReveal>
            </div>
        </section>
    );
}
