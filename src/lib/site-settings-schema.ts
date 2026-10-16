import { z } from "zod";
import { CONTACT_CONFIG } from "./contact-config";

export const DEFAULT_SITE_SETTINGS = {
  heroVideoUrl: "", heroImageUrl: "",
  luxuryHeroTitle: "Casas y residencias.", luxuryHeroSubtitle: "Tijuana y Rosarito. Zonas privadas, presupuesto claro y referencias de mercado.",
  businessHeroTitle: "Espacios para tu negocio.", businessHeroSubtitle: "Locales, oficinas y plazas revisadas por flujo, visibilidad, uso permitido y renta.",
  industrialHeroTitle: "Naves y bodegas en Tijuana.", industrialHeroSubtitle: "Naves y bodegas revisadas por superficie, accesos, maniobra, uso y conectividad.",
  contactPhone: String(CONTACT_CONFIG.phone), contactEmail: String(CONTACT_CONFIG.email), contactAddress: String(CONTACT_CONFIG.address),
  whatsAppTemplate: "Hola, estoy interesado en sus servicios.",
};
export type SiteSettings = typeof DEFAULT_SITE_SETTINGS;
const text = (max: number) => z.string().trim().min(1).max(max);
function validMedia(value: string, video: boolean): boolean {
  if (!value) return true;
  if (value.includes("\\") || /[\u0000-\u001f]/.test(value)) return false;
  const extension = video ? /\.(mp4|webm)$/i : /\.(png|jpe?g|webp|avif)$/i;
  if (value.startsWith("/") && !value.startsWith("//")) return extension.test(value.split("?")[0]);
  try {
    const url = new URL(value);
    const hostAllowed = url.hostname === "res.cloudinary.com" || (!video && url.hostname === "images.unsplash.com") || url.hostname.endsWith(".supabase.co");
    return url.protocol === "https:" && !url.username && !url.password && hostAllowed && (video ? extension.test(url.pathname) : (extension.test(url.pathname) || url.hostname === "images.unsplash.com"));
  } catch { return false; }
}
export const siteSettingsSchema = z.object({
  heroVideoUrl: z.string().trim().max(2048).refine(value => validMedia(value, true), "Usa un archivo MP4/WebM local o de un proveedor permitido."),
  heroImageUrl: z.string().trim().max(2048).refine(value => validMedia(value, false), "Usa una imagen local o de un proveedor permitido."),
  luxuryHeroTitle: text(180), luxuryHeroSubtitle: text(600),
  businessHeroTitle: text(180), businessHeroSubtitle: text(600),
  industrialHeroTitle: text(180), industrialHeroSubtitle: text(600),
  contactPhone: text(40).refine(value => /^[+\d\s()-]+$/.test(value) && /^\d{10,15}$/.test(value.replace(/\D/g, "")), "Teléfono inválido."),
  contactEmail: z.string().trim().email().max(254), contactAddress: text(500),
  whatsAppTemplate: text(1000),
}).strict();
export const siteSettingsPatchSchema = siteSettingsSchema.partial();
export function normalizeSiteSettings(value: unknown): SiteSettings {
  const result = { ...DEFAULT_SITE_SETTINGS };
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;
  for (const key of Object.keys(DEFAULT_SITE_SETTINGS) as (keyof SiteSettings)[]) {
    const parsed = siteSettingsSchema.shape[key].safeParse((value as Record<string, unknown>)[key]);
    if (parsed.success) result[key] = parsed.data;
  }
  return result;
}

export function contactFromSettings(settings: SiteSettings) {
  return { ...CONTACT_CONFIG, phone: settings.contactPhone, phoneRaw: settings.contactPhone.replace(/\D/g, ""), email: settings.contactEmail, address: settings.contactAddress, addressLines: [settings.contactAddress], whatsAppTemplate: settings.whatsAppTemplate };
}
