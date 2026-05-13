import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
    const supabaseKey = (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        ""
    ).trim();

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials — check Vercel env vars");
    }

    return createClient(
        supabaseUrl,
        supabaseKey,
        process.env.SUPABASE_SERVICE_ROLE_KEY ? {
            auth: { autoRefreshToken: false, persistSession: false },
        } : undefined
    );
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const supabase = getSupabase();

        // Generate slug from title
        const slug = (data.title as string)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const { data: property, error } = await supabase
            .from("properties")
            .insert([{ ...data, slug }])
            .select()
            .single();

        if (error) {
            console.error("[API /properties POST] Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ property }, { status: 201 });
    } catch (err) {
        console.error("[API /properties POST] Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { id, ...rest } = data;
        const supabase = getSupabase();

        if (!id) {
            return NextResponse.json({ error: "Missing property id" }, { status: 400 });
        }

        const updatePayload: Record<string, unknown> = { ...rest };

        // Regenerate slug from updated title if present
        if (rest.title) {
            updatePayload.slug = (rest.title as string)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
        }

        const { data: property, error } = await supabase
            .from("properties")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("[API /properties PUT] Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ property }, { status: 200 });
    } catch (err) {
        console.error("[API /properties PUT] Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
