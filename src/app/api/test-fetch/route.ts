import { NextResponse } from "next/server";

export async function GET() {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "").trim();
    const results: Record<string, unknown> = {};

    // Test 1: httpbin
    try {
        const r1 = await fetch("https://httpbin.org/get");
        results.httpbin = { ok: r1.ok, status: r1.status };
    } catch (e) {
        results.httpbin = { error: (e as Error).message };
    }

    // Test 2: Supabase
    try {
        const r2 = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: { "apikey": supabaseKey }
        });
        results.supabase = { ok: r2.ok, status: r2.status };
    } catch (e) {
        results.supabase = { error: (e as Error).message };
    }

    return NextResponse.json(results);
}
