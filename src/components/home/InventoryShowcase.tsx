import { getFeaturedProperties } from "@/lib/inventory";
import { InventoryClient } from "./InventoryClient";

/**
 * Inventario destacado — Server Component.
 *
 * El fetch corre en el servidor (sin useEffect, sin bundle de Supabase
 * client en el navegador). El cliente recibe los datos ya listos
 * a través de `InventoryClient` — sin skeleton flash, sin "intentar
 * de nuevo", sin JS de data fetching.
 */
export async function InventoryShowcase() {
  const { items, isLive } = await getFeaturedProperties();
  return <InventoryClient items={items} isLive={isLive} />;
}
