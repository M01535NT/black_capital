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
import { Search, ChevronDown, X, Download } from "lucide-react";
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
                const rowRecord = row as Record<string, unknown>;
                const fields: (keyof TData)[] = searchFields || (
                    Object.keys(rowRecord).filter((k) => typeof rowRecord[k] === "string") as (keyof TData)[]
                );
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

    // TanStack Table returns function-heavy instances that React Compiler intentionally skips.
    // eslint-disable-next-line react-hooks/incompatible-library
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

    function exportCsv() {
        const rows = filteredData.map((row) => {
            const record = row as Record<string, unknown>;
            return Object.fromEntries(
                Object.entries(record).filter(([, value]) =>
                    ["string", "number", "boolean"].includes(typeof value)
                )
            );
        });
        const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
        const csv = [
            keys.join(","),
            ...rows.map((row) => keys.map((key) => JSON.stringify(row[key] ?? "")).join(",")),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `export-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div>
            {/* Search + Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.08] p-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalSearch}
                        onChange={(e) => {
                            setGlobalSearch(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="h-10 border-white/[0.08] bg-background/70 pl-9 text-sm text-white placeholder:text-white/35 focus-visible:border-[var(--color-accent)] focus-visible:ring-0"
                    />
                    {globalSearch && (
                        <button
                            onClick={() => setGlobalSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white"
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
                        className="ml-auto text-caption text-[var(--color-accent)] transition-colors hover:text-white"
                    >
                        Limpiar filtros
                    </button>
                )}
                <button
                    onClick={exportCsv}
                    className="inline-flex items-center gap-2 text-caption text-white/45 transition-colors hover:text-[var(--color-accent)]"
                >
                    <Download className="h-3.5 w-3.5" />
                    Exportar
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-white/[0.08] hover:bg-transparent">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="text-caption text-white/42">
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
                                    className="border-white/[0.06] hover:bg-white/[0.025]"
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
                                    <div className="text-body-sm text-white/50">
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
            <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-3">
                <span className="text-xs text-white/45">
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
                        className="h-8 border-white/[0.1] bg-white/[0.02] px-3 text-caption text-white/65"
                    >
                        Anterior
                    </Button>
                    <span className="px-1 text-body-sm text-white/45">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 border-white/[0.1] bg-white/[0.02] px-3 text-caption text-white/65"
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
                    "flex items-center gap-1.5 border px-3 py-2 text-caption transition-all",
                    current
                        ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "border-white/[0.08] bg-white/[0.025] text-white/55 hover:border-white/[0.16] hover:text-white"
                )}
            >
                {filter.label}
                {current && <span className="ml-1">· {current}</span>}
                <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={onToggle} />
                    <div className="absolute left-0 top-full z-20 mt-1 min-w-[170px] overflow-hidden border border-white/[0.08] bg-[#0b0b0b] py-1 shadow-2xl shadow-black/40">
                        <button
                            onClick={() => onSelect(null)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs transition-colors",
                                !current ? "font-medium text-[var(--color-accent)]" : "text-white/60 hover:text-white"
                            )}
                        >
                            Tod{filter.label.toLowerCase().endsWith("s") ? "os" : "as"}
                        </button>
                        <div className="border-t border-white/[0.06]" />
                        {filter.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onSelect(opt)}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs transition-colors",
                                    current === opt
                                        ? "bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]"
                                        : "text-white/70 hover:bg-white/[0.04]"
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
