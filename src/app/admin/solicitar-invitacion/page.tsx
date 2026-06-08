"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormValues = {
  full_name: string;
  email: string;
  phone: string;
  age: string;
  operating_city: string;
  profile_photo_url: string;
  social_instagram: string;
  social_tiktok: string;
  social_linkedin: string;
  years_experience: string;
  current_company: string;
  internal_reference: string;
  specialties: string[];
  company_honeypot: string;
};

const requiredMark = <span className="ml-1 text-[#e3bb3f]">*</span>;
const specialtyOptions = ["Residencial", "Comercial", "Industrial"];

const initialValues: FormValues = {
  full_name: "",
  email: "",
  phone: "",
  age: "",
  operating_city: "",
  profile_photo_url: "",
  social_instagram: "",
  social_tiktok: "",
  social_linkedin: "",
  years_experience: "",
  current_company: "",
  internal_reference: "",
  specialties: [],
  company_honeypot: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function SolicitarInvitacionPage() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);

  function updateField(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function toggleSpecialty(option: string, checked: boolean) {
    setValues((current) => {
      const specialties = checked
        ? [...new Set([...current.specialties, option])]
        : current.specialties.filter((item) => item !== option);
      return { ...current, specialties };
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setWarnings([]);

    const response = await fetch("/api/admin-access-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json().catch(() => ({} as { error?: string; warnings?: string[] }));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "No se pudo enviar la solicitud. Revisa los campos e intenta de nuevo.");
      return;
    }

    setStatus("success");
    setValues(initialValues);
    setWarnings(payload?.warnings || []);
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 border border-white/[0.08] bg-white/[0.025] p-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--color-accent)]" />
          <h1 className="text-2xl font-light text-white">Solicitud enviada</h1>
          <p className="text-sm text-white/65">
            Recibimos tu solicitud de acceso como agente.
            Te contactaremos para finalizar el registro.
          </p>
          {warnings.length > 0 ? (
            <ul className="space-y-2 text-left text-xs text-white/55">
              {warnings.map((item) => (
                <li key={item} className="rounded-full border border-white/10 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <Link href="/admin/login" className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold">
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-light text-white">Solicitud de acceso para agentes</h1>
          <p className="mt-3 text-sm leading-6 text-white/55">
            Completa este formulario para que un administrador te habilite acceso al panel.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 border border-white/[0.08] bg-white/[0.025] p-6">
          <input
            type="text"
            name="company_honeypot"
            value={values.company_honeypot}
            onChange={(event) => updateField("company_honeypot", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Nombre completo {requiredMark}</span>
              <Input
                required
                minLength={2}
                value={values.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                autoComplete="name"
                placeholder="Nombre y apellido"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>
            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Correo {requiredMark}</span>
              <Input
                required
                type="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                placeholder="correo@empresa.com"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Teléfono / WhatsApp {requiredMark}</span>
              <Input
                required
                type="tel"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                autoComplete="tel"
                placeholder="+52..."
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>

            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Edad {requiredMark}</span>
              <Input
                required
                value={values.age}
                onChange={(event) => updateField("age", event.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Ej: 32"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Ciudad / zona de operación {requiredMark}</span>
              <Input
                required
                value={values.operating_city}
                onChange={(event) => updateField("operating_city", event.target.value)}
                placeholder="Tijuana, BC"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>

            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Años de experiencia</span>
              <Input
                value={values.years_experience}
                onChange={(event) => updateField("years_experience", event.target.value)}
                inputMode="numeric"
                placeholder="Ej: 3"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>
          </div>

          <fieldset className="space-y-2 border border-white/[0.08] bg-white/[0.02] p-4">
            <legend className="px-2 text-sm text-white/80">Especialidad (opcional)</legend>
            <p className="text-xs text-white/55">Selecciona una o más líneas para clasificar su foco.</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
              {specialtyOptions.map((option) => {
                const checked = values.specialties.includes(option);
                return (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => toggleSpecialty(option, event.target.checked)}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="space-y-1">
            <span className="mb-1 block text-sm text-white/75">Foto de perfil</span>
            <Input
              type="url"
              value={values.profile_photo_url}
              onChange={(event) => updateField("profile_photo_url", event.target.value)}
              placeholder="https://.../foto.jpg"
              className="h-12 rounded-none border-white/12 bg-white/[0.035]"
            />
            <p className="text-xs text-white/50">Enlace público a imagen de perfil (opcional).</p>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Instagram</span>
              <Input
                type="url"
                value={values.social_instagram}
                onChange={(event) => updateField("social_instagram", event.target.value)}
                placeholder="https://instagram.com/usuario"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>

            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">TikTok</span>
              <Input
                type="url"
                value={values.social_tiktok}
                onChange={(event) => updateField("social_tiktok", event.target.value)}
                placeholder="https://tiktok.com/@usuario"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>
          </div>

          <label className="space-y-1">
            <span className="mb-1 block text-sm text-white/75">LinkedIn</span>
            <Input
              type="url"
              value={values.social_linkedin}
              onChange={(event) => updateField("social_linkedin", event.target.value)}
              placeholder="https://linkedin.com/in/usuario"
              className="h-12 rounded-none border-white/12 bg-white/[0.035]"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Empresa actual / broker</span>
              <Input
                value={values.current_company}
                onChange={(event) => updateField("current_company", event.target.value)}
                placeholder="Nombre de marca o empresa"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>

            <label className="space-y-1">
              <span className="mb-1 block text-sm text-white/75">Referencia interna</span>
              <Input
                value={values.internal_reference}
                onChange={(event) => updateField("internal_reference", event.target.value)}
                placeholder="Clave o referencia interna"
                className="h-12 rounded-none border-white/12 bg-white/[0.035]"
              />
            </label>
          </div>

          <p className="text-xs text-white/45">Los campos con * son obligatorios.</p>

          {status === "error" && message ? <p className="text-sm text-red-400">{message}</p> : null}
          <Button type="submit" disabled={status === "submitting"} className="brushed-gold min-h-[48px] w-full rounded-full font-bold">
            {status === "submitting" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {status === "submitting" ? "Enviando solicitud" : "Enviar solicitud"}
          </Button>

          <Link href="/admin/login" className="inline-flex items-center justify-center gap-2 text-sm text-white/60 transition-colors hover:text-[var(--color-accent)]">
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>
        </form>
      </div>
    </div>
  );
}
