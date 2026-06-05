"use client";

import { useId, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { leadSchema, LeadFormValues } from "@/lib/validations/lead";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-400/90 mt-1.5 font-medium">
      {message}
    </p>
  );
}

export function LeadMagnet() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();
  const [company, setCompany] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      privacy_accepted: false,
      source: "organic",
      status: "new",
      notes: "",
    },
  });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const privacyValue = watch("privacy_accepted");
  const errNameId = useId();
  const errEmailId = useId();
  const errPhoneId = useId();
  const errPrivacyId = useId();

  async function onSubmit(data: LeadFormValues) {
    setIsSubmitting(true);
    posthog.capture("lead_magnet_submitted", {
      source: "homepage_cta",
      has_company: !!company,
    });
    try {
      const notes = company ? `Homepage — Empresa: ${company}` : "Homepage";
      const { error } = await supabase.from("leads").insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          privacy_accepted: true,
          source: "organic",
          status: "new",
          notes,
        },
      ]);
      if (error) throw error;
      setIsSuccess(true);
      toast.success("Solicitud enviada");
    } catch (err) {
      console.error("[LeadMagnet]", err);
      toast.error("Error al enviar. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasErr = (name: keyof LeadFormValues) => !!errors[name];
  const inputClass =
    "bg-transparent border-white/[0.08] text-white placeholder:text-white/25 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 rounded-2xl h-12 px-4 text-sm font-light";

  return (
    <section
      className="scroll-snap-section relative py-20 sm:py-28 bg-black border-t border-white/[0.04]"
      aria-labelledby="directorio-title"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="glass rounded-3xl p-8 sm:p-12 lg:p-16 border-white/[0.05]">
          {!isSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Copy */}
              <div>
                <span className="text-[11px] tracking-[0.22em] uppercase text-gold-500/75 font-semibold mb-4 block">
                  Infórmate sin compromiso
                </span>
                <h2
                  id="directorio-title"
                  className="text-3xl sm:text-4xl font-extrabold text-white leading-[1.08] tracking-[-0.02em] mb-4"
                >
                  Datos que te sirven.
                  <br />
                  <span className="text-white/35 font-light">Sin presión.</span>
                </h2>
                <p className="text-[clamp(0.875rem,1.1vw,1rem)] text-white/60 leading-relaxed mb-6 font-light">
                  Información clara para decidir con calma. Sin spam, sin llamadas insistentes.
                  Solo lo que necesitas saber.
                </p>
                <ul className="space-y-3.5 text-sm text-white/50">
                  {[
                    "Reportes de mercado cada trimestre",
                    "Propiedades nuevas con 48h de anticipación",
                    "Análisis financiero por propiedad",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 font-light">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500/70 shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-xs tracking-wider uppercase text-white/45 mb-1.5 font-semibold"
                  >
                    Nombre Completo
                  </label>
                  <Input
                    id="full_name"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    className={inputClass}
                    aria-invalid={hasErr("full_name") || undefined}
                    aria-describedby={hasErr("full_name") ? errNameId : undefined}
                    {...register("full_name")}
                    onBlur={() => trigger("full_name")}
                  />
                  <FieldError id={errNameId} message={errors.full_name?.message} />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs tracking-wider uppercase text-white/45 mb-1.5 font-semibold"
                  >
                    Empresa o Fondo{" "}
                    <span className="text-white/20 normal-case font-normal">
                      &middot; opcional
                    </span>
                  </label>
                  <Input
                    id="company"
                    placeholder="Para inversores institucionales"
                    autoComplete="organization"
                    className={inputClass}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs tracking-wider uppercase text-white/45 mb-1.5 font-semibold"
                  >
                    Correo Electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@empresa.com"
                    autoComplete="email"
                    className={inputClass}
                    aria-invalid={hasErr("email") || undefined}
                    aria-describedby={hasErr("email") ? errEmailId : undefined}
                    {...register("email")}
                    onBlur={() => trigger("email")}
                  />
                  <FieldError id={errEmailId} message={errors.email?.message} />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs tracking-wider uppercase text-white/45 mb-1.5 font-semibold"
                  >
                    Teléfono{" "}
                    <span className="text-white/20 normal-case font-normal">
                      &middot; opcional
                    </span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Te contactamos por WhatsApp"
                    autoComplete="tel"
                    className={inputClass}
                    aria-invalid={hasErr("phone") || undefined}
                    aria-describedby={hasErr("phone") ? errPhoneId : undefined}
                    {...register("phone")}
                    onBlur={() => trigger("phone")}
                  />
                  <FieldError id={errPhoneId} message={errors.phone?.message} />
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="privacy"
                    checked={privacyValue}
                    onCheckedChange={(c) => {
                      setValue("privacy_accepted", c === true, { shouldValidate: true });
                      setTimeout(() => trigger("privacy_accepted"), 100);
                    }}
                    className="border-white/15 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1 rounded-md"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-xs text-white/50 leading-relaxed cursor-pointer font-light"
                  >
                    Acepto el{" "}
                    <a
                      href="/legal/privacidad"
                      className="text-gold-500 hover:text-gold-400 underline underline-offset-2"
                    >
                      Aviso de Privacidad
                    </a>{" "}
                    y consiento el tratamiento de mis datos.
                  </label>
                </div>
                <FieldError id={errPrivacyId} message={errors.privacy_accepted?.message} />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full brushed-gold text-black text-sm font-semibold tracking-wider uppercase py-6 rounded-2xl transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                >
                  {isSubmitting ? "Enviando..." : "Quiero Información"}
                </Button>
              </form>
            </div>
          ) : (
            <div role="status" className="text-center py-12">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-[-0.01em]">
                Recibido. Te contactamos pronto.
              </h3>
              <p className="text-white/55 max-w-md mx-auto font-light">
                En menos de 24 horas recibirás acceso a nuestro directorio con información clara y
                sin letras chiquitas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
