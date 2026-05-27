import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const supabase = createAdminClient();

        const { data: agent, error } = await supabase
            .from("agents")
            .insert({
                full_name: data.full_name,
                email: data.email || null,
                phone: data.phone || null,
                photo_url: data.photo_url || null,
                license_number: data.license_number || null,
                bio: data.bio || null,
                is_active: data.is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ agent }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { id, ...rest } = data;
        const supabase = createAdminClient();

        if (!id) {
            return NextResponse.json({ error: "Missing agent id" }, { status: 400 });
        }

        const { data: agent, error } = await supabase
            .from("agents")
            .update({
                full_name: rest.full_name,
                email: rest.email || null,
                phone: rest.phone || null,
                photo_url: rest.photo_url || null,
                license_number: rest.license_number || null,
                bio: rest.bio || null,
                is_active: rest.is_active,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ agent }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const supabase = createAdminClient();

        if (!id) {
            return NextResponse.json({ error: "Missing agent id" }, { status: 400 });
        }

        const { error } = await supabase.from("agents").delete().eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 }
        );
    }
}
