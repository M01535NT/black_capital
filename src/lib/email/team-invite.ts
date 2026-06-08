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
    ? "Podras gestionar inventario, leads, equipo, configuracion y operacion interna desde un solo panel."
    : "Podras gestionar tu actividad comercial, leads asignados e inventario relacionado desde el panel interno.";
  const capabilityItems = isAdmin
    ? ["Publicar y editar propiedades", "Administrar leads y asignaciones", "Gestionar equipo y configuracion"]
    : ["Consultar tus leads asignados", "Gestionar propiedades relacionadas", "Actualizar tu informacion profesional"];

  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bienvenido a Black Capital</title>
  </head>
  <body style="margin:0;background:#050505;padding:0;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Configura tu contrasena y entra al panel interno de Black Capital.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border:1px solid rgba(227,187,63,.26);background:#0b0b0b;">
            <tr>
              <td style="padding:34px 34px 26px;border-bottom:1px solid rgba(255,255,255,.08);background:#080808;">
                <div style="font-size:30px;font-weight:700;line-height:1;letter-spacing:.08em;text-transform:uppercase;color:#ffffff;">
                  Black Capital
                </div>
                <div style="margin-top:10px;color:#e3bb3f;font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;">
                  Panel interno
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 34px 10px;">
                <p style="margin:0 0 14px;color:#e3bb3f;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;">
                  Acceso de ${roleLabel}
                </p>
                <h1 style="margin:0;color:#ffffff;font-size:31px;line-height:1.18;font-weight:400;">
                  ${headline}
                </h1>
                <p style="margin:18px 0 0;color:rgba(255,255,255,.74);font-size:15px;line-height:1.75;">
                  Hola, ${input.fullName}. Tu perfil fue dado de alta en Black Capital. Antes de entrar, configura tu contrasena desde el boton principal.
                </p>
                <p style="margin:14px 0 0;color:rgba(255,255,255,.66);font-size:15px;line-height:1.75;">
                  ${description}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 34px 4px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);">
                  ${capabilityItems.map((item) => `
                    <tr>
                      <td style="width:34px;padding:14px 0 14px 18px;color:#e3bb3f;font-size:16px;line-height:1;">•</td>
                      <td style="padding:14px 18px 14px 0;color:rgba(255,255,255,.72);font-size:14px;line-height:1.5;">${item}</td>
                    </tr>
                  `).join("")}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 34px 10px;">
                <a href="${input.actionLink}" style="display:inline-block;background:#e3bb3f;color:#080808;text-decoration:none;padding:14px 24px;border-radius:999px;font-size:14px;font-weight:700;">
                  Configurar contrasena
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 34px 34px;">
                <p style="margin:0;color:rgba(255,255,255,.52);font-size:13px;line-height:1.7;">
                  Despues de configurar tu contrasena, entra al panel desde:
                  <br />
                  <a href="${panelUrl}" style="color:#e3bb3f;text-decoration:none;">${panelUrl}</a>
                </p>
                <p style="margin:18px 0 0;color:rgba(255,255,255,.38);font-size:12px;line-height:1.6;">
                  Si no esperabas este correo, puedes ignorarlo. Este enlace fue generado para configurar tu acceso interno.
                </p>
              </td>
            </tr>
          </table>

          <p style="max-width:680px;margin:16px auto 0;color:rgba(255,255,255,.32);font-size:11px;line-height:1.6;text-align:center;">
            Black Capital · Tijuana, Baja California
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
