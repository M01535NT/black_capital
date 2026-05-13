"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Copy } from "lucide-react";
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
        cell: ({ row }) => (
            <Link
                href={`/admin/properties/${row.original.id}`}
                className="font-bold text-foreground hover:text-gold-500 transition-colors"
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
            const statusColors: Record<string, string> = {
                Available: "bg-emerald-500/10 text-emerald-500",
                Under_Offer: "bg-yellow-500/10 text-yellow-500",
                Sold: "bg-red-500/10 text-red-500",
                Rented: "bg-blue-500/10 text-blue-500",
            };
            return (
                <Badge variant="secondary" className={statusColors[status] || "bg-foreground/5"}>
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
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/properties/${property.id}`}>
                                <Eye className="w-3.5 h-3.5 mr-2" />
                                Ver Detalle
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/properties/${property.id}/edit`}>
                                <Edit className="w-3.5 h-3.5 mr-2" />
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
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
