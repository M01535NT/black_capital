"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const interestOptions = [
  "Residencial",
  "Comercial",
  "Industrial",
  "Vender propiedad",
] as const;

export function ContactLeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
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

      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[var(--color-accent)]/30 bg-white/[0.03] p-8" role="status">
        <CheckCircle2 className="mb-5 h-9 w-9 text-[var(--color-accent)]" />
        <h3 className="mb-3 text-2xl font-light text-white">Solicitud registrada</h3>
        <p className="text-sm leading-6 text-white/65">
          Recibimos tus datos. El siguiente paso es validar tu necesidad y preparar opciones para seguimiento comercial.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input
        type="text"
        name="company_honeypot"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          name="full_name"
          required
          minLength={2}
          placeholder="Nombre completo"
          autoComplete="name"
          className="h-12 rounded-none border-white/12 bg-white/[0.035]"
        />
        <Input
          name="email"
          required
          type="email"
          placeholder="Correo"
          autoComplete="email"
          className="h-12 rounded-none border-white/12 bg-white/[0.035]"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          name="phone"
          type="tel"
          placeholder="WhatsApp / teléfono"
          autoComplete="tel"
          className="h-12 rounded-none border-white/12 bg-white/[0.035]"
        />
        <select
          name="interest"
          className="h-12 border border-white/12 bg-[#0b0b0b] px-3 text-sm text-white/75 outline-none focus:border-[var(--color-accent)]"
          defaultValue="Residencial"
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
        rows={4}
        placeholder="Cuéntanos qué estás buscando: zona, presupuesto, operación o tipo de inmueble."
        className="w-full resize-none border border-white/12 bg-white/[0.035] px-3 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--color-accent)]"
      />

      <label className="flex items-start gap-3 text-xs leading-5 text-white/58">
        <input
          name="privacy_accepted"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
        />
        Acepto el aviso de privacidad y autorizo que me contacten para seguimiento comercial.
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="brushed-gold min-h-[48px] w-full rounded-full px-7 text-sm font-bold sm:w-auto"
        >
          {status === "submitting" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {status === "submitting" ? "Enviando" : "Enviar solicitud"}
          {status !== "submitting" ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
        </Button>
        {status === "error" ? (
          <p className="text-sm text-red-400">No se pudo enviar. Revisa los campos e intenta de nuevo.</p>
        ) : null}
      </div>
    </form>
  );
}
