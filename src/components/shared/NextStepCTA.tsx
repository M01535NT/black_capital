import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Cierre de funnel para páginas informativas (nosotros/*): ninguna página
 * debe terminar sin siguiente paso. Estilo alineado al manifiesto de Home.
 */
export function NextStepCTA({
    title = "¿Tienes una operación en mente?",
    description = "Cuéntanos qué necesitas comprar, vender o rentar y te respondemos el mismo día hábil.",
}: {
    title?: string;
    description?: string;
}) {
    return (
        <section className="relative border-t border-white/[0.06] bg-white/[0.02]">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
            />
            <div className="mx-auto max-w-[90rem] px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-display-2 leading-display tracking-headline text-white">
                            {title}
                        </h2>
                        <p className="mt-4 text-body text-white/58">{description}</p>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <Link
                            href="/contacto"
                            className="brushed-gold premium-cta inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none"
                        >
                            Hablar con un asesor
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/inventario"
                            className="group inline-flex w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
                        >
                            <span className="property-tag-type relative pb-1">
                                Ver inventario
                                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
