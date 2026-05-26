     1|import { createClient } from "@/lib/supabase/server";
     2|import { AgentForm } from "@/components/admin/agent-form";
     3|import { ChevronLeft } from "lucide-react";
     4|import Link from "next/link";
     5|import { Button } from "@/components/ui/button";
     6|import { notFound } from "next/navigation";
     7|
     8|export default async function EditAgentPage({
     9|    params,
    10|}: {
    11|    params: Promise<{ id: string }>;
    12|}) {
    13|    const { id } = await params;
    14|    const supabase = await createClient();
    15|
    16|    const { data: agent, error } = await supabase
    17|        .from("agents")
    18|        .select("*")
    19|        .eq("id", id)
    20|        .single();
    21|
    22|    if (error || !agent) {
    23|        notFound();
    24|    }
    25|
    26|    return (
    27|        <div className="max-w-3xl mx-auto w-full space-y-6">
    28|            <div className="flex items-center gap-4">
    29|                <Link href="/admin/agents">
    30|                    <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
    31|                        <ChevronLeft className="h-4 w-4" />
    32|                    </Button>
    33|                </Link>
    34|                <div>
    35|                    <h2 className="section-heading text-3xl text-foreground">Editar Agente</h2>
    36|                    <p className="text-foreground/50">Modifica los datos del agente.</p>
    37|                </div>
    38|            </div>
    39|
    40|            <div className="bg-card border border-foreground/10 rounded-xl p-6 shadow-sm">
    41|                <AgentForm
    42|                    initialData={{
    43|                        id: agent.id,
    44|                        full_name: agent.full_name,
    45|                        email: agent.email || "",
    46|                        phone: agent.phone || "",
    47|                        photo_url: agent.photo_url || "",
    48|                        license_number: agent.license_number || "",
    49|                        bio: agent.bio || "",
    50|                        is_active: agent.is_active,
    51|                    }}
    52|                />
    53|            </div>
    54|        </div>
    55|    );
    56|}
    57|