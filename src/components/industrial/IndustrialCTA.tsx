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
import { Loader2, CheckCircle2, Download } from "lucide-react";

const ctaSchema = z.object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    company: z.string().min(1, "Empresa requerida para solicitudes industriales"),
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

export function IndustrialCTA() {
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
            source: "landing_industrial",
            has_company: !!data.company,
        });

        try {
            const { error } = await supabase.from("leads").insert([
                {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone || null,
                    privacy_accepted: true,
                    source: "landing_industrial",
                    status: "new",
                    notes: `Industrial Landing — Empresa: ${data.company}`,
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
        <section className="w-full py-24 bg-background relative overflow-hidden">
            {/* Decorative borders */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-500/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

            <div className="container mx-auto px-4">
                <FadeIn direction="up" delay={0.1}>
                    <div className="max-w-5xl mx-auto bg-zinc-950/80 backdrop-blur-sm border border-steel-500/20 p-8 md:p-12 relative overflow-hidden">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/30" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/30" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30" />

                        {/* Subtle Glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-steel-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        {!isSuccess ? (
                            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                                {/* Left Copy */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-5 h-5 text-gold-500" />
                                        <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
                                            Portafolio Industrial
                                        </span>
                                    </div>

                                    <h2 className="section-heading text-3xl md:text-4xl text-white">
                                        Recibe Nuestro Portafolio
                                        <br />
                                        <span className="metallic-gold">Industrial Actualizado</span>
                                    </h2>

                                    <p className="text-white/50 text-base max-w-md leading-relaxed">
                                        Análisis financiero con cap rates, ocupación histórica,
                                        benchmarks de mercado y proyecciones de rendimiento
                                        para cada activo industrial disponible.
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {["Cap Rates", "Benchmarks", "Proyecciones"].map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 border border-steel-500/20 text-xs font-bold uppercase tracking-widest text-steel-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
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
                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
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
                                                    placeholder="Empresa *"
                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
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
                                                    placeholder="Correo Corporativo"
                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
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
                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
                                                    {...register("phone")}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 pt-2">
                                            <Checkbox
                                                id="industrial-privacy"
                                                checked={privacyValue}
                                                onCheckedChange={(checked) =>
                                                    setValue("privacy", checked === true, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                className="border-steel-500/30 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
                                            />
                                            <label
                                                htmlFor="industrial-privacy"
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
                                            className="w-full bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase mt-4 rounded-none"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : null}
                                            {isSubmitting
                                                ? "Procesando..."
                                                : "Solicitar Portafolio Industrial"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10 py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-gold-500/20 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-gold-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                                    Solicitud Registrada
                                </h3>
                                <p className="text-white/50 max-w-md">
                                    Nuestro equipo de inversiones industriales se pondrá en
                                    contacto contigo en las próximas 24 horas con el portafolio
                                    actualizado y análisis financiero correspondiente.
                                </p>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
