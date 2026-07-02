import { PropertyForm } from "@/components/admin/property-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { requireAdminRole } from "@/lib/auth";
import { getFaqCatalog } from "@/lib/faq-catalog";

export default async function NewPropertyPage() {
    await requireAdminRole();
    const faqCatalog = await getFaqCatalog();
    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <AdminPageHeader eyebrow="Inventario" title="Nueva propiedad" description="Agrega un activo al catálogo público y define su estado comercial." />
            <PropertyForm faqCatalog={faqCatalog} />
        </div>
    );
}
