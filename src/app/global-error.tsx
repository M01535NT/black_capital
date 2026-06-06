"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="es">
            <body className="bg-[#0A0A0A] text-[#FAFAFA] font-sans min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-lg">
                    <AlertTriangle className="w-20 h-20 text-gold-500 mx-auto mb-8" aria-hidden="true" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Error inesperado
                    </h1>
                    <p className="text-white/60 text-lg mb-8">
                        Se produjo un error al cargar esta página. Nuestro equipo ha sido notificado.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-gold-500 text-black font-semibold hover:bg-gold-400 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reintentar
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-white/20 text-white font-semibold hover:border-gold-500/50 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Ir al inicio
                        </Link>
                    </div>
                    {error.digest && (
                        <p className="mt-6 text-xs text-white/30 font-mono">
                            Código: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
