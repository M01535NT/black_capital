import { requireAdminSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPageHeader, adminCardClass } from "@/components/admin/admin-ui";
import { AgentStatusToggle } from "@/components/admin/agent-status-toggle";
import { AccountEmailForm } from "./email-form";
import { AccountPasswordForm } from "./password-form";
import { AccountProfileForm } from "./profile-form";
import { AccountPreferencesForm } from "./preferences-form";

export const revalidate = 0;

export default async function AccountPage() {
  const profile = await requireAdminSession();
  const supabase = createAdminClient();
  const { data: agent } = profile.agent_id
    ? await supabase
      .from("agents")
      .select("id, full_name, phone, photo_url, license_number, bio, is_active")
      .eq("id", profile.agent_id)
      .maybeSingle()
    : { data: null };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <AdminPageHeader
        eyebrow="Cuenta"
        title="Mi cuenta"
        description="Administra tu acceso personal al panel."
      />

      <section className={`${adminCardClass} p-5 sm:p-6`}>
        <div className="border-b border-white/[0.06] pb-5">
          <p className="text-caption text-[var(--color-accent)]">
            Perfil público
          </p>
          <h2 className="mt-2 text-display-3 text-white">Información profesional</h2>
          <p className="mt-1 text-body-sm text-white/50">
            Estos datos alimentan tu perfil público y la información visible en asignaciones.
          </p>
        </div>
        <div className="mt-6">
          <div className="mb-6 border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-xl font-bold text-[var(--color-accent)]">
                {agent?.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- External profile URLs are user-managed and may not be whitelisted for next/image.
                  <img src={agent.photo_url} alt={agent.full_name || profile.full_name} className="h-full w-full object-cover" />
                ) : (
                  (agent?.full_name || profile.full_name).charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-caption text-white/38">Vista previa</p>
                <h3 className="mt-1 truncate text-display-3 font-semibold text-white">{agent?.full_name || profile.full_name}</h3>
                <p className="mt-1 text-body-sm text-white/50">{agent?.phone || "Sin teléfono público"}</p>
                <p className="mt-3 line-clamp-3 text-body text-white/58">
                  {agent?.bio || "Agrega una bio para que el perfil público tenga contexto profesional."}
                </p>
              </div>
            </div>
          </div>
          <AccountProfileForm
            initialData={{
              full_name: agent?.full_name || profile.full_name,
              phone: agent?.phone || "",
              photo_url: agent?.photo_url || "",
              license_number: agent?.license_number || "",
              bio: agent?.bio || "",
            }}
          />
        </div>
      </section>

      <section className={`${adminCardClass} p-5 sm:p-6`}>
        <div className="border-b border-white/[0.06] pb-5">
          <p className="text-caption text-white/48">
            Acceso
          </p>
          <h2 className="mt-2 text-display-3 text-white">Correo y contraseña</h2>
          <p className="mt-1 text-body-sm text-white/50">Tu acceso actual es {profile.email}</p>
        </div>

        <AccountEmailForm currentEmail={profile.email} />
        <div className="mt-8 border-t border-white/[0.06] pt-2">
          <AccountPasswordForm />
        </div>
      </section>

      <section className={`${adminCardClass} p-5 sm:p-6`}>
        <div className="border-b border-white/[0.06] pb-5">
          <p className="text-caption text-white/48">
            Preferencias
          </p>
          <h2 className="mt-2 text-display-3 text-white">Panel y notificaciones</h2>
          <p className="mt-1 text-body-sm text-white/50">
            Ajustes personales de experiencia. Se guardan en este dispositivo.
          </p>
        </div>
        <div className="mt-6">
          <AccountPreferencesForm profileId={profile.id} />
        </div>
      </section>

      {agent && (
        <section className={`${adminCardClass} p-5 sm:p-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-caption text-white/48">
                Estado operativo
              </p>
              <h2 className="mt-2 text-display-3 text-white">
                {agent.is_active ? "Agente activo" : "Agente inactivo"}
              </h2>
              <p className="mt-1 text-body-sm text-white/50">
                Este estado controla si apareces como agente disponible para asignaciones y catálogo.
              </p>
            </div>
            <AgentStatusToggle agentId={agent.id} initialActive={!!agent.is_active} />
          </div>
        </section>
      )}
    </div>
  );
}

