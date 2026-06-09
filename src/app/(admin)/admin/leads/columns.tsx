"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminBadgeAccentClass, adminBadgeClass, adminBadgeMutedClass } from "@/components/admin/admin-ui";

export type LeadRow = {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    created_at: string;
    notes?: string | null;
};

export const columns: ColumnDef<LeadRow>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
            <Link href={`/admin/leads/${row.original.id}`} className="font-bold text-white transition-colors hover:text-[var(--color-accent)]">
                {row.getValue("name")}
            </Link>
        ),
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({ row }) => <span className="text-sm text-white/70">{row.getValue("email")}</span>,
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => <span className="text-sm text-white/70">{row.getValue("phone")}</span>,
    },
    {
        accessorKey: "source",
        header: "Origen",
        cell: ({ row }) => {
            const source = row.getValue("source") as string;
            const labels: Record<string, string> = {
                organic: "Orgánico",
                campaign: "Campaña",
                referral: "Referido",
                other: "Otro",
                landing_luxury: "Luxury",
                landing_business: "Business",
                landing_industrial: "Industrial",
            };
            return <div className="capitalize text-sm">{labels[source] || source}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusMap: Record<string, { label: string, color: string }> = {
                new: { label: "Nuevo", color: adminBadgeAccentClass },
                contacted: { label: "Contactado", color: adminBadgeClass },
                qualified: { label: "Calificado", color: adminBadgeClass },
                lost: { label: "Perdido", color: adminBadgeMutedClass },
                won: { label: "Ganado", color: adminBadgeAccentClass },
            };
            const mapped = statusMap[status] || { label: status, color: adminBadgeMutedClass };
            return (
                <Badge variant="outline" className={mapped.color}>{mapped.label}</Badge>
            );
        }
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-right">Fecha</div>,
        cell: ({ row }) => {
            const dateStr = row.getValue("created_at") as string;
            const date = new Date(dateStr);
            const formatted = new Intl.DateTimeFormat("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).format(date);

            return <div className="text-right text-muted-foreground text-sm">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/leads/${lead.id}`}>
                                <Eye className="w-3.5 h-3.5 mr-2" /> Ver Detalle
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(lead.email).catch(() => {})}
                        >
                            Copiar Correo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
