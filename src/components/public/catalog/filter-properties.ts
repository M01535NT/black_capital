import type { PropertyCardData } from "@/components/property/PropertyCard";
import type { Filters } from "./constants";

export function filterProperties(properties: PropertyCardData[], filters: Filters): PropertyCardData[] {
    const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const q = normalize(filters.q);
    const zone = normalize(filters.zona);
    const result = properties.filter((p) => {
      const searchable = normalize(`${p.title} ${p.address ?? ""} ${p.property_use} ${p.property_type ?? ""} ${p.business_type}`);
      if (zone && !normalize(p.address ?? "").includes(zone)) return false;
      if (q && !searchable.includes(q)) return false;
      if (filters.propiedad && !(p.property_type ?? "").toLowerCase().includes(filters.propiedad.toLowerCase())) return false;
      if (filters.tipo && p.business_type.toLowerCase() !== filters.tipo.toLowerCase()) return false;
      if (filters.uso && p.property_use !== filters.uso) return false;
      if (filters.estatus && p.status !== filters.estatus) return false;
      if (filters.moneda && p.currency !== filters.moneda) return false;
      if (filters.moneda && filters.precioMin && p.price < Number(filters.precioMin)) return false;
      if (filters.moneda && filters.precioMax && p.price > Number(filters.precioMax)) return false;
      const area = Math.max(p.m2_terrain || 0, p.m2_construction || 0);
      if (filters.m2Min && area < Number(filters.m2Min)) return false;
      return true;
    });

    if (filters.moneda && filters.orden === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (filters.moneda && filters.orden === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (filters.orden === "terrain_desc") result.sort((a, b) => (b.m2_terrain || 0) - (a.m2_terrain || 0));
    else if (filters.orden === "construction_desc") result.sort((a, b) => (b.m2_construction || 0) - (a.m2_construction || 0));
    else if (filters.orden === "featured") result.sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)));

    return result;
}
