import { Loader2 } from "lucide-react";

export default function AgentDetailLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-[var(--color-accent)] animate-spin" />
                </div>
                <p className="text-foreground/50 text-sm">Cargando datos del agente...</p>
            </div>
        </div>
    );
}
