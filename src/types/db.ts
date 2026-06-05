/**
 * TypeScript types derived from the live Supabase database.
 *
 * Source of truth: `supabase gen types typescript --linked --schema public`
 * (regenerate after any schema change).
 *
 * Usage:
 *   import type { Property, Lead, Agent } from "@/types/db"
 *
 * These types come from `database.types.ts` (auto-generated). They stay in
 * sync with the live database; if you change a column there, regenerate
 * this file and update call-sites. NEVER hand-edit `database.types.ts`.
 */

import type { Database } from "./database.types";

type PublicSchema = Database["public"];
type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T];
type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

// ─── Row types (read from DB) ─────────────────────────────────────────
export type Property = Tables<"properties">["Row"];
export type Lead = Tables<"leads">["Row"];
export type Agent = Tables<"agents">["Row"];
export type PropertyAgent = Tables<"property_agents">["Row"];

// ─── Insert types (write to DB) ───────────────────────────────────────
export type PropertyInsert = Tables<"properties">["Insert"];
export type LeadInsert = Tables<"leads">["Insert"];
export type AgentInsert = Tables<"agents">["Insert"];
export type PropertyAgentInsert = Tables<"property_agents">["Insert"];

// ─── Update types (patch DB) ──────────────────────────────────────────
export type PropertyUpdate = Tables<"properties">["Update"];
export type LeadUpdate = Tables<"leads">["Update"];
export type AgentUpdate = Tables<"agents">["Update"];

// ─── Enum values (for select inputs) ─────────────────────────────────
export type PropertyStatus = Enums<"property_status_enum">;
export type Currency = Enums<"currency_enum">;
export type PropertyUse = Enums<"property_use_enum">;
export type PropertyType = Enums<"property_type_enum">;
export type BusinessType = Enums<"business_type_enum">;

// ─── Convenience: a property joined with its agents ──────────────────
export type PropertyWithAgents = Property & {
    agents: Agent[];
};

// ─── JSON columns (typed access to jsonb) ─────────────────────────────
export interface AddressJson {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    neighborhood?: string;
    [key: string]: string | undefined;
}

export interface DocumentJson {
    label: string;
    url: string;
    [key: string]: string | undefined;
}

// Helper to safely read the jsonb `address` column
export function asAddress(value: Property["address"]): AddressJson {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as AddressJson;
    }
    return {};
}
