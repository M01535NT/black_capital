import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";

export const metadata: Metadata = {
    title: "Términos y Condiciones | Black Corporativo",
    description: "Términos y condiciones de uso de la plataforma Black Corporativo en Tijuana, Baja California.",
    alternates: {
        canonical: "https://blackcorporativo.vercel.app/legal/terminos-condiciones",
    },
};

export default function TermsPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="bg-zinc-950 py-16 border-b border-gold-500/20">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                            Términos y <span className="text-gold-500">Condiciones</span>
                        </h1>
                        <p className="text-body text-foreground/60">
                            Última actualización: junio 2026
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <FadeIn delay={0.1}>
                    <div className="prose prose-invert prose-zinc max-w-none">
                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                1. Aceptación de los Términos
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Al acceder y utilizar la plataforma Black Corporativo (en adelante, &quot;la Plataforma&quot;), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte, no debe utilizar la Plataforma.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                2. Descripción del Servicio
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Black Corporativo es una plataforma inmobiliaria premium que proporciona información sobre propiedades residenciales, comerciales e industriales en Tijuana, Baja California. La Plataforma incluye listados de propiedades, análisis financieros, herramientas y servicios de contacto con asesores inmobiliarios.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                3. Uso Permitido
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Usted se compromete a utilizar la Plataforma únicamente para fines legítimos relacionados con la búsqueda, evaluación o adquisición de propiedades inmobiliarias. Queda prohibido:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-foreground/70 ml-4">
                                <li>Utilizar la Plataforma para fines comerciales no autorizados</li>
                                <li>Intentar acceder a áreas restringidas del sistema</li>
                                <li>Interferir con el funcionamiento normal de la Plataforma</li>
                                <li>Reproducir, distribuir o modificar el contenido sin autorización expresa</li>
                                <li>Utilizar bots, scrapers o herramientas automatizadas para extraer datos</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                4. Propiedad Intelectual
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Todo el contenido de la Plataforma, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes, fotografías, videos, software y código fuente, es propiedad de Black Corporativo o de sus licenciantes y está protegido por las leyes de propiedad intelectual mexicanas e internacionales.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                5. Información de Propiedades
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                La información sobre propiedades publicada en la Plataforma se proporciona de buena fe y se basa en datos obtenidos de fuentes consideradas confiables. Sin embargo, Black Corporativo no garantiza la exactitud, integridad o disponibilidad actual de dicha información. Los análisis financieros son estimaciones y no constituyen asesoramiento financiero profesional.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                6. Registro y Datos Personales
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Para acceder a ciertos servicios, puede ser necesario proporcionar información personal. El tratamiento de sus datos se rige por nuestro <a href="/legal/aviso-privacidad" className="text-gold-500 hover:underline">Aviso de Privacidad</a>. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                7. Limitación de Responsabilidad
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                En la máxima medida permitida por la ley aplicable, Black Corporativo no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pero no limitado a pérdida de beneficios, datos, uso o buena voluntad, resultantes de su uso o incapacidad para usar la Plataforma.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                8. Enlaces a Terceros
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                La Plataforma puede contener enlaces a sitios web de terceros. Black Corporativo no controla ni asume responsabilidad por el contenido, políticas de privacidad o prácticas de dichos sitios.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                9. Modificaciones
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Black Corporativo se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la Plataforma.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                10. Ley Aplicable y Jurisdicción
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes de los Estados Unidos Mexicanos. Cualquier disputa estará sujeta a la jurisdicción de los tribunales competentes de Tijuana, Baja California.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                                11. Contacto
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de:
                            </p>
                            <ul className="list-none space-y-2 text-foreground/70">
                                <li><strong>Correo:</strong> contacto@blackcorporativo.vercel.app</li>
                                <li><strong>WhatsApp:</strong> +52 (664) 104 9491</li>
                            </ul>
                        </section>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
