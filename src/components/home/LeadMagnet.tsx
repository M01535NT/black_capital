"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FadeIn } from "@/components/ui/motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { leadSchema, LeadFormValues } from "@/lib/validations/lead";

export function LeadMagnet() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
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
            console.error("Error capturing lead:", error);
            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="w-full py-24 bg-background relative overflow-hidden">
            {/* Decorative Gold Border Top/Bottom */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

            <div className="container mx-auto px-4">
                <FadeIn direction="up" delay={0.1}>
                    <div className="max-w-5xl mx-auto bg-zinc-950/80 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8 md:p-12 shadow-2xl shadow-gold-500/5 relative overflow-hidden">
                        {/* Subtle Glow inside the card */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {!isSuccess ? (
                            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                                {/* Left Copy */}
                                <div className="flex-1 space-y-6">
                                    <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
                                        Acceso Privilegiado
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                                        Únete al Directorio de Inversores
                                    </h2>
                                    <p className="text-white/70 text-lg max-w-md">
                                        Recibe análisis de mercado exclusivos, proyecciones financieras estructuradas y acceso a inventario Off-Market antes de su publicación general.
                                    </p>
                                </div>

                                {/* Right Form */}
                                <div className="flex-1">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                        <Input
                                                            placeholder="Nombre Completo"
                                                            className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
                                                            {...register("full_name")}
                                                        />
                                                        {errors.full_name && (
                                                            <p className="text-xs text-red-400">{errors.full_name.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Input
                                                            placeholder="Empresa o Fondo"
                                                            className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
                                                            value={company}
                                                            onChange={(e) => setCompany(e.target.value)}
                                                        />
                                                    </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Input
                                                    type="email"
                                                    placeholder="Correo Corporativo"
                                                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
                                                    {...register("email")}
                                                />
                                                {errors.email && (
                                                    <p className="text-xs text-red-400">{errors.email.message}</p>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <Input
                                                    type="tel"
                                                    placeholder="Teléfono (Opcional)"
                                                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
                                                    {...register("phone")}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 pt-2">
                                            <Checkbox
                                                id="privacy"
                                                checked={privacyValue}
                                                onCheckedChange={(checked) =>
                                                    setValue("privacy_accepted", checked === true, { shouldValidate: true })
                                                }
                                                className="border-white/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
                                            />
                                            <label
                                                htmlFor="privacy"
                                                className="text-sm text-white/60 leading-tight cursor-pointer"
                                            >
                                                Acepto el{" "}
                                                <a href="/legal/privacidad" className="text-gold-500 hover:underline">
                                                    Aviso de Privacidad
                                                </a>{" "}
                                                y consiento el tratamiento de mis datos para prospección comercial.
                                            </label>
                                        </div>
                                        {errors.privacy && (
                                            <p className="text-xs text-red-400">{errors.privacy.message}</p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold tracking-widest uppercase mt-4"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : null}
                                            {isSubmitting ? "Procesando..." : "Solicitar Acceso"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10 py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-gold-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">
                                    ¡Gracias por tu interés!
                                </h3>
                                <p className="text-white/70 max-w-md">
                                    Tu solicitud ha sido registrada exitosamente. Nuestro equipo de inversiones se pondrá en contacto contigo en las próximas 24 horas con acceso a nuestro directorio exclusivo.
                                </p>
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
