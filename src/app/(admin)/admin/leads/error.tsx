"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function LeadsError({
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
                        Error al cargar leads
                    </h2>
                    <p className="text-foreground/50 text-sm">
                        No se pudieron cargar los datos de leads.
                        Intenta nuevamente en unos momentos.
                    </p>
                </div>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Reintentar
                </Button>
            </div>
        </div>
    );
}
