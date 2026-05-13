import { NextResponse } from "next/server";

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET";
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.substring(0, 20)}...` 
        : "NOT SET";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
        ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...` 
        : "NOT SET";

    return NextResponse.json({
        supabaseUrl: url,
        publishableKey,
        serviceRoleKey,
    });
}
