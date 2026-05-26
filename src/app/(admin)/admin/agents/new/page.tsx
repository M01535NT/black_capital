     1|import { AgentForm } from "@/components/admin/agent-form";
     2|import { ChevronLeft } from "lucide-react";
     3|import Link from "next/link";
     4|import { Button } from "@/components/ui/button";
     5|
     6|export default function NewAgentPage() {
     7|    return (
     8|        <div className="max-w-3xl mx-auto w-full space-y-6">
     9|            <div className="flex items-center gap-4">
    10|                <Link href="/admin/agents">
    11|                    <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
    12|                        <ChevronLeft className="h-4 w-4" />
    13|                    </Button>
    14|                </Link>
    15|                <div>
    16|                    <h2 className="section-heading text-3xl text-foreground">Nuevo Agente</h2>
    17|                    <p className="text-foreground/50">Registra un nuevo agente o corredor inmobiliario.</p>
    18|                </div>
    19|            </div>
    20|
    21|            <div className="bg-card border border-foreground/10 rounded-xl p-6 shadow-sm">
    22|                <AgentForm />
    23|            </div>
    24|        </div>
    25|    );
    26|}
    27|