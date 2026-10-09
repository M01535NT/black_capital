import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolSelector } from "@/components/tools/tool-selector";

export const metadata: Metadata = {
  alternates: { canonical: "/herramientas" },
    title: "Herramientas Inmobiliarias",
    description: "Calcula hipoteca, rendimiento de renta, compra y remodelación e impuesto de adquisición con tus propios datos.",
};

export default function HerramientasPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <section className="mx-auto max-w-[94rem] px-4 pb-12 pt-24 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
                <header className="mb-6 max-w-4xl lg:mb-10">
                    <p className="text-body-sm property-tag-type text-[var(--color-accent)]">Black tools</p>
                    <h1 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-normal text-white sm:text-6xl lg:mt-4 lg:text-5xl">Calcula antes de decidir.</h1>
                    <p className="mt-3 max-w-2xl text-body text-white/58 lg:mt-6">Elige una calculadora, ajusta tus datos y revisa los supuestos de cada estimación.</p>
                </header>
                <Suspense fallback={<p className="text-body text-white/58">Cargando calculadoras…</p>}>
                    <ToolSelector />
                </Suspense>
            </section>
        </div>
    );
}
