     1|// eslint-disable-next-line @typescript-eslint/no-unused-vars
     2|import { PropertyForm } from "@/components/admin/property-form";
     3|import { ChevronLeft } from "lucide-react";
     4|import Link from "next/link";
     5|import { Button } from "@/components/ui/button";
     6|
     7|export default function NewPropertyPage() {
     8|    return (
     9|        <div className="max-w-3xl mx-auto w-full space-y-6">
    10|            <div className="flex items-center gap-4">
    11|                <Link href="/admin/properties">
    12|                    <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
    13|                        <ChevronLeft className="h-4 w-4" />
    14|                    </Button>
    15|                </Link>
    16|                <div>
    17|                    <h2 className="section-heading text-3xl text-foreground">Nueva Propiedad</h2>
    18|                    <p className="text-foreground/50">Completa los datos para agregar una propiedad al inventario.</p>
    19|                </div>
    20|            </div>
    21|
    22|            <div className="bg-card border border-foreground/10 rounded-xl p-6 shadow-sm">
    23|                <PropertyForm />
    24|            </div>
    25|        </div>
    26|    );
    27|}
    28|