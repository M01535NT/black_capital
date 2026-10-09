"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadSchema } from "@/lib/validations/lead";

const interestOptions = ["Comprar", "Vender", "Rentar", "Consultar una propiedad", "Solicitar una visita", "Asesoría", "Saber cuánto puede valer", "Revisar factibilidad", "Preparar venta", "Fotos y video para vender"];
const services: Record<string, string> = {
  "opinion-de-valor": "Saber cuánto puede valer",
  "dictamen-factibilidad": "Revisar factibilidad",
  "plan-comercializacion": "Preparar venta",
  "fotografia-video": "Fotos y video para vender",
};
const goals: Record<string, string> = {
  vender: "Vender", comprar: "Comprar", rentar: "Rentar", renta: "Rentar",
  "poner-en-renta": "Rentar", "consultar-propiedad": "Consultar una propiedad",
  "solicitar-visita": "Solicitar una visita", asesoria: "Asesoría", invertir: "Asesoría",
};
const fieldClass = "h-11 w-full rounded-none border border-white/12 bg-[#0b0b0b] px-3 text-body-sm text-white outline-none focus:border-[var(--color-accent)] sm:h-12 sm:text-body";
const inputClass = "h-11 rounded-none border-white/12 bg-white/[0.035] sm:h-12";
const labelClass = "block space-y-2 text-body-sm text-white/75";

export function ContactLeadForm({ ownerGoal, onOwnerGoalChange }: {
  ownerGoal?: string;
  onOwnerGoalChange?: (goal: string) => void;
}) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [propertyRemoved, setPropertyRemoved] = useState(false);
  const isOwner = ownerGoal !== undefined;
  const service = searchParams.get("servicio") || searchParams.get("service") || "";
  const objective = searchParams.get("objetivo") || "";
  const brand = searchParams.get("brand") || "";
  const property = searchParams.get("property") || "";
  const title = searchParams.get("title") || searchParams.get("propiedad") || property || searchParams.get("property_id") || "";
  const candidateId = searchParams.get("property_id") || property;
  const propertyId = candidateId && leadSchema.shape.property_id.safeParse(candidateId).success ? candidateId : undefined;
  const hasProperty = !propertyRemoved && !!(title || propertyId);
  const defaultInterest = services[service] || goals[objective] || "Comprar";
  const context = [
    brand ? `Segmento: ${brand}` : "",
    service ? `Servicio: ${service}` : "",
    objective ? `Objetivo de origen: ${objective}` : "",
    ...["contexto", "interes", "calculadora", "busqueda"].map((key) => searchParams.get(key) ? `${key}: ${searchParams.get(key)}` : ""),
  ].filter(Boolean);
  const calculatorLabels: Record<string, string> = { roi: "Rendimiento de renta", hipoteca: "Hipoteca", flipping: "Compra y remodelación", isai: "Impuestos" };
  const contextLabels = [
    ({ luxury: "Black Luxury", business: "Black Business", industrial: "Black Industrial" } as Record<string, string>)[brand],
    services[service],
    goals[objective],
    calculatorLabels[searchParams.get("calculadora") || ""],
  ].filter(Boolean);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const notes = [
      isOwner ? "Solicitud de propietario" : "Contacto web",
      `Interés: ${formData.get("interest") || "No especificado"}`,
      ...context,
      hasProperty ? `Inmueble: ${title}${property && property !== title ? ` (${property})` : ""}` : "",
      isOwner ? `Tipo: ${formData.get("property_type")}. Zona: ${formData.get("zone")}` : "",
      formData.get("message") || "",
    ].filter(Boolean).join(". ");
    const source = brand === "luxury" ? "landing_luxury" : brand === "business" ? "landing_business" : brand === "industrial" ? "landing_industrial" : "organic";
    const payload = {
      company_honeypot: formData.get("company_honeypot"),
      full_name: String(formData.get("full_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: formData.get("phone") || "",
      privacy_accepted: formData.get("privacy_accepted") === "on",
      source, status: "new", notes,
      ...(hasProperty && propertyId ? { property_id: propertyId } : {}),
    };
    const validation = leadSchema.safeParse(payload);
    if (!validation.success) {
      setErrorMessage(validation.error.issues.map((issue) => issue.message).join(". "));
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/public-leads", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setErrorMessage(response.status === 429 ? "Hay demasiadas solicitudes. Espera un minuto y vuelve a intentar." : "No se pudo enviar. Intenta de nuevo o contáctanos por WhatsApp.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMessage("No se pudo conectar. Revisa tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  }

  if (status === "success") return (
    <div className="border border-[var(--color-accent)]/30 bg-white/[0.03] p-6 sm:p-8" role="status">
      <CheckCircle2 className="mb-5 h-9 w-9 text-[var(--color-accent)]" aria-hidden="true" />
      <h3 className="mb-3 text-display-3 text-white">Solicitud registrada</h3>
      <p className="text-body leading-relaxed text-white/65">
        {isOwner ? "Revisaremos el tipo de inmueble, la zona y tu objetivo. Te contactaremos por correo o al teléfono que compartiste para acordar una primera conversación y definir el siguiente paso." : "Te contactaremos por correo o al teléfono que compartiste para revisar tu consulta y acordar el siguiente paso."}
      </p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label={isOwner ? "Solicitud para propietarios" : "Solicitud de contacto"}>
      <input type="text" name="company_honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {hasProperty && <div className="flex items-start justify-between gap-4 border border-[var(--color-accent)]/30 bg-white/[0.03] p-4">
        <div className="min-w-0"><p className="property-tag-type text-[var(--color-accent)]">Tu consulta sobre</p><p className="mt-2 break-words text-body text-white">{title}</p></div>
        <button type="button" onClick={() => setPropertyRemoved(true)} aria-label="Quitar inmueble" className="shrink-0 p-2 text-white/70 hover:text-white focus-visible:outline focus-visible:outline-[var(--color-accent)]"><X className="h-5 w-5" /></button>
        {propertyId && <input type="hidden" name="property_id" value={propertyId} />}
      </div>}
      {contextLabels.length > 0 && <p className="break-words text-body-sm text-white/55">{contextLabels.join(" · ")}</p>}
      {isOwner && <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Tipo de inmueble<select name="property_type" required defaultValue="" className={fieldClass}><option value="" disabled>Selecciona un tipo</option>{["Casa", "Departamento", "Terreno", "Local comercial", "Oficina", "Bodega o nave", "Otro"].map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className={labelClass}>Zona o colonia<Input name="zone" required maxLength={160} className={inputClass} placeholder="Ej. Zona Río, Tijuana" /></label>
      </div>}
      <label className={labelClass}>{isOwner ? "Objetivo" : "Interés principal"}
        {isOwner ? <select name="interest" value={ownerGoal} onChange={(event) => onOwnerGoalChange?.(event.target.value)} className={fieldClass}><option>Vender</option><option>Poner en renta</option></select> : <select name="interest" defaultValue={defaultInterest} className={fieldClass}>{interestOptions.map((option) => <option key={option}>{option}</option>)}</select>}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Nombre completo<Input name="full_name" required minLength={2} maxLength={160} autoComplete="name" className={inputClass} /></label>
        <label className={labelClass}>Correo electrónico<Input name="email" required type="email" autoComplete="email" className={inputClass} /></label>
      </div>
      <label className={labelClass}>WhatsApp o teléfono <span className="text-white/45">(opcional)</span><Input name="phone" type="tel" autoComplete="tel" aria-label="WhatsApp o teléfono" className={inputClass} /></label>
      {!isOwner && <label className={labelClass}>Cuéntanos qué necesitas <span className="text-white/45">(opcional)</span><textarea name="message" rows={3} maxLength={4000} placeholder="Zona, tipo de propiedad y qué quieres hacer." className="w-full resize-y border border-white/12 bg-white/[0.035] px-3 py-3 text-body-sm text-white outline-none focus:border-[var(--color-accent)] sm:text-body" /></label>}
      <label className="flex items-start gap-3 text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.08em] text-white/58 sm:text-caption">
        <input name="privacy_accepted" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
        <span>Acepto el <Link href="/legal/aviso-privacidad" className="underline underline-offset-4">aviso de privacidad</Link> y autorizo que me contacten sobre este mensaje.</span>
      </label>
      {status === "error" && <p role="alert" className="text-body text-red-400">{errorMessage} Tus datos se conservan.</p>}
      <Button type="submit" disabled={status === "submitting"} className="brushed-gold min-h-11 w-full rounded-full px-7 text-body-sm font-bold sm:min-h-[48px] sm:w-auto sm:text-body">
        {status === "submitting" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {status === "submitting" ? "Enviando" : isOwner ? "Solicitar orientación" : "Enviar mensaje"}
        {status !== "submitting" && <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />}
      </Button>
    </form>
  );
}
