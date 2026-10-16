import "server-only";
import { createClient } from "./supabase/server";

export type HomeMetrics = { properties: number | null; sectors: number; cities: number; advisors: number | null };

/** Public inventory and visible active advisors; never includes CRM totals. */
export async function getHomeMetrics(): Promise<HomeMetrics> {
  // Three business lines and four advertised service cities, not sales claims.
  const metrics: HomeMetrics = { properties: null, sectors: 3, cities: 4, advisors: null };
  try {
    const client = await createClient();
    const [properties, advisors] = await Promise.all([
      client.from("properties").select("id", { count: "exact", head: true }).eq("status", "Available"),
      client.from("agents").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);
    if (!properties.error) metrics.properties = properties.count ?? null;
    if (!advisors.error) metrics.advisors = advisors.count ?? null;
  } catch { /* Unavailable data stays unknown, rather than becoming a false zero. */ }
  return metrics;
}
