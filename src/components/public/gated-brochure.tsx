"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";

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
import { Download, Loader2, Lock } from "lucide-react";
import { leadSchema, LeadFormValues } from "@/lib/validations/lead";

interface GatedBrochureProps {
    propertyId: string;
    propertyName: string;
    pdfUrl?: string | null;
}

export function GatedBrochure({ propertyId, propertyName, pdfUrl }: GatedBrochureProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    // ── Background sync: flush pending leads when coming online ──
    useEffect(() => {
        const flushPendingLeads = async () => {
            const raw = localStorage.getItem("bgSync_leads");
            if (!raw) return;
            const pendingLeads = JSON.parse(raw) as LeadFormValues[];
            if (pendingLeads.length === 0) return;

            toast.info(`Sincronizando ${pendingLeads.length} solicitud(es) pendiente(s)...`);
            for (const lead of pendingLeads) {
                try {
                    await supabase.from("leads").insert([{ ...lead, downloaded_at: new Date().toISOString() }]);
                    await fetch("/api/send-brochure", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: lead.email, propertyId: lead.property_id, name: lead.full_name }),
                    });
                } catch (err) {
                    console.error("Error syncing offline lead:", err);
                }
            }
            localStorage.removeItem("bgSync_leads");
            toast.success("Solicitudes sincronizadas correctamente.");
        };

        window.addEventListener("online", flushPendingLeads);
        // Also flush on mount if already online
        if (navigator.onLine) flushPendingLeads();
        return () => window.removeEventListener("online", flushPendingLeads);
    }, [supabase]);

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
            notes: `Solicitó brochure de: ${propertyName}`,
        },
    });

    async function onSubmit(data: LeadFormValues) {
        setIsSubmitting(true);

        // Tracking funnel
        posthog.capture('lead_form_submitted', {
            property_id: propertyId,
            property_name: propertyName,
            source: data.source
        });

        if (!navigator.onLine) {
            // Guardar para sincronizar luego (Background Sync Simulation)
            const pendingLeads = JSON.parse(localStorage.getItem('bgSync_leads') || '[]');
            pendingLeads.push(data);
            localStorage.setItem('bgSync_leads', JSON.stringify(pendingLeads));

            toast.warning("Estás sin conexión. Tu solicitud ha sido guardada y se enviará en segundo plano cuando recuperes el internet.");
            setIsSuccess(true);
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Insert lead into Supabase
            const { error } = await supabase.from("leads").insert([{
                ...data,
                downloaded_at: new Date().toISOString(),
            }]);

            if (error) throw error;

            // 2. Success state
            setIsSuccess(true);
            toast.success("¡Hemos procesado tu solicitud con éxito!");

            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
            }

            // Mock Resend integraton call
            fetch('/api/send-brochure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, propertyId, name: data.full_name, pdfUrl })
            }).catch(console.error);

        } catch (error) {
            console.error("Error capturing lead:", error);
            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold mb-4 py-6 text-lg">
                    <Download className="mr-2 h-5 w-5" />
                    Descargar Brochure
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {!isSuccess ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center text-xl font-bold">
                                <Lock className="w-5 h-5 mr-2 text-gold-500" />
                                Contenido Exclusivo
                            </DialogTitle>
                            <DialogDescription>
                                Para descargar el brochure de <strong>{propertyName}</strong>, por favor compártenos tus datos. Te lo enviaremos a tu correo de inmediato.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                <FormField
                                    control={form.control}
                                    name="full_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu nombre" {...field} />
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
                                            <FormLabel>Correo electrónico</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="tucorreo@empresa.com" {...field} />
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
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="10 dígitos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="privacy_accepted"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    id="brochure-privacy"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-gold-500/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-0.5"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <label htmlFor="brochure-privacy" className="text-xs text-muted-foreground cursor-pointer">
                                                    Acepto el{" "}
                                                    <a href="/legal/privacidad" className="text-gold-500 hover:underline" target="_blank">
                                                        Aviso de Privacidad
                                                    </a>{" "}
                                                    y consiento el tratamiento de mis datos para prospección comercial.
                                                </label>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold mt-4">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                                    {isSubmitting ? "Procesando..." : "Enviar y Descargar PDF"}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Tus datos están protegidos por nuestra política de privacidad corporativa.
                                </p>
                            </form>
                        </Form>
                    </>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4">
                            <Download className="w-8 h-8 text-gold-500" />
                        </div>
                        <h3 className="text-2xl font-bold">Gracias — ¡Brochure Desbloqueado!</h3>
                        <p className="text-muted-foreground" role="status" aria-live="polite">
                            Gracias por tu interés. Hemos enviado el enlace de descarga oficial a tu correo electrónico. Además, iniciaremos la descarga directa en unos momentos guiados por nuestros protocolos de seguridad.
                        </p>
                        <Button variant="outline" className="mt-8" onClick={() => setOpen(false)}>
                            Cerrar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
