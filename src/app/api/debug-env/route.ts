import { NextResponse } from "next/server";

/**
 * TEMPORARY — returns env var names available (NOT VALUES)
 * Deploy, hit once, then DELETE this file.
 */
export async function GET() {
  const keys = Object.keys(process.env)
    .filter(k => k.includes("SUPABASE") || k.includes("DATABASE") || k.includes("POSTGRES") || k.includes("PG"))
    .map(k => `${k}: ${process.env[k] ? "SET" : "not set"}`);

  return NextResponse.json({
    found: keys,
    total: Object.keys(process.env).length,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    hasDbUrl: !!process.env.DATABASE_URL,
  });
}
