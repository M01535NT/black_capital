"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2, Check, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignPropertiesButtonProps {
    agentId: string;
    assignedIds: string[];
}

export function AssignPropertiesButton({ agentId, assignedIds }: AssignPropertiesButtonProps) {
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase query result, typed at runtime by property schema
    const [properties, setProperties] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>(assignedIds);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (open) {
            setSelected(assignedIds);
            async function load() {
                const res = await fetch("/api/properties", { headers: { "Content-Type": "application/json" } });
                if (res.ok) {
                    const json = await res.json();
                    if (json.properties) setProperties(json.properties);
                }
            }
            load();
        }
    }, [open, assignedIds]);

    async function save() {
        setLoading(true);
        try {
            // Remove unselected
            const toRemove = assignedIds.filter(id => !selected.includes(id));
            if (toRemove.length > 0) {
                for (const pid of toRemove) {
                    await fetch(`/api/property-agents?agent_id=${agentId}&property_id=${pid}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                }
            }

            // Add new
            const toAdd = selected.filter(id => !assignedIds.includes(id));
            if (toAdd.length > 0) {
                for (const pid of toAdd) {
                    await fetch("/api/property-agents", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ agent_id: agentId, property_id: pid }),
                    });
                }
            }

            setOpen(false);
            router.refresh();
        } catch (err) {
            console.error("Error saving assignments:", err);
        } finally {
            setLoading(false);
        }
    }

    const filtered = properties.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-gold-dark)] gap-2 text-sm"
            >
                <Building2 className="w-4 h-4" /> Asignar Inventario
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex max-h-[80vh] w-full max-w-lg flex-col border border-white/[0.08] bg-[#050505] shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.08] p-4">
                            <h3 className="text-lg font-bold text-white">Asignar Inventario</h3>
                            <button onClick={() => setOpen(false)} className="p-1 text-white/55 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="border-b border-white/[0.06] p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Buscar propiedad..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full border border-white/[0.1] bg-background/70 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[var(--color-accent)]/50 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Property List */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <p className="py-8 text-center text-sm text-white/50">
                                    {search ? "Sin resultados" : "No hay propiedades disponibles"}
                                </p>
                            ) : (
                                filtered.map((prop) => {
                                    const isSelected = selected.includes(prop.id);
                                    return (
                                        <button
                                            key={prop.id}
                                            type="button"
                                            onClick={() => {
                                                setSelected(prev =>
                                                    prev.includes(prop.id)
                                                        ? prev.filter(id => id !== prop.id)
                                                        : [...prev, prop.id]
                                                );
                                            }}
                                            className={cn(
                                                "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                                                isSelected
                                                    ? "bg-[var(--color-accent)]/10 text-white"
                                                    : "text-white/80 hover:bg-white/[0.04]"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors",
                                                isSelected
                                                    ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                                                    : "border-white/20"
                                            )}>
                                                {isSelected && <Check className="w-3 h-3 text-black" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{prop.title}</div>
                                                <div className="text-xs text-white/50">
                                                    {prop.business_type}
                                                </div>
                                            </div>
                                            <span className="text-xs font-numerics text-[var(--color-accent)] truncate">
                                                {new Intl.NumberFormat("es-MX", {
                                                    style: "currency",
                                                    currency: prop.currency,
                                                    notation: "compact",
                                                }).format(prop.price)}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-white/[0.08] p-4">
                            <span className="text-sm text-white/50">
                                {selected.length} seleccionada{selected.length !== 1 ? "s" : ""}
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={save}
                                    disabled={loading}
                                    className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-gold-dark)]"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
