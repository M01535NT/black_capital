import { Loader2 } from "lucide-react";

export default function AgentEditLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-gold-500 animate-spin" />
                </div>
                <p className="text-foreground/50 text-sm">Cargando formulario de edición...</p>
            </div>
        </div>
    );
}
