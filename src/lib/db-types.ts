/**
 * Hand-written types for the entities used in the app. These mirror the
 * Supabase schema in supabase/migrations/ but are kept lightweight so the
 * frontend doesn't need a generated Database type to compile.
 *
 * Add fields here as the schema grows.
 */

export interface DbLead {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    assigned_agent_id?: string | null;
    created_at: string;
}

export interface DbAgent {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    license_number: string | null;
    is_active: boolean;
}

export interface DbPropertyAgent {
    property_id: string;
    agent_id: string;
}

export type DocumentRecord = {
    label?: string;
    type?: string;
    bucket?: string;
    path?: string;
    url?: string;
};
