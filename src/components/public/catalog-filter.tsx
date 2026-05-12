"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Property = {
    id: string;
    title: string;
    property_use: string;
    property_type: string;
    business_type: string;
    price: number;
    currency: string;
    m2_terrain: number | null;
    m2_construction: number | null;
    cover_image: string | null;
    status: string;
};

export function CatalogFilter({ properties }: { properties: Property[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [selectedUse, setSelectedUse] = useState<string | null>(searchParams.get("uso") || null);
    const [selectedType, setSelectedType] = useState<string | null>(searchParams.get("tipo") || null);
    const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(searchParams.get("negocio") || null);

    // ── Sync filters to URL params ──
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set("q", searchTerm);
        if (selectedUse) params.set("uso", selectedUse);
        if (selectedType) params.set("tipo", selectedType);
        if (selectedBusinessType) params.set("negocio", selectedBusinessType);
        const queryString = params.toString();
        router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }, [searchTerm, selectedUse, selectedType, selectedBusinessType, pathname, router]);

    const filteredProperties = useMemo(() => {
        return properties.filter((prop) => {
            const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesUse = selectedUse ? prop.property_use === selectedUse : true;
            const matchesType = selectedType ? prop.property_type === selectedType : true;
            const matchesBusiness = selectedBusinessType ? prop.business_type === selectedBusinessType : true;

            return matchesSearch && matchesUse && matchesType && matchesBusiness;
        });
    }, [properties, searchTerm, selectedUse, selectedType, selectedBusinessType]);

    const uses = ["Residencial", "Comercial", "Industrial", "Habitacional"];
    const types = ["Terreno", "Casa", "Departamento", "Oficina", "Bodega", "Local", "Plaza", "Nave", "Parque"];
    const businessTypes = ["Venta", "Renta", "Aportación", "Cesión"];

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setSelectedUse(null);
        setSelectedType(null);
        setSelectedBusinessType(null);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 shrink-0 space-y-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2">Búsqueda</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar propiedad..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2">Uso</h3>
                    <div className="flex flex-wrap gap-2">
                        {uses.map((use) => (
                            <Badge
                                key={use}
                                variant={selectedUse === use ? "default" : "outline"}
                                className={`cursor-pointer min-h-[44px] px-4 flex items-center ${selectedUse === use ? 'bg-gold-500 text-black hover:bg-gold-600' : 'hover:bg-foreground/5'}`}
                                onClick={() => setSelectedUse(selectedUse === use ? null : use)}
                            >
                                {use}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2">Negocio</h3>
                    <div className="flex flex-wrap gap-2">
                        {businessTypes.map((type) => (
                            <Badge
                                key={type}
                                variant={selectedBusinessType === type ? "default" : "outline"}
                                className={`cursor-pointer min-h-[44px] px-4 flex items-center ${selectedBusinessType === type ? 'bg-gold-500 text-black hover:bg-gold-600' : 'hover:bg-foreground/5'}`}
                                onClick={() => setSelectedBusinessType(selectedBusinessType === type ? null : type)}
                            >
                                {type}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-foreground/10 pb-2">Tipo</h3>
                    <div className="flex flex-wrap gap-2">
                        {types.map((type) => (
                            <Badge
                                key={type}
                                variant={selectedType === type ? "default" : "outline"}
                                className={`cursor-pointer min-h-[44px] px-4 flex items-center ${selectedType === type ? 'bg-gold-500 text-black hover:bg-gold-600' : 'hover:bg-foreground/5'}`}
                                onClick={() => setSelectedType(selectedType === type ? null : type)}
                            >
                                {type}
                            </Badge>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
                <div className="mb-6">
                    <p className="text-muted-foreground">Mostrando <span className="font-bold text-foreground">{filteredProperties.length}</span> resultados</p>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-foreground/20 rounded-xl" aria-label="Property results" id="results-grid">
                        <p className="text-muted-foreground text-lg font-medium">No se encontraron propiedades con esos filtros.</p>
                        <p className="text-muted-foreground text-sm mt-2">Intenta ampliar tu búsqueda o limpiar tus preferencias.</p>
                        <Button
                            variant="link"
                            className="mt-4 text-gold-500"
                            onClick={clearAllFilters}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 results-grid" aria-label="Property results" id="results-grid">
                        {filteredProperties.map((property) => (
                            <Link
                                href={`/inventario/${property.id}`}
                                key={property.id}
                                className="group flex flex-col bg-background border border-foreground/10 rounded-xl overflow-hidden hover:border-gold-500/50 hover:shadow-lg transition-all"
                            >
                                <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                                    {property.cover_image ? (
                                        <img
                                            src={property.cover_image}
                                            alt={property.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                                            <span className="text-muted-foreground">Sin imagen</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
                                            {property.property_use}
                                        </Badge>
                                        <Badge className="bg-gold-500 text-black hover:bg-gold-600">
                                            {property.business_type}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors">
                                        {property.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-4">
                                        {property.property_type}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-foreground/10 flex items-center justify-between">
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            {property.m2_terrain && (
                                                <span title="Terreno"><strong>{property.m2_terrain}</strong> m² T</span>
                                            )}
                                            {property.m2_construction && (
                                                <span title="Construcción"><strong>{property.m2_construction}</strong> m² C</span>
                                            )}
                                        </div>
                                        <div className="text-lg font-numerics font-bold text-gold-500">
                                            {formatPrice(property.price, property.currency)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
