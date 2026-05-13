import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const SUPABASE_KEY = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
).trim();

async function supabaseFetch(path: string, options: RequestInit = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
            ...options.headers,
        },
    });
    return res;
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

        const res = await supabaseFetch("properties", {
            method: "POST",
            body: JSON.stringify({ ...data, slug }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("[API /properties POST] Supabase error:", res.status, err);
            return NextResponse.json({ error: `Supabase error ${res.status}: ${err}` }, { status: 400 });
        }

        const property = await res.json();
        return NextResponse.json({ property: Array.isArray(property) ? property[0] : property }, { status: 201 });
    } catch (err) {
        console.error("[API /properties POST] Unexpected error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { id, ...rest } = data;

        if (!id) {
            return NextResponse.json({ error: "Missing property id" }, { status: 400 });
        }

        const updatePayload: Record<string, unknown> = { ...rest };
        if (rest.title) {
            updatePayload.slug = generateSlug(rest.title);
        }

        const res = await supabaseFetch(`properties?id=eq.${encodeURIComponent(id)}`, {
            method: "PATCH",
            body: JSON.stringify(updatePayload),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("[API /properties PUT] Supabase error:", res.status, err);
            return NextResponse.json({ error: `Supabase error ${res.status}: ${err}` }, { status: 400 });
        }

        const property = await res.json();
        return NextResponse.json({ property: Array.isArray(property) ? property[0] : property }, { status: 200 });
    } catch (err) {
        console.error("[API /properties PUT] Unexpected error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
    }
}
