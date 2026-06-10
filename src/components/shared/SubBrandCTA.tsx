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

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
    tight: "py-12 sm:py-14 lg:py-16",
    default: "py-16 lg:py-24",
    loose: "py-20 lg:py-28",
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

const staggerGroup: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.08,
        },
    },
};

const revealItem: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.68, ease: EASE },
    },
};

export function SubBrandCTA({ config }: { config: SubBrandCTAConfig }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const shouldReduceMotion = useReducedMotion();
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

            const response = await fetch("/api/public-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone || "",
                    privacy_accepted: true,
                    source: config.source,
                    status: "new",
                    notes,
                }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.error || "No se pudo registrar el lead");
            }

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
            className={`relative w-full overflow-hidden border-y border-white/[0.06] bg-white/[0.02] ${SECTION_SPACING[config.spacing ?? "default"]}`}
        >
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-45"
                style={{
                    background:
                        "radial-gradient(ellipse at 14% 18%, rgba(210,167,60,0.16), transparent 38%), radial-gradient(ellipse at 86% 72%, rgba(255,255,255,0.045), transparent 45%)",
                }}
            />
            <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16">
                {!isSuccess ? (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left — Copy */}
                        <motion.div
                            className="space-y-6 lg:col-span-5"
                            variants={staggerGroup}
                            initial={shouldReduceMotion ? false : "hidden"}
                            whileInView="show"
                            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
                        >
                            <motion.div variants={revealItem} className="flex items-center gap-3">
                                {config.eyebrowIcon === "lock" ? (
                                    <Lock className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                                ) : (
                                    <Download className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />
                                )}
                                <span className="text-caption text-white/70">
                                    {config.eyebrow}
                                </span>
                            </motion.div>

                            <motion.h2 variants={revealItem} className="text-display-2 text-white text-balance">
                                {config.title}
                                <br />
                                <span className="metallic-gold-static">{config.titleHighlight}</span>
                            </motion.h2>

                            <motion.p variants={revealItem} className="text-body text-white/65 leading-relaxed max-w-md">
                                {config.description}
                            </motion.p>

                            {config.indicator && (
                                <motion.div variants={revealItem} className="flex items-center gap-3 pt-2 footer-legal-type text-white/55">
                                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                                    {config.indicator}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Right — Form */}
                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            className="relative space-y-6 border border-white/[0.08] bg-background/76 p-5 shadow-2xl shadow-black/30 sm:p-6 lg:col-span-7"
                            noValidate
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 28, clipPath: "inset(8% 0% 0% 0%)" }}
                            whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
                            transition={{ duration: 0.78, delay: 0.16, ease: EASE }}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute -left-px top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/55 to-transparent lg:block"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <div className="space-y-1">
                                    <Input
                                        placeholder="Nombre Completo"
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-body"
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
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-body"
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
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-body"
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
                                        className="w-full bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-3 text-body"
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
                                    className="text-body text-white/65 leading-relaxed cursor-pointer"
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
                                    className="brushed-gold premium-cta w-full sm:w-auto inline-flex items-center justify-center gap-2 hover:scale-[1.015] transition-all duration-300 min-h-[48px]"
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
                        </motion.form>
                    </div>
                ) : (
                    <motion.div
                        className="text-center max-w-xl mx-auto py-12"
                        role="status"
                        aria-live="polite"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.56, ease: EASE }}
                    >
                        <div className="gold-gradient mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-[var(--color-accent)]/40">
                            <CheckCircle2 className="w-10 h-10 text-black" aria-hidden="true" />
                        </div>
                        <h3 className="text-display-3 text-white mb-4">
                            {config.successTitle}
                        </h3>
                        <p className="text-body text-white/65 leading-relaxed">
                            {config.successMessage}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
