import { Loader2 } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 text-[var(--color-accent)] animate-spin" />
                <p className="text-sm text-white/50">Cargando panel...</p>
            </div>
        </div>
    );
}
