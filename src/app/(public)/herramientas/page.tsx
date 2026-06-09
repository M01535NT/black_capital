import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    Calculator,
    ClipboardCheck,
    FileSpreadsheet,
    Home,
    Landmark,
    Percent,
    ReceiptText,
    Scale,
    TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Herramientas Inmobiliarias | Black Capital",
    description:
        "Calculadoras y recursos para clientes inmobiliarios: hipoteca, impuestos, gastos de cierre, ROI, cap rate y análisis de inversión.",
};

const primaryTools = [
    {
        icon: Calculator,
        title: "Hipoteca",
        category: "Financiamiento",
        description: "Mensualidad estimada, enganche, tasa, plazo y monto financiado.",
        inputs: ["Precio", "Enganche", "Tasa", "Plazo"],
    },
    {
        icon: ReceiptText,
        title: "ISR e ISAI",
        category: "Impuestos",
        description: "Estimación inicial de impuestos para compraventa inmobiliaria.",
        inputs: ["Valor", "Operación", "Estado", "Escenario"],
    },
    {
        icon: TrendingUp,
        title: "ROI",
        category: "Inversión",
        description: "Renta esperada, gastos operativos, plusvalía y retorno proyectado.",
        inputs: ["Inversión", "Renta", "Gastos", "Plusvalía"],
    },
];

const secondaryTools = [
    { icon: Percent, title: "Cap Rate", category: "Industrial / Comercial" },
    { icon: Landmark, title: "Gastos de cierre", category: "Compra" },
    { icon: Home, title: "Capacidad de compra", category: "Planeación" },
    { icon: Scale, title: "Comprar vs rentar", category: "Decisión" },
    { icon: ClipboardCheck, title: "Checklist documental", category: "Proceso" },
    { icon: FileSpreadsheet, title: "Comparador de propiedades", category: "Análisis" },
];

const metrics = [
    { label: "Herramientas planeadas", value: "09" },
    { label: "Módulos prioritarios", value: "03" },
    { label: "Uso", value: "Clientes" },
];

export default function HerramientasPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <section className="mx-auto max-w-[94rem] px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
                <div className="grid min-h-[calc(100svh-9rem)] grid-cols-1 border border-white/[0.08] lg:grid-cols-[18rem_1fr]">
                    <aside className="border-b border-white/[0.08] bg-black/35 lg:border-b-0 lg:border-r">
                        <div className="border-b border-white/[0.08] p-5">
                            <p className="text-body-sm property-tag-type text-[var(--color-accent)]">
                                Black tools
                            </p>
                            <h1 className="mt-4 max-w-56 text-5xl font-semibold leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-5xl">
                                Centro de cálculo.
                            </h1>
                        </div>

                        <div className="grid grid-cols-3 divide-x divide-white/[0.08] border-b border-white/[0.08] lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="p-4 lg:p-5">
                                    <p className="property-price-type text-white">{metric.value}</p>
                                    <p className="mt-2 property-tag-type text-white/38">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="hidden p-5 lg:block">
                                    <p className="property-tag-type text-[var(--color-accent)]/75">
                                        Próxima construcción
                                    </p>
                            <ol className="mt-5 space-y-4 text-body text-white/58">
                                <li className="flex gap-3">
                                    <span className="text-[var(--color-accent)]">01</span>
                                    Hipoteca funcional
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[var(--color-accent)]">02</span>
                                    Impuestos de compraventa
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-[var(--color-accent)]">03</span>
                                    Gastos de cierre
                                </li>
                            </ol>
                        </div>
                    </aside>

                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(227,187,63,0.08),transparent_38%),linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,48px_48px]" />
                        <div className="relative grid min-h-full grid-cols-1 lg:grid-rows-[auto_1fr_auto]">
                            <header className="border-b border-white/[0.08] p-6 sm:p-8 lg:p-10">
                                <div className="max-w-4xl">
                            <p className="text-body-sm property-tag-type text-[var(--color-accent)]/80">
                                Herramientas inmobiliarias para clientes
                            </p>
                            <h2 className="mt-6 text-display-2 text-white">
                                Calcula antes de decidir.
                            </h2>
                            <p className="mt-6 max-w-2xl text-body text-white/58">
                                Un panel público para estimar escenarios clave: financiamiento, impuestos, retorno, gastos y comparación de alternativas.
                            </p>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 xl:grid-cols-[1fr_22rem]">
                                <main className="border-b border-white/[0.08] xl:border-b-0 xl:border-r">
                                    <div className="grid grid-cols-1 divide-y divide-white/[0.08]">
                                        {primaryTools.map((tool, index) => {
                                            const Icon = tool.icon;
                                            return (
                                                <article key={tool.title} className="grid grid-cols-1 gap-0 bg-black/10 transition-colors hover:bg-white/[0.025] md:grid-cols-[5rem_1fr]">
                                                    <div className="flex items-center justify-between border-b border-white/[0.08] p-5 md:block md:border-b-0 md:border-r">
                                                        <span className="block property-tag-type text-[var(--color-accent)]">
                                                            0{index + 1}
                                                        </span>
                                                        <Icon className="h-6 w-6 text-[var(--color-accent)]/75 md:mt-8" strokeWidth={1.45} />
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_16rem] lg:items-end">
                                                        <div>
                                                            <p className="property-tag-type text-[var(--color-accent)]">
                                                                {tool.category}
                                                            </p>
                                                            <h3 className="mt-3 text-display-3 text-white">
                                                                {tool.title}
                                                            </h3>
                                                            <p className="mt-4 max-w-xl text-body text-white/56">
                                                                {tool.description}
                                                            </p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {tool.inputs.map((input) => (
                                                                <span
                                                                    key={input}
                                                                    className="border border-white/[0.08] bg-white/[0.025] px-3 py-2 property-tag-type text-white/42"
                                                                >
                                                                    {input}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </main>

                                <aside className="bg-[#070707]/85 p-6 sm:p-8">
                                    <p className="property-tag-type text-white/35">
                                        Biblioteca adicional
                                    </p>
                                    <div className="mt-6 grid gap-3">
                                        {secondaryTools.map((tool) => {
                                            const Icon = tool.icon;
                                            return (
                                                <div key={tool.title} className="grid grid-cols-[2.75rem_1fr] border border-white/[0.08] bg-black/25">
                                                    <div className="flex items-center justify-center border-r border-white/[0.08]">
                                                        <Icon className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="p-3">
                                                        <h3 className="text-body-lg font-semibold text-white">{tool.title}</h3>
                                                        <p className="mt-1 property-tag-type text-white/34">
                                                            {tool.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </aside>
                            </div>

                            <footer className="grid grid-cols-1 border-t border-white/[0.08] bg-black/30 lg:grid-cols-[1fr_auto]">
                                <div className="p-6 sm:p-8">
                            <p className="max-w-2xl text-body text-white/56">
                                Las herramientas serán orientativas. Para operaciones reales conviene confirmar resultados con asesoría fiscal, legal y comercial.
                            </p>
                                </div>
                                <div className="flex border-t border-white/[0.08] lg:border-l lg:border-t-0">
                                    <Link
                                        href="/contacto?interes=herramientas"
                                        className="inline-flex min-h-16 w-full items-center justify-center gap-3 px-6 property-tag-type text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black lg:w-auto"
                                    >
                                        Solicitar cálculo
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

