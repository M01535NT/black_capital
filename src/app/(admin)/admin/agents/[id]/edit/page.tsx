import { createClient } from "@/lib/supabase/server";
import { AgentForm } from "@/components/admin/agent-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function EditAgentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: agent, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !agent) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/agents">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="section-heading text-3xl text-foreground">Editar Agente</h2>
                    <p className="text-foreground/50">Modifica los datos del agente.</p>
                </div>
            </div>

            <div className="bg-card border border-foreground/10 rounded-xl p-6 shadow-sm">
                <AgentForm
                    initialData={{
                        id: agent.id,
                        full_name: agent.full_name,
                        email: agent.email || "",
                        phone: agent.phone || "",
                        photo_url: agent.photo_url || "",
                        license_number: agent.license_number || "",
                        bio: agent.bio || "",
                        is_active: agent.is_active,
                    }}
                />
            </div>
        </div>
    );
}
