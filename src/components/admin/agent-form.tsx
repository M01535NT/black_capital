"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentSchema, AgentFormValues } from "@/lib/validations/agent";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AgentFormProps {
    initialData?: AgentFormValues & { id?: string };
}

export function AgentForm({ initialData }: AgentFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AgentFormValues>({
        resolver: zodResolver(agentSchema),
        defaultValues: (() => {
            if (!initialData) return {
                full_name: "",
                email: "",
                phone: "",
                photo_url: "",
                license_number: "",
                bio: "",
                is_active: true,
            };
            const { id: _id, ...rest } = initialData;
            void _id;
            return rest;
        })(),
    });

    async function onSubmit(data: AgentFormValues) {
        setIsSubmitting(true);
        try {
            const isEditing = !!initialData?.id;
            const method = isEditing ? "PUT" : "POST";
            const body = isEditing ? { id: initialData.id, ...data } : data;

            const res = await fetch("/api/agents", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Error al guardar agente");
            }

            toast.success(isEditing ? "Agente actualizado" : "Agente registrado");
            router.push("/admin/agents");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, () => {
                const firstError = document.querySelector('[aria-invalid="true"]');
                if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            })} className="border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6" noValidate>
                <div className="mb-6 border-b border-white/[0.06] pb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                        Datos del asesor
                    </p>
                    <p className="mt-2 text-sm text-white/55">
                        Información visible para asignaciones internas y contacto comercial.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Nombre Completo *</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="Ej. Juan Pérez López" {...field} />
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
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" type="email" placeholder="correo@ejemplo.com" {...field} />
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
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="+52 555 123 4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="license_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cédula Profesional</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="Ej. 12345678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="photo_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL de Foto</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3 space-y-0 pt-6">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-white/20 data-[state=checked]:bg-[var(--color-accent)] data-[state=checked]:text-black"
                                    />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-medium">Agente activo</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mt-6">
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Biografía / Notas</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Breve descripción del agente..."
                                    className="h-24 border-white/[0.1] bg-background/70 text-white"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

                <div className="mt-6 flex gap-4 border-t border-white/[0.06] pt-5">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="brushed-gold rounded-full px-6 font-bold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            initialData?.id ? "Guardar Cambios" : "Registrar Agente"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
