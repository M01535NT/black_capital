"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function PropertiesError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-6 text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                        Error al cargar inventario
                    </h2>
                    <p className="text-foreground/50 text-sm">
                        No se pudo cargar el listado de propiedades.
                        Verifica tu conexión e intenta nuevamente.
                    </p>
                </div>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="border-[var(--color-accent)]/30 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Reintentar
                </Button>
            </div>
        </div>
    );
}
