import { z } from "zod";

export const agentSchema = z.object({
    full_name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z
        .string()
        .email("Correo inválido")
        .or(z.literal(""))
        .optional(),
    phone: z
        .string()
        .min(10, "El teléfono debe tener al menos 10 dígitos")
        .or(z.literal(""))
        .optional(),
    photo_url: z.string().url("URL de foto inválida").or(z.literal("")).optional(),
    license_number: z.string().optional().or(z.literal("")),
    bio: z.string().optional().or(z.literal("")),
    is_active: z.boolean(),
});

export type AgentFormValues = z.infer<typeof agentSchema>;

export type AgentRow = {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    license_number: string | null;
    bio: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};
