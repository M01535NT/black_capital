"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const interestOptions = [
  "Comprar",
  "Vender",
  "Rentar",
  "Saber cuánto puede valer",
  "Revisar factibilidad",
  "Preparar venta",
  "Fotos y video para vender",
] as const;

export function ContactLeadForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const defaultInterest =
    searchParams.get("servicio") === "opinion-de-valor"
      ? "Saber cuánto puede valer"
      : searchParams.get("servicio") === "dictamen-factibilidad"
        ? "Revisar factibilidad"
        : searchParams.get("servicio") === "plan-comercializacion"
          ? "Preparar venta"
          : searchParams.get("servicio") === "fotografia-video"
            ? "Fotos y video para vender"
            : searchParams.get("objetivo") === "vender"
              ? "Vender"
              : searchParams.get("objetivo") === "comprar"
                ? "Comprar"
                : "Comprar";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capturar el form antes del await: React anula currentTarget al terminar
    // el dispatch y el reset() posterior lanzaría, marcando error un envío exitoso.
    const form = event.currentTarget;
    setStatus("submitting");

    const formData = new FormData(form);
    const payload = {
      company_honeypot: formData.get("company_honeypot"),
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      privacy_accepted: formData.get("privacy_accepted") === "on",
      source: "organic",
      status: "new",
      notes: `Contacto web - Interés: ${formData.get("interest") || "No especificado"}. ${formData.get("message") || ""}`,
    };

    try {
      const response = await fetch("/api/public-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("No se pudo registrar");

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[var(--color-accent)]/30 bg-white/[0.03] p-8" role="status">
        <CheckCircle2 className="mb-5 h-9 w-9 text-[var(--color-accent)]" />
        <h3 className="mb-3 text-display-3 text-white">Solicitud registrada</h3>
        <p className="text-body text-white/65 leading-relaxed">
          Recibimos tus datos. Te contactamos para entender qué buscas y orientarte con el siguiente paso.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-5">
      <input
        type="text"
        name="company_honeypot"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
        <Input
          name="full_name"
          required
          minLength={2}
          placeholder="Nombre completo"
          aria-label="Nombre completo"
          autoComplete="name"
          className="h-11 rounded-none border-white/12 bg-white/[0.035] sm:h-12"
        />
        <Input
          name="email"
          required
          type="email"
          placeholder="Correo"
          aria-label="Correo electrónico"
          autoComplete="email"
          className="h-11 rounded-none border-white/12 bg-white/[0.035] sm:h-12"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
        <Input
          name="phone"
          type="tel"
          placeholder="WhatsApp / teléfono"
          aria-label="WhatsApp o teléfono"
          autoComplete="tel"
          className="h-11 rounded-none border-white/12 bg-white/[0.035] sm:h-12"
        />
        <select
          name="interest"
          aria-label="Interés principal"
          className="h-11 border border-white/12 bg-[#0b0b0b] px-3 text-body-sm text-white/75 outline-none focus:border-[var(--color-accent)] sm:h-12 sm:text-body"
          defaultValue={defaultInterest}
        >
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name="message"
        rows={3}
        placeholder="Zona, tipo de propiedad y qué quieres hacer."
        aria-label="Mensaje: zona, tipo de propiedad y qué quieres hacer"
        className="w-full resize-none border border-white/12 bg-white/[0.035] px-3 py-3 text-body-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)] sm:text-body"
      />

      <label className="flex items-start gap-3 text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.08em] text-white/58 sm:text-caption">
        <input
          name="privacy_accepted"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
        />
        Acepto el aviso de privacidad y autorizo que me contacten sobre este mensaje.
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="brushed-gold min-h-11 w-full rounded-full px-7 text-body-sm font-bold sm:min-h-[48px] sm:w-auto sm:text-body"
        >
          {status === "submitting" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {status === "submitting" ? "Enviando" : "Enviar mensaje"}
          {status !== "submitting" ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
        </Button>
        {status === "error" ? (
          <p role="alert" className="text-body text-red-400">No se pudo enviar. Revisa los campos e intenta de nuevo.</p>
        ) : null}
      </div>
    </form>
  );
}

