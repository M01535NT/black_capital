import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const results: Record<string, unknown> = {};

  // 1. Check if RLS is enabled on properties
  const { data: rlsInfo, error: rlsErr } = await supabase
    .rpc("check_rls", {}, { head: false })
    .catch(() => ({ data: null, error: "rpc not available" }));

  // 2. Count total properties
  const { count: totalProps } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  results.totalProperties = totalProps;

  // 3. Count available properties via admin client
  const { count: availableProps } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "Available");
  results.availableProperties = availableProps;

  // 4. Try to get a sample property
  const { data: sample, error: sampleErr } = await supabase
    .from("properties")
    .select("id, title, slug, status")
    .limit(3);
  results.sampleProperties = sample || [];
  if (sampleErr) results.sampleError = sampleErr.message;

  // 5. Check RLS state via raw query attempt
  try {
    const { data: rlsState } = await supabase
      .from("properties")
      .select("id")
      .limit(1);
    results.rlsCheck = {
      canReadAdmin: !!rlsState,
      count: rlsState?.length || 0,
    };
  } catch (e) {
    results.rlsCheck = { error: String(e) };
  }

  // 6. Check env vars (names only, no values)
  results.env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  return NextResponse.json(results);
}
