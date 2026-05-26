"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";
import { CONTACT_CONFIG } from "@/lib/contact-config";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Lock, CheckCircle2, Mail, Smartphone } from "lucide-react";
import { leadSchema, LeadFormValues } from "@/lib/validations/lead";

interface GatedBrochureProps {
    propertyId: string;
    propertyName: string;
    pdfUrl?: string | null;
    /** Label for the download button */
    label?: string;
    /** Document type for analytics */
    docType?: string;
}

export function GatedBrochure({
    propertyId,
    propertyName,
    pdfUrl,
    label = "Descargar Documento",
    docType = "brochure",
}: GatedBrochureProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            privacy_accepted: false,
            source: "organic",
            property_id: propertyId,
            status: "new",
            notes: `Solicito ${docType} de: ${propertyName}`,
        },
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            form.reset();
            setIsSuccess(false);
        }
    }, [open, form]);

    async function onSubmit(data: LeadFormValues) {
        setIsSubmitting(true);

        // Track funnel event
        posthog.capture("lead_form_submitted", {
            property_id: propertyId,
            property_name: propertyName,
            doc_type: docType,
            source: data.source,
        });

        // Strip non-numeric from phone for clean storage
        const cleanPhone = data.phone.replace(/[^0-9+]/g, "");

        try {
            // Insert lead into Supabase
            const { error } = await supabase.from("leads").insert([{
                ...data,
                phone: cleanPhone,
                downloaded_at: new Date().toISOString(),
            }]);

            if (error) throw error;

            // Send document via email (fire-and-forget, don't block UI)
            fetch("/api/send-brochure", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    propertyId,
                    name: data.full_name,
                    pdfUrl,
                    docType,
                }),
            }).catch((err) => console.error("Error sending brochure email:", err));

            setIsSuccess(true);
            toast.success("Documento enviado a tu correo");
        } catch (error) {
            console.error("Error capturing lead:", error);
            toast.error("Ocurrio un error. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-gold-500 text-black hover:bg-gold-400 font-semibold py-6 text-base rounded-xl shadow-lg shadow-gold-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/30 hover:-translate-y-0.5">
                    <Download className="mr-2 h-5 w-5" />
                    {label}
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[440px] !bg-card border-gold-500/10 shadow-2xl"
                showCloseButton={!isSuccess}
            >
                {!isSuccess ? (
                    <>
                        <DialogHeader className="text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                                    <Lock className="size-5 text-gold-500" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold">
                                        Documento Exclusivo
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Para acceder al documento de <strong className="text-foreground">{propertyName}</strong>,
                                        compartenos tus datos y te lo enviamos a tu correo.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-foreground/60">Nombre completo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tu nombre completo"
                                                    {...field}
                                                    className="bg-foreground/[0.04] border-foreground/10 h-11 rounded-xl focus:border-gold-500/50"
                                                    autoComplete="name"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-foreground/60">
                                                <Mail className="size-3 inline mr-1.5 -mt-0.5" />
                                                Correo electronico
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="tu@correo.com"
                                                    {...field}
                                                    className="bg-foreground/[0.04] border-foreground/10 h-11 rounded-xl focus:border-gold-500/50"
                                                    autoComplete="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-foreground/60">
                                                <Smartphone className="size-3 inline mr-1.5 -mt-0.5" />
                                                WhatsApp / Telefono
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder={CONTACT_CONFIG.phone}
                                                    {...field}
                                                    className="bg-foreground/[0.04] border-foreground/10 h-11 rounded-xl focus:border-gold-500/50"
                                                    autoComplete="tel"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="privacy_accepted"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start gap-3 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    id="brochure-privacy"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-gold-500/30 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-0.5 rounded"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-tight">
                                                <label htmlFor="brochure-privacy" className="text-xs text-foreground/50 cursor-pointer leading-relaxed">
                                                    Acepto el{" "}
                                                    <a href="/legal/privacidad" className="text-gold-500 hover:underline font-medium" target="_blank">
                                                        Aviso de Privacidad
                                                    </a>
                                                    {" "}y autorizo que me contacten para prospeccion comercial.
                                                </label>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gold-500 text-black hover:bg-gold-400 font-semibold py-5 rounded-xl mt-2 transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Enviar documento a mi correo
                                        </>
                                    )}
                                </Button>
                                <p className="text-[11px] text-center text-foreground/30 pt-1">
                                    Tus datos estan protegidos. No compartimos tu informacion con terceros.
                                </p>
                            </form>
                        </Form>
                    </>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                        <div className="size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                            <CheckCircle2 className="size-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Documento Enviado
                        </h3>
                        <p className="text-sm text-foreground/50 max-w-xs leading-relaxed mb-6">
                            El documento ha sido enviado a tu correo electronico.
                            Revisa tu bandeja de entrada (y spam) en los proximos minutos.
                        </p>
                        <Button
                            variant="outline"
                            className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 rounded-xl"
                            onClick={() => setOpen(false)}
                        >
                            Cerrar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
