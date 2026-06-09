"use client";

import { useRef, useState } from "react";
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
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface AgentFormProps {
    initialData?: AgentFormValues & { id?: string };
}

export function AgentForm({ initialData }: AgentFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const photoInputRef = useRef<HTMLInputElement | null>(null);

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
                role: "agent",
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

    async function handlePhotoUpload(file: File | undefined) {
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("La foto debe estar en formato JPG, PNG o WEBP");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("La foto no puede pesar más de 10 MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", "agent-profile");
        formData.append("bucket", "public");

        setIsUploadingPhoto(true);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "No se pudo subir la foto");
            }

            form.setValue("photo_url", result.url, { shouldDirty: true, shouldValidate: true });
            toast.success("Foto de perfil cargada");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al subir foto");
        } finally {
            setIsUploadingPhoto(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
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
                        Datos del agente
                    </p>
                    <p className="mt-2 text-sm text-white/55">
                        Al registrar al integrante se enviará una invitación para configurar su contraseña y entrar al panel.
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
                                <FormLabel>Correo Electrónico *</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" type="email" placeholder="correo@ejemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!initialData?.id && (
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol interno *</FormLabel>
                                    <FormControl>
                                        <select
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="h-10 w-full border border-white/[0.12] bg-background/70 px-3 text-sm text-white"
                                        >
                                            <option value="agent">Agente</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

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
                            <FormItem className="md:col-span-2">
                                <FormLabel>Foto de perfil</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-4 border border-white/[0.08] bg-background/45 p-4 sm:flex-row sm:items-center">
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-white/[0.12] bg-white/[0.03]">
                                            {field.value ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={field.value}
                                                    alt="Vista previa de foto de perfil"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImagePlus className="h-7 w-7 text-white/35" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-white">
                                                Sube una foto desde la galería del equipo
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-white/50">
                                                Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo: 10 MB.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                <input
                                                    ref={photoInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                    onChange={(event) => handlePhotoUpload(event.target.files?.[0])}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={isUploadingPhoto}
                                                    onClick={() => photoInputRef.current?.click()}
                                                    className="rounded-full border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                                                >
                                                    {isUploadingPhoto ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Subiendo...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ImagePlus className="mr-2 h-4 w-4" />
                                                            Elegir foto
                                                        </>
                                                    )}
                                                </Button>
                                                {field.value ? (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => form.setValue("photo_url", "", { shouldDirty: true, shouldValidate: true })}
                                                        className="rounded-full text-white/60 hover:bg-white/[0.06] hover:text-white"
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Quitar foto
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
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
