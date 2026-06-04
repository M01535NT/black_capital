/**
 * Shared data access layer.
 * Used by both server components (admin pages) and API routes.
 * Guarantees consistent Supabase queries across all code paths.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export async function getLeadsCount(status?: string) {
  const supabase = createAdminClient();
  let query = supabase.from("leads").select("*", { count: "exact", head: true });
  if (status) query = query.eq("status", status);
  const { count, error } = await query;
  if (error) {
    logger.error("data-layer", "[data] getLeadsCount error:", error);
    return 0;
  }
  return count ?? 0;
}

export async function getLeadsByStatus() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .select("status")
    .not("status", "is", null);
  if (error) {
    logger.error("data-layer", "[data] getLeadsByStatus error:", error);
    return [];
  }
  return data || [];
}

export async function getRecentLeads(limit = 5) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, email, phone, source, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    logger.error("data-layer", "[data] getRecentLeads error:", error);
    return [];
  }
  return data || [];
}

export async function getAgentsCount(activeOnly = true) {
  const supabase = createAdminClient();
  let query = supabase.from("agents").select("*", { count: "exact", head: true });
  if (activeOnly) query = query.eq("is_active", true);
  const { count, error } = await query;
  if (error) {
    logger.error("data-layer", "[data] getAgentsCount error:", error);
    return 0;
  }
  return count ?? 0;
}

export async function getPropertiesCount() {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  if (error) {
    logger.error("data-layer", "[data] getPropertiesCount error:", error);
    return 0;
  }
  return count ?? 0;
}

export async function getRecentProperties(limit = 5) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, business_type, price, currency, cover_image, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    logger.error("data-layer", "[data] getRecentProperties error:", error);
    return [];
  }
  return data || [];
}
