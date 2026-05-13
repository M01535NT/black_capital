import { createClient } from "@/lib/supabase/server";
import { LeadsPageClient } from "./leads-client";
import type { LeadRow } from "./columns";

export const revalidate = 0;

export default async function LeadsPage() {
    const supabase = await createClient();

    const { data: leads, error } = await supabase
        .from("leads")
        .select("id, name, email, phone, source, status, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
    }

    return <LeadsPageClient leads={(leads as LeadRow[]) || []} />;
}
