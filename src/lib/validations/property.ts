import { z } from "zod";

// Helper: Zod v4 compatible number field that shows "Invalid" on NaN input
const numericFieldOptional = (fieldLabel: string) =>
    z.number()
        .refine(v => !isNaN(v), { message: `Invalid: ${fieldLabel} debe ser un número válido` })
        .optional()
        .nullable();

const numericFieldRequired = (min: number, minMsg: string) =>
    z.number()
        .refine(v => !isNaN(v), { message: "Invalid: debe ser un número válido" })
        .refine(v => isNaN(v) || v >= min, { message: minMsg });

export const propertySchema = z.object({
    title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
    property_use: z.enum(["Residencial", "Comercial", "Industrial", "Habitacional"]),
    property_type: z.enum([
        "Terreno", "Casa", "Departamento", "Oficina", "Bodega", "Local", "Plaza", "Nave", "Parque"
    ]),
    business_type: z.enum(["Venta", "Renta", "Aportación", "Cesión"]),
    is_project: z.boolean(),
    is_assignment: z.boolean(),
    is_featured: z.boolean(),
    m2_terrain: numericFieldOptional("m2 terreno"),
    m2_construction: numericFieldOptional("m2 construcción"),
    price: numericFieldRequired(1, "El precio debe ser mayor a 0"),
    currency: z.enum(["MXN", "USD"]),
    description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
    status: z.enum(["Available", "Under_Offer", "Sold", "Rented"]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
