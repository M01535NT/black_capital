"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Global error boundary for public pages.
 * Catches React rendering errors and shows a recovery UI.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Log to external service (Sentry, PostHog, etc.)
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <AlertTriangle className="w-16 h-16 text-[var(--color-accent)] mb-6" aria-hidden="true" />
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                        Algo salió mal
                    </h2>
                    <p className="text-body text-foreground/60 max-w-md mb-8">
                        Ocurrió un error inesperado. Por favor, recarga la página o intenta más tarde.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-black font-semibold hover:bg-[var(--color-gold-soft)] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reintentar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
