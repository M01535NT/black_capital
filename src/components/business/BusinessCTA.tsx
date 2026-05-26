"use client";

import { useState } from "react";
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
import { Loader2, CheckCircle2, Lock } from "lucide-react";

const ctaSchema = z.object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    company: z.string().optional(),
    email: z
        .string()
        .email("Debe ser un correo electrónico válido")
        .refine(
            (val) =>
                !/(tempmail|mailinator|guerrilla|yopmail|throwaway|10minute|trashmail)/i.test(
                    val
                ),
            { message: "Por favor, utiliza un correo corporativo o personal real" }
        ),
    phone: z.string().optional(),
    privacy: z
        .boolean()
        .refine((val) => val === true, {
            message: "Debes aceptar el aviso de privacidad",
        }),
});

type CTAFormValues = z.infer<typeof ctaSchema>;

export function BusinessCTA() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CTAFormValues>({
        resolver: zodResolver(ctaSchema),
        defaultValues: {
            fullName: "",
            company: "",
            email: "",
            phone: "",
            privacy: false,
        },
    });

    const privacyValue = watch("privacy");

    async function onSubmit(data: CTAFormValues) {
        setIsSubmitting(true);

        posthog.capture("lead_magnet_submitted", {
            source: "landing_business",
            has_company: !!data.company,
        });

        try {
            const { error } = await supabase.from("leads").insert([
                {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone || null,
                    privacy_accepted: true,
                    source: "landing_business",
                    status: "new",
                    notes: data.company
                        ? `Business Landing — Empresa: ${data.company}`
                        : "Business Landing",
                },
            ]);

            if (error) throw error;

            setIsSuccess(true);
            toast.success("¡Solicitud enviada con éxito!");
        } catch (error) {
            console.error("Error capturing lead:", error);
            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="business-cta" className="w-full py-28 bg-background relative overflow-hidden">
            {/* Decorative borders */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

            {/* Floating glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/3 blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4">
                <FadeIn direction="up" delay={0.1}>
                    <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-14 relative overflow-hidden border border-gold-500/15">
                        {/* Inner glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {!isSuccess ? (
                            <div className="flex flex-col md:flex-row gap-14 relative z-10">
                                {/* Left Copy */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-4 h-4 text-gold-500" />
                                        <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
                                            Asesoría Corporativa
                                        </span>
                                    </div>

                                    <h2 className="section-heading text-3xl md:text-4xl text-white">
                                        Encuentra el Espacio
                                        <br />
                                        <span className="metallic-gold">Ideal para tu Empresa</span>
                                    </h2>

                                    <p className="text-white/45 text-base max-w-md leading-relaxed">
                                        Análisis de mercado corporativo, proyecciones de rendimiento
                                        y asesoría personalizada para optimizar tu operación inmobiliaria
                                        comercial.
                                    </p>

                                    <div className="flex items-center gap-3 pt-2 text-foreground/30 text-xs uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-gold-500/50" />
                                        Respuesta en menos de 24h
                                    </div>
                                </div>

                                {/* Right Form */}
                                <div className="flex-1">
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Input
                                                    placeholder="Nombre Completo"
                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
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
                                                    placeholder="Empresa"
                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
                                                    {...register("company")}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Input
                                                    type="email"
                                                    placeholder="Correo Electrónico"
                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
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
                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
                                                    {...register("phone")}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 pt-2">
                                            <Checkbox
                                                id="business-privacy"
                                                checked={privacyValue}
                                                onCheckedChange={(checked) =>
                                                    setValue("privacy", checked === true, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                className="border-gold-500/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
                                            />
                                            <label
                                                htmlFor="business-privacy"
                                                className="text-sm text-white/40 leading-tight cursor-pointer"
                                            >
                                                Acepto el{" "}
                                                <a
                                                    href="/legal/privacidad"
                                                    className="text-gold-500 hover:underline"
                                                >
                                                    Aviso de Privacidad
                                                </a>{" "}
                                                y consiento el tratamiento de mis datos para
                                                prospección comercial.
                                            </label>
                                        </div>
                                        {errors.privacy && (
                                            <p className="text-xs text-red-400">
                                                {errors.privacy.message}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase mt-4 rounded-full"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : null}
                                            {isSubmitting
                                                ? "Procesando..."
                                                : "Solicitar Asesoría Comercial"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10 py-16 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-gold-500/15 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-gold-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">
                                    ¡Solicitud Recibida!
                                </h3>
                                <p className="text-white/50 max-w-md">
                                    Tu solicitud ha sido registrada. Nuestro equipo de asesoría
                                    corporativa se pondrá en contacto contigo en las próximas
                                    24 horas con opciones personalizadas.
                                </p>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
