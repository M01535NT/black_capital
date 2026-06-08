import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireApiProfile } from "@/lib/auth";

export async function GET() {
  const profile = await requireApiProfile();
  if (!profile) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read_at, created_at")
    .or(`recipient_profile_id.eq.${profile.id},recipient_profile_id.is.null`)
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    notifications: data || [],
    unreadCount: data?.length || 0,
  });
}

export async function PATCH(req: NextRequest) {
  const profile = await requireApiProfile();
  if (!profile) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  const supabase = createAdminClient();
  let query = supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .or(`recipient_profile_id.eq.${profile.id},recipient_profile_id.is.null`);

  if (id) query = query.eq("id", id);
  else query = query.is("read_at", null);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
