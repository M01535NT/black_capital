import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blackcorporativo.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${SITE_URL}/inventario`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE_URL}/black-luxury`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/black-business`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/black-industrial`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${SITE_URL}/herramientas`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
        { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${SITE_URL}/legal/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ];

    // Dynamic property pages
    let propertyPages: MetadataRoute.Sitemap = [];
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from("properties")
            .select("slug, id, updated_at, created_at")
            .eq("status", "Available")
            .order("created_at", { ascending: false });

        if (data) {
            propertyPages = (data as Array<{ slug: string | null; id: string; updated_at: string | null; created_at: string }>).map((p) => ({
                url: `${SITE_URL}/inventario/${p.slug || p.id}`,
                lastModified: new Date(p.updated_at || p.created_at),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
        }
    } catch {
        // If Supabase is unreachable, still ship the static sitemap
    }

    return [...staticPages, ...propertyPages];
}
