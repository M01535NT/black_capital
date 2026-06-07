/**
 * SubBrandCTA — gated-access lead-capture para los 3 sub-brand landings.
 *
 * Replaces:
 *   - src/components/luxury/LuxuryCTA.tsx
 *   - src/components/business/BusinessCTA.tsx
 *   - src/components/industrial/IndustrialCTA.tsx
 *
 * Premium Estilo A: layout 50/50 (copy a la izquierda, form a la
 * derecha), separados por una vline dorada. Sin glass panel, sin
 * chrome steel/industrial. Inputs con underline (border-b) y submit
 * brushed-gold. La única diferenciación entre marcas es el campo
 * "Empresa" (siempre visible si `companyRequired`).
 */

"use client";

import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, Lock, Download, ArrowRight } from "lucide-react";

export type SubBrand = "luxury" | "business" | "industrial";

export interface SubBrandCTAConfig {
    brand: SubBrand;
    /** Lead source string for analytics + DB. */
    source: string;
    /** Prefix for the `notes` field. */
    notesPrefix: string;
    /** Whether the notes should always include the company (industrial) or only if present. */
    notesFormat: "optional" | "always";

    /** id on the wrapping <section> so the SubBrandHero's secondary CTA can link to it. */
    sectionId?: string;
    /** Override default py. */
    spacing?: "default" | "tight" | "loose" | "none";

    /* ── Header content ───────────────────────────────────────────── */
    eyebrowIcon: "lock" | "download";
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    /** "Respuesta en menos de 24h" pill (luxury/business). */
    indicator?: string;

    /* ── Form ─────────────────────────────────────────────────────── */
    companyLabel: string;
    companyPlaceholder: string;
    companyRequired: boolean;
    emailPlaceholder: string;
    submitLabel: string;

    /* ── Success state ────────────────────────────────────────────── */
    successTitle: string;
    successMessage: string;
}

const PRIVACY_HREF = "/legal/aviso-privacidad";

const DISPOSABLE_EMAIL_RE =
    /(tempmail|mailinator|guerrilla|yopmail|throwaway|10minute|trashmail)/i;

function buildSchema(companyRequired: boolean) {
    return z.object({
        fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        company: companyRequired
            ? z.string().min(1, "Empresa requerida para solicitudes industriales")
            : z.string().optional(),
        email: z
            .string()
            .email("Debe ser un correo electrónico válido")
            .refine((val) => !DISPOSABLE_EMAIL_RE.test(val), {
                message: "Por favor, utiliza un correo corporativo o personal real",
            }),
        phone: z.string().optional(),
        privacy: z
            .boolean()
            .refine((val) => val === true, {
                message: "Debes aceptar el aviso de privacidad",
            }),
    });
}

type CTAFormValues = z.infer<ReturnType<typeof buildSchema>>;

const SECTION_SPACING = {
    none: "py-0",
    tight: "py-16 sm:py-20 lg:py-24",
    default: "py-24 sm:py-32 lg:py-32",
    loose: "py-32 sm:py-40 lg:py-56",
} as const;

export function SubBrandCTA({ config }: { config: SubBrandCTAConfig }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();
    const schema = buildSchema(config.companyRequired);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CTAFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            company: "",
            email: "",
            phone: "",
            privacy: false,
        },
    });

    const privacyValue = watch("privacy");
    const privacyId = useId();
    const errPrivacyId = useId();
    const hasErr = (name: keyof CTAFormValues) => !!errors[name];

    async function onSubmit(data: CTAFormValues) {
        setIsSubmitting(true);

        posthog.capture("lead_magnet_submitted", {
            source: config.source,
            has_company: !!data.company,
        });

        try {
            const notes =
                config.notesFormat === "always" && data.company
                    ? `${config.notesPrefix} — Empresa: ${data.company}`
                    : data.company
                    ? `${config.notesPrefix} — Empresa/Fondo: ${data.company}`
                    : config.notesPrefix;

            const { error } = await supabase.from("leads").insert([
                {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone || null,
                    privacy_accepted: true,
                    source: config.source,
                    status: "new",
                    notes,
                },
            ]);

            if (error) throw error;

            setIsSuccess(true);
            toast.success("¡Solicitud enviada con éxito!");
        } catch {
            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section
            id={config.sectionId}
            aria-label={`Solicitud de acceso ${config.brand}`}
            className={`w-full bg-background relative border-t border-b border-white/[0.04] ${SECTION_SPACING[config.spacing ?? "default"]}`}
        >
            <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
                {!isSuccess ? (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Vertical vline (desktop) */}
                        <div
                            className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                            aria-hidden="true"
                        />

                        {/* Left — Copy */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                {config.eyebrowIcon === "lock" ? (
                                    <Lock className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                                ) : (
                                    <Download className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                                )}
                                <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
                                    {config.eyebrow}
                                </span>
                            </div>

                            <h2 className="text-display-2 font-light text-white leading-display tracking-headline">
                                {config.title}
                                <br />
                                <span className="metallic-gold-static">{config.titleHighlight}</span>
                            </h2>

                            <p className="text-body-fluid-sm text-white/65 leading-relaxed font-light max-w-md">
                                {config.description}
                            </p>

                            {config.indicator && (
                                <div className="flex items-center gap-3 pt-2 text-white/55 text-[10px] tracking-[0.2em] uppercase font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                                    {config.indicator}
                                </div>
                            )}
                        </div>

                        {/* Right — Form */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                            noValidate
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-1">
                                    <Input
                                        placeholder="Nombre Completo"
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-sm font-light"
                                        aria-invalid={hasErr("fullName") || undefined}
                                        {...register("fullName")}
                                    />
                                    {errors.fullName && (
                                        <p className="text-xs text-red-400">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        placeholder={config.companyPlaceholder}
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-sm font-light"
                                        aria-invalid={hasErr("company") || undefined}
                                        {...register("company")}
                                    />
                                    {errors.company && (
                                        <p className="text-xs text-red-400">
                                            {errors.company.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-1">
                                    <Input
                                        type="email"
                                        placeholder={config.emailPlaceholder}
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-sm font-light"
                                        aria-invalid={hasErr("email") || undefined}
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-400">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        type="tel"
                                        placeholder="Teléfono (Opcional)"
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-sm font-light"
                                        aria-invalid={hasErr("phone") || undefined}
                                        {...register("phone")}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 pt-4">
                                <Checkbox
                                    id={privacyId}
                                    checked={privacyValue}
                                    onCheckedChange={(checked) =>
                                        setValue(
                                            "privacy",
                                            checked === true,
                                            { shouldValidate: true }
                                        )
                                    }
                                    aria-invalid={hasErr("privacy") || undefined}
                                    aria-describedby={
                                        hasErr("privacy") ? errPrivacyId : undefined
                                    }
                                    className="mt-1 border-white/30 data-[state=checked]:bg-[var(--color-accent)] data-[state=checked]:text-black"
                                />
                                <label
                                    htmlFor={privacyId}
                                    className="text-sm text-white/65 leading-relaxed cursor-pointer font-light"
                                >
                                    Acepto el{" "}
                                    <a
                                        href={PRIVACY_HREF}
                                        className="text-[var(--color-accent)] hover:underline underline-offset-4"
                                    >
                                        Aviso de Privacidad
                                    </a>{" "}
                                    y consiento el tratamiento de mis datos para prospección comercial.
                                </label>
                            </div>
                            {errors.privacy && (
                                <p
                                    id={errPrivacyId}
                                    className="text-xs text-red-400"
                                >
                                    {errors.privacy.message}
                                </p>
                            )}

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="brushed-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[13px] font-bold tracking-[0.06em] rounded-full hover:scale-[1.015] transition-all duration-300 min-h-[48px]"
                                >
                                    {isSubmitting ? (
                                        <Loader2
                                            className="mr-2 h-4 w-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                    ) : null}
                                    {isSubmitting ? "Procesando..." : config.submitLabel}
                                    {!isSubmitting && (
                                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div
                        className="text-center max-w-xl mx-auto py-12"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="w-20 h-20 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-[var(--color-accent)]" aria-hidden="true" />
                        </div>
                        <h3 className="text-display-3 font-light text-white leading-display tracking-headline mb-4">
                            {config.successTitle}
                        </h3>
                        <p className="text-body-fluid-sm text-white/65 leading-relaxed font-light">
                            {config.successMessage}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
