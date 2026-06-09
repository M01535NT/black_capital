"use client";

import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <section className="w-full flex-1 flex items-center justify-center py-24 px-4">
            <div className="text-center max-w-lg">
                <AlertTriangle className="w-16 h-16 text-[var(--color-accent)] mx-auto mb-6" aria-hidden="true" />
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Algo salió mal
                </h1>
                <p className="text-body text-foreground/60 max-w-md mb-8">
                    No pudimos cargar esta página. Intenta de nuevo o regresa al inicio.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:bg-[var(--color-gold-soft)] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reintentar
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-foreground/10 text-foreground font-semibold hover:border-[var(--color-accent)]/30 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Inicio
                    </Link>
                </div>
            </div>
        </section>
    );
}
