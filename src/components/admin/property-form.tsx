"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { propertySchema, PropertyFormValues } from "@/lib/validations/property";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, ImageIcon, Loader2, MapPin, Settings2, Star, UploadCloud, UserRoundCheck, X } from "lucide-react";
import { AgentSelect } from "./agent-select";
import { adminCardClass } from "./admin-ui";

interface PdfEntry {
    file: File;
    label: string;
}

function FormSection({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className={`${adminCardClass} p-5 sm:p-6`}>
            <div className="mb-5 flex min-w-0 items-start gap-3 border-b border-white/[0.06] pb-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">{title}</h2>
                    {description && <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>}
                </div>
            </div>
            {children}
        </section>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- initialData is partially-typed DB row; zod validates at runtime
export function PropertyForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [pdfEntries, setPdfEntries] = useState<PdfEntry[]>([]);

    const form = useForm<PropertyFormValues>({
        // Resolver<PropertyFormValues> keeps the RHF/zod inference in sync
        // without the `as any` escape hatch.
        resolver: zodResolver(propertySchema) as Resolver<PropertyFormValues>,
        defaultValues: {
            title: "",
            property_use: "Residencial",
            property_type: "Casa",
            business_type: "Venta",
            is_project: false,
            is_assignment: false,
            is_featured: false,
            m2_terrain: null,
            m2_construction: null,
            price: undefined,
            currency: "MXN",
            description: "",
            address: "",
            cover_image: initialData?.cover_image ?? null,
            slug: "",
            status: "Available",
            agent_name: "",
            agent_phone: "",
            agent_email: "",
            ...(initialData || {}),
            agent_ids: initialData?.agent_ids || [],
            video_url: initialData?.video_urls?.[0] || "",
            tour_url: initialData?.tour_embeds?.[0] || "",
        },
    });

    // ── Section refs for auto-scroll to errors ──
    const scrollToFirstError = useCallback(() => {
        // Find first invalid element and scroll to it
        const firstError = document.querySelector('[aria-invalid="true"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, []);

    // ── Image handlers ──
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
            e.target.value = "";
        }
    };

    const removeImageFile = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // ── PDF handlers ──
    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newEntries = Array.from(e.target.files).map(f => ({
                file: f,
                label: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            }));
            setPdfEntries(prev => [...prev, ...newEntries]);
            e.target.value = "";
        }
    };

    const removePdfEntry = (index: number) => {
        setPdfEntries(prev => prev.filter((_, i) => i !== index));
    };

    const updatePdfLabel = (index: number, label: string) => {
        setPdfEntries(prev => prev.map((e, i) => i === index ? { ...e, label } : e));
    };

    // ── Upload functions ──
    const uploadFile = async (propertyId: string, file: File, bucket: string = "public"): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("propertyId", propertyId);
            formData.append("bucket", bucket);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const json = await res.json();
                return json.url as string;
            }
            const json = await res.json().catch(() => ({}));
            throw new Error(json.error || "Error al subir archivo");
        } catch (err) {
            throw err;
        }
    };

    const uploadImages = async (propertyId: string) => {
        const urls: string[] = [];
        const errors: string[] = [];
        for (const file of imageFiles) {
            try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: "image/webp",
                });
                const url = await uploadFile(propertyId, compressedFile);
                if (url) urls.push(url);
            } catch (err) {
                errors.push(`${file.name}: ${err instanceof Error ? err.message : "Error desconocido"}`);
            }
        }
        if (errors.length > 0 && urls.length === 0) {
            throw new Error(`No se pudo subir ninguna imagen: ${errors.join("; ")}`);
        }
        if (errors.length > 0) {
            console.warn("Upload warnings:", errors);
        }
        return urls;
    };

    const uploadDocuments = async (propertyId: string) => {
        const docs: { label: string; url: string }[] = [];
        for (const entry of pdfEntries) {
            try {
                const url = await uploadFile(propertyId, entry.file);
                if (url) docs.push({ label: entry.label, url });
            } catch (err) {
                console.warn("Document upload failed:", entry.file.name, err);
            }
        }
        return docs;
    };

    // ── Submit ──
    async function onSubmit(data: PropertyFormValues) {
        setIsSubmitting(true);
        try {
            const isEditing = !!initialData?.id;
            let propertyData;

            // Step 1: Create/Update property record via API
            try {
                if (isEditing) {
                    const res = await fetch('/api/properties', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: initialData.id, ...data }),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.error || 'Error al actualizar');
                    propertyData = json.property;
                } else {
                    const res = await fetch('/api/properties', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                    const json = await res.json();
                    if (!res.ok) throw new Error(json.error || 'Error al crear');
                    propertyData = json.property;
                }
            } catch (error) {
                if (error instanceof TypeError && (
                    error.message === 'fetch failed' ||
                    error.message.includes('NetworkError') ||
                    error.message.includes('Load failed') ||
                    error.message.includes('network')
                )) {
                    throw new Error('Error de conexión al guardar. Verifica tu internet y vuelve a intentar.');
                }
                throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} propiedad: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }

            // Step 2: Upload documents (multiple PDFs)
            let documents: { label: string; url: string }[] = [];
            const uploadWarnings: string[] = [];
            if (pdfEntries.length > 0 && propertyData) {
                try {
                    documents = await uploadDocuments(propertyData.id);
                } catch (error) {
                    uploadWarnings.push(`Documentos: ${error instanceof Error ? error.message : 'falló la subida'}`);
                }
            }

            // Step 3: Upload images
            let imageUrls: string[] = [];
            if (imageFiles.length > 0 && propertyData) {
                try {
                    imageUrls = await uploadImages(propertyData.id);
                } catch (error) {
                    uploadWarnings.push(`Imágenes: ${error instanceof Error ? error.message : 'falló la subida'}`);
                }
            }

            // Step 4: Update property with file URLs
            const hasFiles = imageUrls.length > 0 || documents.length > 0;
            if (hasFiles && propertyData) {
                try {
                    const payload: Record<string, unknown> = { id: propertyData.id };
                    if (imageUrls.length > 0) {
                        payload.cover_image = imageUrls[0];
                        payload.images = imageUrls;
                    }
                    if (documents.length > 0) {
                        payload.documents = documents;
                    }
                    const updateRes = await fetch('/api/properties', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    if (!updateRes.ok) {
                        uploadWarnings.push('Los archivos se subieron pero no se pudieron vincular a la propiedad.');
                    }
                } catch (error) {
                    uploadWarnings.push(`Error al vincular archivos: ${error instanceof Error ? error.message : 'desconocido'}`);
                }
            }

            if (uploadWarnings.length > 0) {
                alert(`Propiedad guardada, pero con advertencias:\n${uploadWarnings.join('\n')}`);
                if (propertyData?.id) {
                    router.push(`/admin/properties/${propertyData.id}/edit`);
                } else {
                    router.push("/admin/properties");
                }
            } else {
                router.push("/admin/properties");
            }
            router.refresh();
        } catch (error) {
            // Submit error silently handled
            alert(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, () => {
                scrollToFirstError();
            })} className="flex min-w-0 flex-col gap-6" noValidate>
                <FormSection
                    icon={Settings2}
                    title="Datos principales"
                    description="Información pública básica para identificar la propiedad en inventario y buscadores."
                >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Título de la Propiedad</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="Ej. Casa en Zona Río" {...field} />
                                </FormControl>
                                <FormDescription>
                                    La URL pública se generará automáticamente desde este título.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="property_use"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Uso</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el uso" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Residencial">Residencial</SelectItem>
                                        <SelectItem value="Comercial">Comercial</SelectItem>
                                        <SelectItem value="Industrial">Industrial</SelectItem>
                                        <SelectItem value="Habitacional">Habitacional</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="property_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Terreno">Terreno</SelectItem>
                                        <SelectItem value="Casa">Casa</SelectItem>
                                        <SelectItem value="Departamento">Departamento</SelectItem>
                                        <SelectItem value="Oficina">Oficina</SelectItem>
                                        <SelectItem value="Bodega">Bodega</SelectItem>
                                        <SelectItem value="Local">Local</SelectItem>
                                        <SelectItem value="Plaza">Plaza</SelectItem>
                                        <SelectItem value="Nave">Nave</SelectItem>
                                        <SelectItem value="Parque">Parque</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="business_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Negocio</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el negocio" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Venta">Venta</SelectItem>
                                        <SelectItem value="Renta">Renta</SelectItem>
                                        <SelectItem value="Aportación">Aportación</SelectItem>
                                        <SelectItem value="Cesión">Cesión</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estatus</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el estatus" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Available">Disponible</SelectItem>
                                        <SelectItem value="Under_Offer">Bajo Oferta</SelectItem>
                                        <SelectItem value="Sold">Vendido</SelectItem>
                                        <SelectItem value="Rented">Rentado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-white/[0.1] bg-background/70 text-white"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Ej. 5000000"
                                        value={field.value ?? ""}
                                        onChange={e => {
                                            const raw = e.target.value;
                                            const num = parseFloat(raw.replace(/,/g, ""));
                                            field.onChange(isNaN(num) ? undefined : num);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Moneda</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona la moneda" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="MXN">MXN</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="m2_terrain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Terreno (m²)</FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-white/[0.1] bg-background/70 text-white"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Ej. 250"
                                        value={field.value != null && !isNaN(field.value as number) ? field.value as number : ""}
                                        onChange={e => {
                                            const raw = e.target.value;
                                            if (raw === "") { field.onChange(null); return; }
                                            const num = parseFloat(raw);
                                            field.onChange(num);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="m2_construction"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Construcción (m²)</FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-white/[0.1] bg-background/70 text-white"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Ej. 180"
                                        value={field.value != null && !isNaN(field.value as number) ? field.value as number : ""}
                                        onChange={e => {
                                            const raw = e.target.value;
                                            if (raw === "") { field.onChange(null); return; }
                                            const num = parseFloat(raw);
                                            field.onChange(num);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </FormSection>

                <FormSection
                    icon={FileText}
                    title="Descripción comercial"
                    description="Redacta el texto que aparecerá en la ficha pública de la propiedad."
                >
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descripción detallada de la propiedad..." className="h-32 border-white/[0.1] bg-background/70 text-white" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </FormSection>

                <FormSection
                    icon={MapPin}
                    title="Ubicación y enlaces"
                    description="Datos complementarios para ubicación, video y recorridos externos."
                >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="Ej. Zona Río, Tijuana" value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="video_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Promocional (Link Youtube/Vimeo)</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="https://youtube.com/..." value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tour_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Virtual Tour 360 (Kuula / Matterport)</FormLabel>
                                <FormControl>
                                    <Input className="border-white/[0.1] bg-background/70 text-white" placeholder="https://kuula.co/..." value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </FormSection>

                {/* ── Agent Assignment (Multi-select from registered agents) ── */}
                <FormSection
                    icon={UserRoundCheck}
                    title="Asignación de asesores"
                    description="Selecciona uno o varios agentes del equipo. Solo aparecen agentes activos."
                >
                    <FormField
                        control={form.control}
                        name="agent_ids"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agente(s)</FormLabel>
                                <FormControl>
                                    <AgentSelect
                                        value={field.value || []}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Puedes seleccionar múltiples agentes para una misma propiedad.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection icon={Star} title="Publicación" description="Define etiquetas comerciales y visibilidad destacada.">
                <div className="flex flex-col flex-wrap gap-6 md:flex-row md:items-center">
                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start gap-3">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Destacada</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_project"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start gap-3">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Proyecto (Preventa)</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_assignment"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start gap-3">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Cesión de Derechos</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                </FormSection>

                {/* ── Imágenes ── */}
                <FormSection
                    icon={ImageIcon}
                    title="Imágenes"
                    description="La primera imagen subida será la imagen principal en listados; las demás forman la galería pública."
                >
                <div className="flex flex-col gap-4">
                    <FormLabel>Imágenes (JPG, PNG, WEBP)</FormLabel>
                    <Input type="file" multiple accept="image/*" onChange={handleImageChange} className="cursor-pointer border-white/[0.1] bg-background/70 text-white file:mr-4 file:border-none file:bg-[var(--color-accent)] file:px-4 file:py-1 file:text-black hover:file:brightness-105" />
                    <FormDescription>Se comprimirán automáticamente a WebP antes de subir.</FormDescription>
                    {imageFiles.length > 0 && (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {imageFiles.map((file, i) => (
                                <div key={`${file.name}-${i}`} className="flex min-w-0 items-center gap-3 border border-white/[0.08] bg-white/[0.025] p-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                                        <ImageIcon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm text-white">{file.name}</p>
                                        <p className="text-xs text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImageFile(i)}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center text-white/45 hover:text-red-400"
                                        aria-label={`Quitar ${file.name}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </FormSection>

                {/* ── Documentos PDF (múltiples) ── */}
                <FormSection
                    icon={FileText}
                    title="Documentos"
                    description="Agrega PDFs internos o públicos con una etiqueta clara antes de guardarlos."
                >
                <div className="flex flex-col gap-4">
                    <FormLabel>Documentos (PDF) — Ficha técnica, escrituras, avalúos, etc.</FormLabel>
                    <Input
                        type="file"
                        multiple
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="cursor-pointer border-white/[0.1] bg-background/70 text-white file:mr-4 file:border-none file:bg-white file:px-4 file:py-1 file:text-black hover:file:brightness-95"
                    />
                    <FormDescription>
                        Puedes subir varios archivos. Asígnales una etiqueta para identificarlos.
                    </FormDescription>

                    {/* PDF entries list with editable labels */}
                    {pdfEntries.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {pdfEntries.map((entry, i) => (
                                <div key={i} className="grid gap-2 border border-white/[0.08] bg-white/[0.025] p-3 sm:grid-cols-[minmax(0,1fr)_180px_32px] sm:items-center">
                                    <span className="min-w-0 flex-1 truncate text-xs text-white/50">
                                        {entry.file.name}
                                    </span>
                                    <Input
                                        value={entry.label}
                                        onChange={e => updatePdfLabel(i, e.target.value)}
                                        placeholder="Ej. Ficha Técnica"
                                        className="h-8 w-full border-white/[0.1] bg-background/70 text-xs text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePdfEntry(i)}
                                        className="flex min-h-[32px] min-w-[32px] items-center justify-center p-1 text-white/45 hover:text-red-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </FormSection>

                <div className={`${adminCardClass} sticky bottom-3 z-10 flex flex-col gap-4 p-3 shadow-2xl shadow-black/30 sm:flex-row`}>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/properties')} className="order-last w-full rounded-full border-white/[0.12] bg-white/[0.025] text-white sm:order-first sm:w-auto">
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="brushed-gold w-full flex-1 rounded-full font-bold sm:w-auto">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        {isSubmitting ? "Guardando y subiendo archivos..." : "Guardar Propiedad"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
