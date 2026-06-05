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
                className="bg-gold-500 text-black hover:bg-gold-600 gap-2 text-sm"
            >
                <Building2 className="w-4 h-4" /> Asignar Inventario
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
                            <h3 className="font-bold text-lg">Asignar Inventario</h3>
                            <button onClick={() => setOpen(false)} className="p-1 hover:text-foreground/50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-3 border-b border-foreground/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                                <input
                                    type="text"
                                    placeholder="Buscar propiedad..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-muted/30 border border-foreground/10 rounded-lg text-sm focus:outline-none focus:border-gold-500/50 text-foreground placeholder:text-foreground/50"
                                />
                            </div>
                        </div>

                        {/* Property List */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <p className="text-center text-sm text-foreground/50 py-8">
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
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors",
                                                isSelected
                                                    ? "bg-gold-500/5 text-foreground"
                                                    : "hover:bg-muted/50 text-foreground/80"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-gold-500 border-gold-500"
                                                    : "border-foreground/20"
                                            )}>
                                                {isSelected && <Check className="w-3 h-3 text-black" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{prop.title}</div>
                                                <div className="text-xs text-foreground/50">
                                                    {prop.business_type}
                                                </div>
                                            </div>
                                            <span className="text-xs font-numerics text-gold-500 truncate">
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
                        <div className="flex items-center justify-between p-4 border-t border-foreground/10">
                            <span className="text-sm text-foreground/50">
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
                                    className="bg-gold-500 text-black hover:bg-gold-600"
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
