import { AgentForm } from "@/components/admin/agent-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewAgentPage() {
    return (
        <div className="max-w-3xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/agents">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="section-heading text-3xl text-foreground">Nuevo Agente</h2>
                    <p className="text-foreground/50">Registra un nuevo agente o corredor inmobiliario.</p>
                </div>
            </div>

            <div className="bg-card border border-foreground/10 rounded-xl p-6 shadow-sm">
                <AgentForm />
            </div>
        </div>
    );
}
