import { requireAdminSession } from "@/lib/auth";
import { AdminPageHeader, adminCardClass } from "@/components/admin/admin-ui";
import { AccountPasswordForm } from "./password-form";

export const revalidate = 0;

export default async function AccountPage() {
  const profile = await requireAdminSession();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <AdminPageHeader
        eyebrow="Cuenta"
        title="Mi cuenta"
        description="Administra tu acceso personal al panel."
      />

      <section className={`${adminCardClass} p-5 sm:p-6`}>
        <div className="border-b border-white/[0.06] pb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/48">
            Acceso
          </p>
          <h2 className="mt-2 text-xl font-light text-white">{profile.full_name}</h2>
          <p className="mt-1 text-sm text-white/50">{profile.email}</p>
        </div>

        <AccountPasswordForm />
      </section>
    </div>
  );
}
