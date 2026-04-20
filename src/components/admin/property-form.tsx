"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
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
import { Loader2, UploadCloud } from "lucide-react";

export function PropertyForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // Omitted standard form hook due to the import error fixing needed next. Let's fix the import.
    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: initialData || {
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
            status: "Available",
            video_url: "",
            tour_url: "",
            agent_name: "",
            agent_phone: "",
            agent_email: "",
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const uploadImages = async (propertyId: string) => {
        const urls: string[] = [];
        for (const file of files) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: "image/webp",
            };
            try {
                const compressedFile = await imageCompression(file, options);
                const fileName = `${propertyId}/${Date.now()}-${compressedFile.name.replace(/\.[^/.]+$/, "")}.webp`;

                const { data, error } = await supabase.storage
                    .from("public")
                    .upload(fileName, compressedFile, {
                        contentType: "image/webp",
                        upsert: false,
                    });

                if (error) throw error;

                const { data: publicUrlData } = supabase.storage
                    .from("public")
                    .getPublicUrl(fileName);

                urls.push(publicUrlData.publicUrl);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
        return urls;
    };

    const uploadPdf = async (propertyId: string) => {
        if (!pdfFile) return null;
        try {
            const fileName = `${propertyId}/${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
            const { error } = await supabase.storage
                .from("public")
                .upload(fileName, pdfFile, {
                    contentType: "application/pdf",
                    upsert: false,
                });

            if (error) throw error;
            const { data: publicUrlData } = supabase.storage.from("public").getPublicUrl(fileName);
            return publicUrlData.publicUrl;
        } catch (error) {
            console.error("Error uploading PDF:", error);
            return null;
        }
    };

    async function onSubmit(data: PropertyFormValues) {
        setIsSubmitting(true);
        try {
            const isEditing = !!initialData?.id;
            let propertyData;

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

            // Upload Images and PDF if any
            let pdfUrl = null;
            if (pdfFile && propertyData) {
                pdfUrl = await uploadPdf(propertyData.id);
            }

            if (files.length > 0 && propertyData) {
                const imageUrls = await uploadImages(propertyData.id);

                // Update Property with Cover Image and/or PDF via API
                if (imageUrls.length > 0 || pdfUrl) {
                    await fetch('/api/properties', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            id: propertyData.id, 
                            ...(imageUrls.length > 0 && { cover_image: imageUrls[0] }),
                            ...(pdfUrl && { pdf_url: pdfUrl })
                        }),
                    });
                }
            } else if (pdfUrl && propertyData) {
                 await fetch('/api/properties', {
                     method: 'PUT',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ id: propertyData.id, pdf_url: pdfUrl }),
                 });
            }

            router.push("/admin/properties");
            router.refresh();
        } catch (error) {
            console.error("Error submitting property:", error);
            alert(`Error al guardar la propiedad: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* ... form fields will go here ... */}
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
                                            // Pass NaN as number so Zod's invalid_type_error fires
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
                                            // Pass NaN as number so Zod's invalid_type_error fires
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
                                <FormLabel>Virtual Tour 360 (Matterport Link)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://my.matterport.com/..." value={field.value ?? ""} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="border border-foreground/10 rounded-lg p-6 space-y-6">
                    <h3 className="text-lg font-bold">Asignación de Asesor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="agent_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Agente</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Roberto Sánchez" value={field.value ?? ""} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agent_phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono / WhatsApp</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. 5512345678" value={field.value ?? ""} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agent_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="agente@blackcorporativo.com" value={field.value ?? ""} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>



                <div className="flex flex-wrap gap-6 p-4 border border-foreground/10 flex-col md:flex-row rounded-lg items-center">
                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Destacada
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_project"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Proyecto (Preventa)
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_assignment"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Cesión de Derechos
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormLabel>Imágenes (JPG, PNG, WEBP)</FormLabel>
                        <Input type="file" multiple accept="image/*" onChange={handleFileChange} className="cursor-pointer file:bg-gold-500 file:text-black file:border-none file:mr-4 file:-ml-3 file:py-1 file:px-4 file:rounded-md hover:file:bg-gold-600" />
                        <FormDescription>Se comprimirán automáticamente a WebP antes de subir.</FormDescription>
                    </div>

                    <div className="space-y-4">
                        <FormLabel>Brochure (Documento PDF)</FormLabel>
                        <Input type="file" accept="application/pdf" onChange={handlePdfChange} className="cursor-pointer file:bg-steel-500 file:text-black file:border-none file:mr-4 file:-ml-3 file:py-1 file:px-4 file:rounded-md hover:file:bg-steel-600" />
                        <FormDescription>Sube el brochure ejecutivo. Se guardará sin compresión y atado a esta propiedad.</FormDescription>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/properties')} className="w-full sm:w-auto order-last sm:order-first">
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex-1 bg-gold-500 text-black hover:bg-gold-600 font-bold">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        {isSubmitting ? "Guardando y subiendo imágenes..." : "Guardar Propiedad"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
