import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Test with literal key to compare
  const LITERAL_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRld2ZkZm1pY2lmcGRlY3hjcGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4OTg3MzQsImV4cCI6MjA4NzQ3NDczNH0.pz8-eDX-5R1jt-_t8uvRBFDvPYmX0zWwq8WGp-yzY8k";

  // Test 1: using env var
  const s1 = createClient(url!, key!);
  const r1 = await s1.from("properties").select("id").limit(1);

  // Test 2: using literal key
  const s2 = createClient(url!, LITERAL_KEY);
  const r2 = await s2.from("properties").select("id").limit(1);

  // Test 3: key comparison
  const keyFromEnv = key || "(undefined)";

  return NextResponse.json({
    url,
    keyMatches: keyFromEnv === LITERAL_KEY,
    keyFromEnvLength: keyFromEnv.length,
    literalKeyLength: LITERAL_KEY.length,
    keyFromEnvFirst10: keyFromEnv.substring(0, 10),
    keyFromEnvLast10: keyFromEnv.substring(keyFromEnv.length - 10),
    test1_envKey: { ok: !r1.error, error: r1.error?.message, data: r1.data?.length },
    test2_literalKey: { ok: !r2.error, error: r2.error?.message, data: r2.data?.length },
  });
}
