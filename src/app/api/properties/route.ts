import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim(),
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "").trim(),
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {}
                },
            },
        }
    );
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const slug = generateSlug(data.title);
        const supabase = await getSupabase();

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
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { id, ...rest } = data;
        const supabase = await getSupabase();

        if (!id) {
            return NextResponse.json({ error: "Missing property id" }, { status: 400 });
        }

        const updatePayload: Record<string, unknown> = { ...rest };
        if (rest.title) {
            updatePayload.slug = generateSlug(rest.title);
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
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}
