"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AgentOption {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
}

interface AgentSelectProps {
    value: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
}

export function AgentSelect({ value, onChange, disabled }: AgentSelectProps) {
    const [agents, setAgents] = useState<AgentOption[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/agents", {
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json.agents) setAgents(json.agents.filter((a: AgentOption & { is_active?: boolean }) => a.is_active));
                } else {
                    setError("Error al cargar agentes");
                }
            } catch {
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selectedAgents = agents.filter(a => value.includes(a.id));

    function toggleAgent(id: string) {
        if (value.includes(id)) {
            onChange(value.filter(v => v !== id));
        } else {
            onChange([...value, id]);
        }
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                disabled={disabled}
                className={cn(
                    "flex min-h-10 w-full items-center gap-1.5 border border-white/[0.1] bg-background/70 px-3 py-2 text-sm ring-offset-background",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)]/50",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    open && "border-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)]/20"
                )}
            >
                <div className="flex-1 flex flex-wrap gap-1">
                    {selectedAgents.length === 0 ? (
                        <span className="text-white/50">Seleccionar agente(s)...</span>
                    ) : (
                        selectedAgents.map(a => (
                            <span
                                key={a.id}
                                className="inline-flex items-center gap-1 border border-[var(--color-accent)]/20 bg-white/[0.035] px-2 py-0.5 text-xs font-medium gold-ink"
                            >
                                {a.full_name.split(" ")[0]}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAgent(a.id);
                                    }}
                                    className="hover:text-[var(--color-gold-dark)]"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-white/50 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full min-w-[280px] overflow-hidden border border-white/[0.08] bg-[#050505] shadow-2xl shadow-black/40">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-white/50">Cargando agentes...</div>
                    ) : error ? (
                        <div className="p-4 text-center text-sm text-red-400">{error}</div>
                    ) : agents.length === 0 ? (
                        <div className="p-4 text-center text-sm text-white/50">
                            No hay agentes activos. <Link href="/admin/agents/new" className="gold-ink underline">Registra uno</Link>
                        </div>
                    ) : (
                        <div className="max-h-60 divide-y divide-white/[0.06] overflow-y-auto">
                            {agents.map((agent) => {
                                const isSelected = value.includes(agent.id);
                                return (
                                    <button
                                        key={agent.id}
                                        type="button"
                                        onClick={() => toggleAgent(agent.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                                            isSelected
                                                ? "bg-[var(--color-accent)]/10 text-white"
                                                : "text-white/80 hover:bg-white/[0.04]"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold",
                                                isSelected
                                                    ? "gold-gradient text-black border-[var(--color-accent)]"
                                                    : "border-white/[0.08] bg-white/[0.035] text-white/50"
                                            )}
                                        >
                                            {agent.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{agent.full_name}</div>
                                            {agent.email && (
                                                <div className="truncate text-xs text-white/50">{agent.email}</div>
                                            )}
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-[var(--color-accent)] shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
