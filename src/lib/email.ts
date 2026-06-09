import { logger } from "@/lib/logger";

export async function sendOperationalEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_placeholder") {
    logger.error("email", "Resend is not configured; operational email was not sent", { to, subject });
    return { skipped: true, reason: "RESEND_API_KEY no está configurada." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "Black Capital <notificaciones@blackmx.vercel.app>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error("email", "Resend operational email failed", body);
    return { skipped: false, error: body };
  }

  return { skipped: false };
}
