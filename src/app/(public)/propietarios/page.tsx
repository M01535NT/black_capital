import type { Metadata } from "next";
import { Suspense } from "react";
import { OwnerJourney } from "@/components/public/owner-journey";

export const metadata: Metadata = {
  alternates: { canonical: "/propietarios" },
  title: "Para propietarios",
  description: "Vende o renta tu inmueble en Tijuana con una estrategia definida: revisión inicial, opinión de valor y comercialización.",
};

export default function PropietariosPage() {
  return <Suspense fallback={<div className="px-6 py-36 text-body text-white/60">Cargando información para propietarios…</div>}><OwnerJourney /></Suspense>;
}
