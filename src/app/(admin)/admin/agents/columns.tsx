"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AgentRow } from "@/lib/validations/agent";

export const columns: ColumnDef<AgentRow>[] = [
    {
        accessorKey: "full_name",
        header: "Nombre",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] text-caption">
                    {row.getValue<string>("full_name").charAt(0)}
                </div>
                <span className="text-body-sm font-medium text-foreground">{row.getValue("full_name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({ row }) => <span className="text-foreground/70">{row.getValue("email") || "—"}</span>,
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
        cell: ({ row }) => <span className="text-foreground/70">{row.getValue("phone") || "—"}</span>,
    },
    {
        accessorKey: "license_number",
        header: "Cédula",
        cell: ({ row }) => <span className="text-foreground/70">{row.getValue("license_number") || "—"}</span>,
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const active = row.getValue("is_active") as boolean;
            return (
                <Badge
                    variant="secondary"
                    className={active
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-foreground/5 text-foreground/50"
                    }
                >
                    {active ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const agent = row.original;
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
                            <Link href={`/admin/agents/${agent.id}/edit`}>
                                <Pencil className="w-3.5 h-3.5 mr-2" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Desactivar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
