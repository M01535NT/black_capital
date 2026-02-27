import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
import { columns, LeadRow } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable static rendering for admin data

export default async function LeadsPage() {
    const supabase = await createClient();

    // Fetch leads data from Supabase
    const { data: leads, error } = await supabase
        .from("leads")
        .select("id, name, email, phone, source, status, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Leads</h2>
                    <p className="text-muted-foreground">
                        Administra los contactos de clientes potenciales, sus orígenes y estado en el embudo.
                    </p>
                </div>
                <Button asChild className="bg-gold-500 text-black hover:bg-gold-600 font-bold shrink-0">
                    <Link href="/admin/leads/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Lead
                    </Link>
                </Button>
            </div>

            <div className="bg-background border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
                <DataTable columns={columns} data={(leads as LeadRow[]) || []} />
            </div>
        </div>
    );
}
