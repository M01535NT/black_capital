import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import type { AgentRow } from "@/lib/validations/agent";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AgentsPage() {
    const supabase = await createClient();

    const { data: agents, error } = await supabase
        .from("agents")
        .select("id, full_name, email, phone, license_number, is_active, created_at, updated_at")
        .order("full_name", { ascending: true });

    if (error) {
        console.error("Error fetching agents:", error);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-foreground">Agentes</h2>
                    <p className="text-foreground/50">Gestiona los agentes y corredores de la inmobiliaria.</p>
                </div>
                <Link href="/admin/agents/new">
                    <Button className="bg-gold-500 text-black hover:bg-gold-600 gap-2">
                        <UserPlus className="h-4 w-4" /> Nuevo Agente
                    </Button>
                </Link>
            </div>

            <div className="bg-card border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
                <DataTable columns={columns} data={(agents as AgentRow[]) || []} />
            </div>
        </div>
    );
}
