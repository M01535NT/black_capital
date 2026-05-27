import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Use anon key to simulate what public visitors see
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  results.env = {
    hasUrl: !!url,
    hasKey: !!key,
  };

  if (!url || !key) {
    results.error = "Missing Supabase env vars";
    return NextResponse.json(results);
  }

  const supabase = createClient(url, key);

  // Try reading properties (same as public inventory page)
  const { data: props, error: propsErr } = await supabase
    .from("properties")
    .select("id, title, slug, status")
    .eq("status", "Available")
    .limit(3);

  results.publicRead = {
    found: props?.length || 0,
    error: propsErr?.message || null,
    samples: props || [],
  };

  // Try reading without status filter
  const { data: allProps, error: allErr } = await supabase
    .from("properties")
    .select("id, title, status")
    .limit(3);

  results.allRead = {
    found: allProps?.length || 0,
    error: allErr?.message || null,
  };

  return NextResponse.json(results);
}
