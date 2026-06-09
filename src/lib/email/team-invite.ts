import type { AdminRole } from "@/lib/auth";
import { sendOperationalEmail } from "@/lib/email";

interface TeamInviteEmailInput {
  to: string;
  fullName: string;
  role: AdminRole;
  actionLink: string;
}

export async function sendTeamInviteEmail(input: TeamInviteEmailInput) {
  return sendOperationalEmail({
    to: input.to,
    subject: `Bienvenido a Black Capital, ${input.fullName}`,
    html: renderTeamInviteEmail(input),
  });
}

function renderTeamInviteEmail(input: TeamInviteEmailInput) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const panelUrl = `${siteUrl}/admin`;
  const isAdmin = input.role === "admin";
  const roleLabel = isAdmin ? "Administrador" : "Agente";
  const headline = isAdmin
    ? "Tu acceso completo al panel ya esta listo."
    : "Tu acceso al panel de agente ya esta listo.";
  const description = isAdmin
    ? "Podrás gestionar inventario, leads, equipo, configuración y operación interna desde un solo panel."
    : "Podrás gestionar tu actividad comercial, leads asignados e inventario relacionado desde el panel interno.";
  const capabilityItems = isAdmin
    ? ["Publicar y editar propiedades", "Administrar leads y asignaciones", "Gestionar equipo y configuración"]
    : ["Consultar tus leads asignados", "Gestionar propiedades relacionadas", "Actualizar tu información profesional"];

  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bienvenido a Black Capital</title>
  </head>
  <body style="margin:0;background:#050505;padding:0;font-family:'Manrope',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Configura tu contraseña y entra al panel interno de Black Capital.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border:1px solid rgba(227,187,63,.26);background:#0b0b0b;">
            <tr>
              <td style="padding:34px 34px 26px;border-bottom:1px solid rgba(255,255,255,.08);background:#080808;">
                <div style="font-size:2rem;font-weight:800;line-height:0.94;letter-spacing:0.045em;word-spacing:0.08em;text-transform:uppercase;color:#ffffff;">
                  Black Capital
                </div>
                <div style="margin-top:10px;color:#e3bb3f;font-size:0.75rem;font-weight:700;line-height:1;letter-spacing:0.1em;word-spacing:0.08em;text-transform:uppercase;">
                  Panel interno
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 34px 10px;">
                <p style="margin:0 0 14px;color:#e3bb3f;font-size:0.75rem;font-weight:700;line-height:1;letter-spacing:0.1em;word-spacing:0.08em;text-transform:uppercase;">
                  Acceso de ${roleLabel}
                </p>
                <h1 style="margin:0;color:#ffffff;font-size:clamp(1.125rem, 1.6vw, 1.5rem);line-height:1.18;letter-spacing:-0.01em;word-spacing:0.02em;font-weight:700;">
                  ${headline}
                </h1>
                <p style="margin:18px 0 0;color:rgba(255,255,255,.74);font-size:1rem;line-height:1.72;letter-spacing:0;word-spacing:0.025em;font-weight:400;max-width:68ch;margin-bottom:1.1em;">
                  Hola, ${input.fullName}. Tu perfil fue dado de alta en Black Capital. Antes de entrar, configura tu contraseña desde el botón principal.
                </p>
                <p style="margin:14px 0 0;color:rgba(255,255,255,.66);font-size:1rem;line-height:1.72;letter-spacing:0;word-spacing:0.025em;font-weight:400;max-width:68ch;margin-bottom:1.1em;">
                  ${description}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 34px 4px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);">
                  ${capabilityItems.map((item) => `
                    <tr>
                      <td style="width:34px;padding:14px 0 14px 18px;color:#e3bb3f;font-size:1rem;line-height:1.45;letter-spacing:0;word-spacing:0.03em;font-weight:500;">
                        •
                      </td>
                      <td style="padding:14px 18px 14px 0;color:rgba(255,255,255,.72);font-size:0.95rem;line-height:1.45;letter-spacing:0;word-spacing:0.03em;font-weight:500;">
                        ${item}
                      </td>
                    </tr>
                  `).join("")}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 34px 10px;">
                <a href="${input.actionLink}" style="display:inline-block;background:#e3bb3f;color:#080808;text-decoration:none;padding:14px 24px;border-radius:999px;font-size:0.8125rem;font-weight:700;line-height:1;letter-spacing:0.08em;word-spacing:0.1em;text-transform:uppercase;">
                  Configurar contraseña
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 34px 34px;">
                <p style="margin:0;color:rgba(255,255,255,.52);font-size:0.8125rem;line-height:1.3;letter-spacing:0.02em;word-spacing:0.04em;">
                  Después de configurar tu contraseña, entra al panel desde:
                  <br />
                  <a href="${panelUrl}" style="color:#e3bb3f;text-decoration:none;">${panelUrl}</a>
                </p>
                <p style="margin:18px 0 0;color:rgba(255,255,255,.38);font-size:0.75rem;line-height:1.5;letter-spacing:0.01em;word-spacing:0.03em;">
                  Si no esperabas este correo, puedes ignorarlo. Este enlace fue generado para configurar tu acceso interno.
                </p>
              </td>
            </tr>
          </table>

          <p style="max-width:680px;margin:16px auto 0;color:rgba(255,255,255,.32);font-size:0.75rem;line-height:1.5;letter-spacing:0.01em;word-spacing:0.03em;text-align:center;">
            Black Capital · Tijuana, Baja California
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
