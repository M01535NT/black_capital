"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2, UploadCloud, X, Plus } from "lucide-react";
import { AgentSelect } from "./agent-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Database } from "@/types/database.types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

interface PdfEntry {
    file: File;
    label: string;
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
            m2_terrain: 0,
            m2_construction: 0,
            price: 0,
            currency: "MXN",
            description: "",
            address: "",
            cover_image: "",
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
            setImageFiles(Array.from(e.target.files));
        }
    };

    // ── PDF handlers ──
    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newEntries = Array.from(e.target.files).map(f => ({
                file: f,
                label: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            }));
            setPdfEntries(prev => [...prev, ...newEntries]);
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
            })} className="flex flex-col gap-8" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Título de la Propiedad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Lujoso Penthouse en Polanco" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Slug (URL amigable para SEO)</FormLabel>
                                <FormControl>
                                    <Input placeholder="ej-lujoso-penthouse-polanco" value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription>
                                    Deja en blanco para generar automáticamente desde el título. Solo letras, números y guiones.
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

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descripción detallada de la propiedad..." className="h-32" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. Av. Paseo de la Reforma 222, Ciudad de México" value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cover_image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagen de Portada (URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormDescription>URL externa o deja en blanco para usar la primera imagen subida.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="video_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Promocional (Link Youtube/Vimeo)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://youtube.com/..." value={field.value ?? ""} onChange={field.onChange} />
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
                                    <Input placeholder="https://kuula.co/..." value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ── Agent Assignment (Multi-select from registered agents) ── */}
                <div className="border border-foreground/10 rounded-lg p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Asignación de Asesores</h3>
                    <p className="text-sm text-foreground/50">
                        Selecciona uno o varios agentes del equipo. Solo aparecen agentes activos.
                    </p>
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
                </div>

                <div className="flex flex-wrap gap-6 p-4 border border-foreground/10 flex-col md:flex-row rounded-lg items-center">
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

                {/* ── Imágenes ── */}
                <div className="flex flex-col gap-4">
                    <FormLabel>Imágenes (JPG, PNG, WEBP)</FormLabel>
                    <Input type="file" multiple accept="image/*" onChange={handleImageChange} className="cursor-pointer file:bg-gold-500 file:text-black file:border-none file:mr-4 file:-ml-3 file:py-1 file:px-4 file:rounded-md hover:file:bg-gold-600" />
                    <FormDescription>Se comprimirán automáticamente a WebP antes de subir.</FormDescription>
                </div>

                {/* ── Documentos PDF (múltiples) ── */}
                <div className="flex flex-col gap-4">
                    <FormLabel>Documentos (PDF) — Ficha técnica, escrituras, avalúos, etc.</FormLabel>
                    <Input
                        type="file"
                        multiple
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="cursor-pointer file:bg-steel-500 file:text-black file:border-none file:mr-4 file:-ml-3 file:py-1 file:px-4 file:rounded-md hover:file:bg-steel-600"
                    />
                    <FormDescription>
                        Puedes subir varios archivos. Asígnales una etiqueta para identificarlos.
                    </FormDescription>

                    {/* PDF entries list with editable labels */}
                    {pdfEntries.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {pdfEntries.map((entry, i) => (
                                <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 pl-3 border border-foreground/10">
                                    <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                                        {entry.file.name}
                                    </span>
                                    <Input
                                        value={entry.label}
                                        onChange={e => updatePdfLabel(i, e.target.value)}
                                        placeholder="Ej. Ficha Técnica"
                                        className="w-40 h-8 text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePdfEntry(i)}
                                        className="p-1 min-w-[32px] min-h-[32px] text-muted-foreground hover:text-red-400 flex items-center justify-center"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/properties')} className="w-full sm:w-auto order-last sm:order-first">
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex-1 bg-gold-500 text-black hover:bg-gold-600 font-bold">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        {isSubmitting ? "Guardando y subiendo archivos..." : "Guardar Propiedad"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
