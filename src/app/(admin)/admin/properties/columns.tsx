"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Copy, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { adminBadgeAccentClass, adminBadgeClass, adminBadgeMutedClass } from "@/components/admin/admin-ui";

export type PropertyRow = {
    id: string;
    title: string;
    property_use: string;
    business_type: string;
    status: string;
    price: number;
    currency: string;
    updated_at?: string | null;
    cover_image?: string | null;
};

function DeleteButton({ propertyId }: { propertyId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!window.confirm("¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer.")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/properties?id=${propertyId}`, { method: "DELETE" });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.error || "Error al eliminar");
            }
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropdownMenuItem
            onClick={handleDelete}
            disabled={loading}
            className="text-red-400 focus:text-red-400 focus:bg-red-500/10"
        >
            {loading ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
            Eliminar
        </DropdownMenuItem>
    );
}

export const columns: ColumnDef<PropertyRow>[] = [
    {
        accessorKey: "title",
        header: "Propiedad",
        cell: ({ row }) => (
            <Link
                href={`/admin/properties/${row.original.id}/edit`}
                className="text-body-sm font-medium text-white transition-colors hover:text-[var(--color-accent)]"
            >
                {row.getValue("title")}
            </Link>
        ),
    },
    {
        accessorKey: "property_use",
        header: "Uso",
        cell: ({ row }) => {
            const use = row.getValue("property_use") as string;
            const colorMap: Record<string, string> = {
                Residencial: adminBadgeClass,
                Comercial: adminBadgeAccentClass,
                Industrial: adminBadgeClass,
                Habitacional: adminBadgeMutedClass,
            };
            return <Badge variant="outline" className={colorMap[use] || adminBadgeMutedClass}>{use}</Badge>;
        },
    },
    {
        accessorKey: "business_type",
        header: "Negocio",
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Precio</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));
            const currency = row.original.currency;
            const formatted = new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency,
            }).format(amount);

            return <div className="text-right font-numerics font-bold text-[var(--color-accent)]">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusColors: Record<string, string> = {
                Available: adminBadgeAccentClass,
                Under_Offer: adminBadgeClass,
                Sold: adminBadgeMutedClass,
                Rented: adminBadgeClass,
            };
            return (
                <Badge variant="outline" className={statusColors[status] || adminBadgeMutedClass}>
                    {status === "Available" ? "Disponible"
                        : status === "Under_Offer" ? "Bajo Oferta"
                        : status === "Sold" ? "Vendido"
                        : status === "Rented" ? "Rentado"
                        : status}
                </Badge>
            );
        }
    },
    {
        accessorKey: "updated_at",
        header: "Actualizado",
        cell: ({ row }) => {
            const value = row.original.updated_at;
            return (
                <span className="text-body-sm text-white/50">
                    {value ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—"}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const property = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-caption">Acciones</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/properties/${property.id}/edit`}>
                                <Edit className="w-3.5 h-3.5 mr-2 text-[var(--color-accent)]" />
                                Editar Propiedad
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(property.id).catch(() => {})}
                        >
                            <Copy className="w-3.5 h-3.5 mr-2" />
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteButton propertyId={property.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
