"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PropertyRow = {
    id: string;
    title: string;
    property_use: string;
    business_type: string;
    status: string;
    price: number;
    currency: string;
};

export const columns: ColumnDef<PropertyRow>[] = [
    {
        accessorKey: "title",
        header: "Propiedad",
        cell: ({ row }) => <div className="font-bold text-foreground">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "property_use",
        header: "Uso",
        cell: ({ row }) => {
            const use = row.getValue("property_use") as string;
            const colorMap: Record<string, string> = {
                Residencial: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                Comercial: "bg-gold-500/10 text-gold-500 border-gold-500/20",
                Industrial: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            };
            return <Badge variant="outline" className={colorMap[use] || ""}>{use}</Badge>;
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
                currency: currency,
            }).format(amount);

            return <div className="text-right font-numerics font-bold">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Estatus",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant="secondary" className="bg-foreground/5">{status}</Badge>
            );
        }
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
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(property.id)}
                        >
                            Copiar ID de Propiedad
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/properties/${property.id}/edit`}>Editar Propiedad</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
