// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PropertyForm } from "@/components/admin/property-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewPropertyPage() {
    return (
        <div className="max-w-3xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/properties">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-display font-bold text-foreground">Nueva Propiedad</h2>
                    <p className="text-foreground/50">Completa los datos para agregar una propiedad al inventario.</p>
                </div>
            </div>

            <div className="bg-card border border-foreground/10 rounded-xl p-6 shadow-sm">
                <PropertyForm />
            </div>
        </div>
    );
}
