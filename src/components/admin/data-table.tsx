"use client";

import { useState, useMemo } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterConfig {
    id: string;
    label: string;
    options: string[];
}

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    searchPlaceholder?: string;
    searchFields?: (keyof TData)[];
    filters?: FilterConfig[];
}

export function DataTable<TData extends object>({
    columns,
    data,
    searchPlaceholder = "Buscar...",
    searchFields,
    filters,
}: DataTableProps<TData>) {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [globalSearch, setGlobalSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});
    const [openFilter, setOpenFilter] = useState<string | null>(null);

    // Client-side filtering
    const filteredData = useMemo(() => {
        let result = data;

        // Global search
        if (globalSearch.trim()) {
            const q = globalSearch.toLowerCase();
            result = result.filter((row) => {
                // Search through specified fields, or all string fields
                const fields = searchFields || (Object.keys(row as any).filter((k: any) => typeof (row as any)[k] === "string") as (keyof TData)[]);
                return fields.some((key) => {
                    const val = row[key];
                    return typeof val === "string" && val.toLowerCase().includes(q);
                });
            });
        }

        // Column filters
        for (const [field, value] of Object.entries(activeFilters)) {
            if (value) {
                result = result.filter((row) => {
                    const cellVal = row[field as keyof TData];
                    return String(cellVal ?? "").toLowerCase() === value.toLowerCase();
                });
            }
        }

        return result;
    }, [data, globalSearch, activeFilters, searchFields]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: { pagination },
    });

    const hasActiveFilters = globalSearch.trim().length > 0 ||
        Object.values(activeFilters).some(v => v !== null);

    function clearFilters() {
        setGlobalSearch("");
        setActiveFilters({});
    }

    return (
        <div>
            {/* Search + Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-foreground/10">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalSearch}
                        onChange={(e) => {
                            setGlobalSearch(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="pl-9 h-9 text-sm bg-muted/20 border-foreground/10"
                    />
                    {globalSearch && (
                        <button
                            onClick={() => setGlobalSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Column Filters */}
                {filters?.map((filter) => {
                    const current = activeFilters[filter.id] || null;
                    const isOpen = openFilter === filter.id;

                    return <FilterDropdown
                        key={filter.id}
                        filter={filter}
                        current={current}
                        isOpen={isOpen}
                        onToggle={() => setOpenFilter(isOpen ? null : filter.id)}
                        onSelect={(value) => {
                            setActiveFilters(prev => ({ ...prev, [filter.id]: value }));
                            setOpenFilter(null);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                    />;
                })}

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors ml-auto"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-foreground/10 hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-foreground/70 font-bold text-xs uppercase tracking-wider">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-foreground/10 hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="text-foreground/40 text-sm">
                                        {hasActiveFilters
                                            ? "Sin resultados para los filtros actuales."
                                            : "No hay datos disponibles."}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer: Count + Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-foreground/10">
                <span className="text-xs text-foreground/40">
                    {filteredData.length} registro{filteredData.length !== 1 ? "s" : ""}
                    {filteredData.length !== data.length && (
                        <> de {data.length} totales</>
                    )}
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 px-3 text-xs border-foreground/10"
                    >
                        Anterior
                    </Button>
                    <span className="text-xs text-foreground/40 px-1">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 px-3 text-xs border-foreground/10"
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Filter Dropdown subcomponent ──────────────────────────────────

function FilterDropdown({
    filter,
    current,
    isOpen,
    onToggle,
    onSelect,
}: {
    filter: FilterConfig;
    current: string | null;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (value: string | null) => void;
}) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                    current
                        ? "bg-gold-500/10 border-gold-500/30 text-gold-500"
                        : "bg-muted/20 border-foreground/10 text-foreground/60 hover:border-foreground/30"
                )}
            >
                {filter.label}
                {current && <span className="ml-1">· {current}</span>}
                <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={onToggle} />
                    <div className="absolute top-full mt-1 left-0 z-20 min-w-[160px] bg-card border border-foreground/10 rounded-xl shadow-2xl shadow-black/40 py-1 overflow-hidden">
                        <button
                            onClick={() => onSelect(null)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs transition-colors",
                                !current ? "text-gold-500 font-medium" : "text-foreground/60 hover:text-foreground"
                            )}
                        >
                            Tod{filter.label.toLowerCase().endsWith("s") ? "os" : "as"}
                        </button>
                        <div className="border-t border-foreground/5" />
                        {filter.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onSelect(opt)}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs transition-colors",
                                    current === opt
                                        ? "text-gold-500 font-medium bg-gold-500/5"
                                        : "text-foreground/70 hover:bg-muted/50"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
