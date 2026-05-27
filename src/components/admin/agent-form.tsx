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
            const { id, ...rest } = initialData;
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
            })} className="flex flex-col gap-8" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Nombre Completo *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Juan Pérez López" {...field} />
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
                                    <Input type="email" placeholder="correo@ejemplo.com" {...field} />
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
                                    <Input placeholder="+52 555 123 4567" {...field} />
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
                                    <Input placeholder="Ej. 12345678" {...field} />
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
                                    <Input placeholder="https://..." {...field} />
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
                                        className="data-[state=checked]:bg-gold-500 data-[state=checked]:text-black border-foreground/20"
                                    />
                                </FormControl>
                                <FormLabel className="cursor-pointer font-medium">Agente activo</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Biografía / Notas</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Breve descripción del agente..."
                                    className="h-24"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gold-500 text-black hover:bg-gold-600 font-bold"
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
