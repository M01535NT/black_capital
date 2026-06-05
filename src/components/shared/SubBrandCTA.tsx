/**
 * SubBrandCTA — gated-access lead-capture panel for the 3 sub-brand
 * landings.
 *
 * Replaces:
 *   - src/components/luxury/LuxuryCTA.tsx
 *   - src/components/business/BusinessCTA.tsx
 *   - src/components/industrial/IndustrialCTA.tsx
 *
 * The 3 originals were ~90% duplicated. The per-brand visual chrome
 * (glass panel for luxury/business, steel + corner accents for industrial)
 * and content (eyebrow, copy, submit label, success message) are now
 * driven by a single `config` object.
 *
 * The old component names are preserved via thin re-exports in the
 * per-brand folders so no import path has to change elsewhere.
 *
 * Design rules:
 *   - form input chrome is brand-driven (gold for luxury/business,
 *     steel for industrial)
 *   - submit button is always gold-500 (CTA color is constant)
 *   - "steel" panel chrome replaces the "glass" utility with explicit
 *     bg-background/80 + corner accent borders
 *   - success state is wrapped in role="status" + aria-live="polite"
 *     so screen readers announce it
 *   - the privacy checkbox uses a stable id and is wired to a labelled
 *     error region when validation fails
 */

"use client";

import { useState } from "react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FadeIn } from "@/components/ui/motion";
import { Loader2, CheckCircle2, Download, Lock } from "lucide-react";

export type SubBrand = "luxury" | "business" | "industrial";
export type Accent = "gold" | "steel";

export interface SubBrandCTAConfig {
    brand: SubBrand;
    /** Visual chrome. "luxury" = glass panel, gold borders. "industrial" = steel + corner accents. */
    panel: "luxury" | "industrial";
    /** Lead source string for analytics + DB. */
    source: string;
    /** Prefix for the `notes` field. */
    notesPrefix: string;
    /** Whether the notes should always include the company (industrial) or only if present. */
    notesFormat: "optional" | "always";

    /** id on the wrapping <section> so the SubBrandHero's secondary CTA can link to it. */
    sectionId?: string;
    /** Override default py. */
    py?: string;

    /* ── Header content ───────────────────────────────────────────── */
    eyebrowIcon: "lock" | "download";
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    /** "Respuesta en menos de 24h" pill (luxury/business). */
    indicator?: string;
    /** Tag chips (industrial only). */
    tags?: string[];

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

const PRIVACY_HREF = "/legal/privacidad";

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

    /* ── Visual chrome ───────────────────────────────────────────── */
    const isIndustrial = config.panel === "industrial";
    const isLuxury = config.panel === "luxury";

    const topBorderClass = isIndustrial
        ? "via-steel-500/30"
        : "via-gold-500/30";
    const bottomBorderClass = isIndustrial
        ? "via-gold-500/30"
        : "via-gold-500/20";

    const inputChrome = isIndustrial
        ? "bg-black/50 border-steel-500/20 focus-visible:ring-gold-500 rounded-none"
        : "bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl";
    const submitChrome = isIndustrial
        ? "w-full bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase mt-4 rounded-none"
        : "w-full bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase mt-4 rounded-full";
    const checkboxChrome = isIndustrial
        ? "border-steel-500/30 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
        : "border-gold-500/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1";

    return (
        <section
            id={config.sectionId}
            aria-label={`Solicitud de acceso ${config.brand}`}
            className={`w-full ${config.py ?? "py-28"} bg-background relative overflow-hidden`}
        >
            {/* Decorative borders */}
            <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${topBorderClass} to-transparent`}
                aria-hidden="true"
            />
            <div
                className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent ${bottomBorderClass} to-transparent`}
                aria-hidden="true"
            />

            {/* Floating glow (luxury/business only) */}
            {isLuxury && (
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/[0.03] blur-[150px] pointer-events-none"
                    aria-hidden="true"
                />
            )}

            <div className="container mx-auto px-4">
                <FadeIn direction="up" delay={0.1}>
                    <div
                        className={
                            isIndustrial
                                ? "max-w-5xl mx-auto bg-background/80 backdrop-blur-sm border border-steel-500/20 p-8 md:p-12 relative overflow-hidden"
                                : "max-w-5xl mx-auto glass rounded-3xl p-8 md:p-14 relative overflow-hidden border border-gold-500/15"
                        }
                    >
                        {/* Inner glows (luxury/business) */}
                        {isLuxury && (
                            <>
                                <div
                                    className="absolute top-0 right-0 w-96 h-96 bg-gold-500/[0.05] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                    aria-hidden="true"
                                />
                                <div
                                    className="absolute bottom-0 left-0 w-72 h-72 bg-gold-600/[0.05] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
                                    aria-hidden="true"
                                />
                            </>
                        )}

                        {/* Corner accents (industrial) */}
                        {isIndustrial && (
                            <>
                                <div
                                    className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30"
                                    aria-hidden="true"
                                />
                                <div
                                    className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/30"
                                    aria-hidden="true"
                                />
                                <div
                                    className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/30"
                                    aria-hidden="true"
                                />
                                <div
                                    className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30"
                                    aria-hidden="true"
                                />
                                <div
                                    className="absolute top-0 right-0 w-96 h-96 bg-steel-500/[0.05] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                    aria-hidden="true"
                                />
                            </>
                        )}

                        {!isSuccess ? (
                            <div
                                className={`flex flex-col md:flex-row relative z-10 ${
                                    isIndustrial ? "gap-12" : "gap-14"
                                }`}
                            >
                                {/* Left Copy */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        {config.eyebrowIcon === "lock" ? (
                                            <Lock
                                                className="w-4 h-4 text-gold-500"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Download
                                                className="w-5 h-5 text-gold-500"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
                                            {config.eyebrow}
                                        </span>
                                    </div>

                                    <h2 className="text-display-3 font-display font-semibold tracking-display uppercase text-3xl md:text-4xl text-foreground">
                                        {config.title}
                                        <br />
                                        <span className="metallic-gold">
                                            {config.titleHighlight}
                                        </span>
                                    </h2>

                                    <p
                                        className={`text-body-lg max-w-md leading-relaxed ${
                                            isIndustrial
                                                ? "text-foreground/50"
                                                : "text-foreground/50"
                                        }`}
                                    >
                                        {config.description}
                                    </p>

                                    {config.indicator && (
                                        <div className="flex items-center gap-3 pt-2 text-foreground/50 text-xs uppercase tracking-widest">
                                            <div
                                                className="w-2 h-2 rounded-full bg-gold-500/50"
                                                aria-hidden="true"
                                            />
                                            {config.indicator}
                                        </div>
                                    )}

                                    {config.tags && config.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            {config.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 border border-steel-500/20 text-xs font-bold uppercase tracking-widest text-steel-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right Form */}
                                <div className="flex-1">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-4"
                                        noValidate
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Input
                                                    placeholder="Nombre Completo"
                                                    className={inputChrome}
                                                    aria-invalid={
                                                        hasErr("fullName") ||
                                                        undefined
                                                    }
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
                                                    className={inputChrome}
                                                    aria-invalid={
                                                        hasErr("company") ||
                                                        undefined
                                                    }
                                                    {...register("company")}
                                                />
                                                {errors.company && (
                                                    <p className="text-xs text-red-400">
                                                        {errors.company.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Input
                                                    type="email"
                                                    placeholder={config.emailPlaceholder}
                                                    className={inputChrome}
                                                    aria-invalid={
                                                        hasErr("email") ||
                                                        undefined
                                                    }
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
                                                    className={inputChrome}
                                                    aria-invalid={
                                                        hasErr("phone") ||
                                                        undefined
                                                    }
                                                    {...register("phone")}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 pt-2">
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
                                                aria-invalid={
                                                    hasErr("privacy") ||
                                                    undefined
                                                }
                                                aria-describedby={
                                                    hasErr("privacy")
                                                        ? errPrivacyId
                                                        : undefined
                                                }
                                                className={checkboxChrome}
                                            />
                                            <label
                                                htmlFor={privacyId}
                                                className="text-body text-foreground/60 leading-tight cursor-pointer"
                                            >
                                                Acepto el{" "}
                                                <a
                                                    href={PRIVACY_HREF}
                                                    className="text-gold-500 hover:underline"
                                                >
                                                    Aviso de Privacidad
                                                </a>{" "}
                                                y consiento el tratamiento de
                                                mis datos para prospección
                                                comercial.
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

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={submitChrome}
                                        >
                                            {isSubmitting ? (
                                                <Loader2
                                                    className="mr-2 h-4 w-4 animate-spin"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            {isSubmitting
                                                ? "Procesando..."
                                                : config.submitLabel}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`relative z-10 flex flex-col items-center justify-center text-center space-y-4 ${
                                    isIndustrial ? "py-12" : "py-16"
                                }`}
                                role="status"
                                aria-live="polite"
                            >
                                <div
                                    className={`flex items-center justify-center mb-4 ${
                                        isIndustrial
                                            ? "w-16 h-16 bg-gold-500/20"
                                            : "w-20 h-20 rounded-full bg-gold-500/15"
                                    }`}
                                >
                                    <CheckCircle2
                                        className={`text-gold-500 ${
                                            isIndustrial
                                                ? "w-8 h-8"
                                                : "w-10 h-10"
                                        }`}
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3
                                    className={`text-2xl font-bold text-foreground ${
                                        isIndustrial
                                            ? "uppercase tracking-wider"
                                            : ""
                                    }`}
                                >
                                    {config.successTitle}
                                </h3>
                                <p
                                    className={`max-w-md ${
                                        isIndustrial
                                            ? "text-foreground/50"
                                            : "text-foreground/50"
                                    }`}
                                >
                                    {config.successMessage}
                                </p>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
