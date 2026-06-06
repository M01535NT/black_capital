import { redirect } from "next/navigation";

export default function BusinessInventarioPage() {
    redirect("/inventario?uso=Comercial");
}
