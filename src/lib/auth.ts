import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "agent";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  agent_id: string | null;
  is_active: boolean;
}

export const ADMIN_LOGIN_PATH = "/admin/login";

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_profiles")
    .select("id, email, full_name, role, agent_id, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  return (data as AdminProfile | null) ?? null;
}

export async function requireAdminSession(): Promise<AdminProfile> {
  const profile = await getCurrentAdminProfile();
  if (!profile) redirect(ADMIN_LOGIN_PATH);
  return profile;
}

export async function requireAdminRole(): Promise<AdminProfile> {
  const profile = await requireAdminSession();
  if (profile.role !== "admin") redirect("/admin");
  return profile;
}

export async function requireApiProfile(): Promise<AdminProfile | null> {
  return getCurrentAdminProfile();
}

export function isAdmin(profile: AdminProfile | null): boolean {
  return profile?.role === "admin";
}

export function canAccessAgentScopedResource(
  profile: AdminProfile,
  assignedAgentId?: string | null,
): boolean {
  return profile.role === "admin" || (!!profile.agent_id && assignedAgentId === profile.agent_id);
}
