import { NextResponse } from "next/server";

export async function GET() {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET";
    const trimmedUrl = rawUrl.trim();
    const urlHex = Buffer.from(rawUrl).toString("hex");
    
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "NOT SET";
    const trimmedKey = rawKey.trim();
    const keyHex = Buffer.from(rawKey).toString("hex").substring(0, 40) + "...";

    return NextResponse.json({
        rawUrlLength: rawUrl.length,
        trimmedUrlLength: trimmedUrl.length,
        urlHex,
        rawKeyLength: rawKey.length,
        trimmedKeyLength: trimmedKey.length,
        keyHex,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET",
    });
}
