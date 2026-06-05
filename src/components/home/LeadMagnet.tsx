"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FadeIn } from "@/components/ui/motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { leadSchema, LeadFormValues } from "@/lib/validations/lead";

/* ── Field-error renderer (a11y-friendly) ─────────────────────────── */

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p
            id={id}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5"
        >
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            <span>{message}</span>
        </p>
    );
}

export function LeadMagnet() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        // Validate on blur (after the user leaves the field) and re-validate
        // on every keystroke. Standard pattern for inline error feedback
        // without yelling at the user mid-type.
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            privacy_accepted: false,
            source: "organic",
            status: "new",
            notes: "",
        },
    });

    const privacyValue = watch("privacy_accepted");
    const [company, setCompany] = useState("");

    // Stable ids for aria-describedby wiring.
    const errNameId = useId();
    const errEmailId = useId();
    const errPhoneId = useId();
    const errPrivacyId = useId();

    async function onSubmit(data: LeadFormValues) {
        setIsSubmitting(true);

        posthog.capture("lead_magnet_submitted", {
            source: "homepage_cta",
            has_company: !!company,
        });

        try {
            const notes = company
                ? `Lead Magnet Homepage — Empresa: ${company}`
                : "Lead Magnet Homepage";

            const { error } = await supabase.from("leads").insert([
                {
                    full_name: data.full_name,
                    email: data.email,
                    phone: data.phone || null,
                    privacy_accepted: true,
                    source: "organic",
                    status: "new",
                    notes,
                },
            ]);

            if (error) throw error;

            setIsSuccess(true);
            toast.success("¡Solicitud enviada con éxito!");
        } catch (error) {
            console.error("[LeadMagnet] submit failed", error);
            toast.error(
                "Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    // Helper to know if a field has a current error (for the input's
    // own aria-invalid + ring styling).
    const hasErr = (name: keyof LeadFormValues) => !!errors[name];

    return (
        <section
            className="w-full py-24 bg-background relative overflow-hidden"
            aria-labelledby="leadmagnet-title"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

            <div className="container mx-auto px-4">
                <FadeIn direction="up" delay={0.1}>
                    <div className="max-w-5xl mx-auto bg-zinc-950/80 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8 md:p-12 shadow-2xl shadow-gold-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/[0.08] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/[0.05] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {!isSuccess ? (
                            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                                {/* Left Copy */}
                                <div className="flex-1 space-y-6">
                                    <span className="font-display text-caption font-bold uppercase tracking-eyebrow text-gold-solid">
                                        Directorio de Inversores · Q3 2026
                                    </span>
                                    <h2
                                        id="leadmagnet-title"
                                        className="text-display-3 text-foreground"
                                    >
                                        Únete al Directorio de Inversores
                                    </h2>
                                    <p className="text-body-xl text-foreground/70 max-w-md">
                                        Recibe análisis de mercado exclusivos,
                                        proyecciones financieras estructuradas y
                                        acceso a inventario Off-Market antes de
                                        su publicación general.
                                    </p>
                                    <ul className="space-y-2 text-body-sm text-foreground/55 pt-2">
                                        <li className="flex items-start gap-2">
                                            <span
                                                className="mt-1.5 w-1 h-1 rounded-full bg-gold-solid flex-shrink-0"
                                                aria-hidden="true"
                                            />
                                            Reportes trimestrales de mercado
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span
                                                className="mt-1.5 w-1 h-1 rounded-full bg-gold-solid flex-shrink-0"
                                                aria-hidden="true"
                                            />
                                            Alertas Off-Market con 48h de
                                            anticipación
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span
                                                className="mt-1.5 w-1 h-1 rounded-full bg-gold-solid flex-shrink-0"
                                                aria-hidden="true"
                                            />
                                            Acceso a modelo financiero por
                                            activo
                                        </li>
                                    </ul>
                                </div>

                                {/* Right Form */}
                                <div className="flex-1">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-4"
                                        noValidate
                                        aria-describedby="form-status"
                                    >
                                        <p
                                            id="form-status"
                                            className="sr-only"
                                            aria-live="polite"
                                        >
                                            {isSubmitting
                                                ? "Enviando solicitud"
                                                : isSubmitSuccessful
                                                ? "Solicitud enviada"
                                                : ""}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="full_name"
                                                    className="block text-caption uppercase tracking-overline text-foreground/55 mb-1.5 font-sans font-semibold"
                                                >
                                                    Nombre Completo
                                                </label>
                                                <Input
                                                    id="full_name"
                                                    placeholder="Tu nombre"
                                                    autoComplete="name"
                                                    aria-invalid={
                                                        hasErr("full_name") ||
                                                        undefined
                                                    }
                                                    aria-describedby={
                                                        hasErr("full_name")
                                                            ? errNameId
                                                            : undefined
                                                    }
                                                    className={`bg-black/50 border-white/10 text-foreground placeholder:text-foreground/40 focus-visible:ring-gold-500 ${
                                                        hasErr("full_name")
                                                            ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                            : ""
                                                    }`}
                                                    {...register("full_name")}
                                                />
                                                <FieldError
                                                    id={errNameId}
                                                    message={
                                                        errors.full_name?.message
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="company"
                                                    className="block text-caption uppercase tracking-overline text-foreground/55 mb-1.5 font-sans font-semibold"
                                                >
                                                    Empresa o Fondo{" "}
                                                    <span className="text-foreground/30 normal-case">
                                                        · opcional
                                                    </span>
                                                </label>
                                                <Input
                                                    id="company"
                                                    placeholder="Para inversores institucionales"
                                                    autoComplete="organization"
                                                    className="bg-black/50 border-white/10 text-foreground placeholder:text-foreground/40 focus-visible:ring-gold-500"
                                                    value={company}
                                                    onChange={(e) =>
                                                        setCompany(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block text-caption uppercase tracking-overline text-foreground/55 mb-1.5 font-sans font-semibold"
                                                >
                                                    Correo Corporativo
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="nombre@empresa.com"
                                                    autoComplete="email"
                                                    aria-invalid={
                                                        hasErr("email") ||
                                                        undefined
                                                    }
                                                    aria-describedby={
                                                        hasErr("email")
                                                            ? errEmailId
                                                            : undefined
                                                    }
                                                    className={`bg-black/50 border-white/10 text-foreground placeholder:text-foreground/40 focus-visible:ring-gold-500 ${
                                                        hasErr("email")
                                                            ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                            : ""
                                                    }`}
                                                    {...register("email")}
                                                />
                                                <FieldError
                                                    id={errEmailId}
                                                    message={
                                                        errors.email?.message
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="phone"
                                                    className="block text-caption uppercase tracking-overline text-foreground/55 mb-1.5 font-sans font-semibold"
                                                >
                                                    Teléfono{" "}
                                                    <span className="text-foreground/30 normal-case">
                                                        · opcional
                                                    </span>
                                                </label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="Te contactamos por WhatsApp"
                                                    autoComplete="tel"
                                                    aria-invalid={
                                                        hasErr("phone") ||
                                                        undefined
                                                    }
                                                    aria-describedby={
                                                        hasErr("phone")
                                                            ? errPhoneId
                                                            : undefined
                                                    }
                                                    className={`bg-black/50 border-white/10 text-foreground placeholder:text-foreground/40 focus-visible:ring-gold-500 ${
                                                        hasErr("phone")
                                                            ? "border-red-500/60 focus-visible:ring-red-500/40"
                                                            : ""
                                                    }`}
                                                    {...register("phone")}
                                                />
                                                <FieldError
                                                    id={errPhoneId}
                                                    message={
                                                        errors.phone?.message
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1 pt-1">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox
                                                    id="privacy"
                                                    checked={privacyValue}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setValue(
                                                            "privacy_accepted",
                                                            checked === true,
                                                            {
                                                                shouldValidate:
                                                                    true,
                                                            },
                                                        )
                                                    }
                                                    aria-invalid={
                                                        hasErr(
                                                            "privacy_accepted",
                                                        ) || undefined
                                                    }
                                                    aria-describedby={
                                                        hasErr("privacy_accepted")
                                                            ? errPrivacyId
                                                            : undefined
                                                    }
                                                    className="border-white/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
                                                />
                                                <label
                                                    htmlFor="privacy"
                                                    className="text-body text-foreground/60 leading-tight cursor-pointer"
                                                >
                                                    Acepto el{" "}
                                                    <a
                                                        href="/legal/privacidad"
                                                        className="text-gold-500 hover:underline"
                                                    >
                                                        Aviso de Privacidad
                                                    </a>{" "}
                                                    y consiento el tratamiento
                                                    de mis datos para
                                                    prospección comercial.
                                                </label>
                                            </div>
                                            <div className="pl-9">
                                                <FieldError
                                                    id={errPrivacyId}
                                                    message={
                                                        errors.privacy_accepted
                                                            ?.message
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold tracking-eyebrow uppercase mt-4"
                                        >
                                            {isSubmitting ? (
                                                <Loader2
                                                    className="mr-2 h-4 w-4 animate-spin"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            {isSubmitting
                                                ? "Procesando..."
                                                : "Solicitar Acceso"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="relative z-10 py-12 flex flex-col items-center justify-center text-center space-y-4"
                                role="status"
                                aria-live="polite"
                            >
                                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2
                                        className="w-8 h-8 text-gold-500"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="text-display-4 text-foreground">
                                    ¡Gracias por tu interés!
                                </h3>
                                <p className="text-body-lg text-foreground/70 max-w-md">
                                    Tu solicitud ha sido registrada
                                    exitosamente. Nuestro equipo de inversiones
                                    se pondrá en contacto contigo en las
                                    próximas 24 horas con acceso a nuestro
                                    directorio exclusivo.
                                </p>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
