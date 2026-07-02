import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";
import { CONTACT_CONFIG } from "@/lib/contact-config";

export const metadata: Metadata = {
    title: "Términos y Condiciones | Black Capital",
    description: "Reglas de uso del sitio Black Capital y de la información inmobiliaria publicada.",
    alternates: {
        canonical: "https://blackmx.vercel.app/legal/terminos-condiciones",
    },
};

export default function TermsPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="bg-zinc-950 py-16 border-b border-[var(--color-accent)]/20">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-display-2 uppercase text-foreground mb-3">
                            Términos y <span className="text-[var(--color-accent)]">Condiciones</span>
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
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                1. Aceptación de los Términos
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Al usar el sitio de Black Capital aceptas estos Términos y Condiciones. Si no estás de acuerdo, no uses el sitio.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                2. Descripción del Servicio
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Black Capital publica información sobre propiedades residenciales, comerciales e industriales en Tijuana, Baja California. El sitio incluye listados, herramientas de cálculo y canales de contacto con asesores inmobiliarios.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                3. Uso Permitido
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Usa el sitio solo para buscar, evaluar o solicitar información inmobiliaria. Queda prohibido:
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
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                4. Propiedad Intelectual
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Los textos, gráficos, logotipos, imágenes, videos, software y código del sitio pertenecen a Black Capital o a sus licenciantes, y están protegidos por las leyes aplicables de propiedad intelectual.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                5. Información de Propiedades
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                La información de propiedades se publica de buena fe y puede cambiar sin aviso. Black Capital no garantiza exactitud, integridad ni disponibilidad actual. Los cálculos financieros son estimaciones y no constituyen asesoría financiera profesional.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                6. Registro y Datos Personales
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Algunos servicios pueden pedir datos personales. Su tratamiento se rige por nuestro <a href="/legal/aviso-privacidad" className="text-[var(--color-accent)] hover:underline">Aviso de Privacidad</a>. Si tienes credenciales de acceso, eres responsable de mantenerlas bajo resguardo.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                7. Limitación de Responsabilidad
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                En la medida permitida por la ley, Black Capital no será responsable por daños indirectos, pérdida de beneficios, pérdida de datos o afectaciones derivadas del uso o imposibilidad de uso del sitio.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                8. Enlaces a Terceros
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                El sitio puede incluir enlaces a terceros. Black Capital no controla ni asume responsabilidad por su contenido, políticas de privacidad o prácticas.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                9. Modificaciones
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Black Capital puede modificar estos Términos y Condiciones. Los cambios entrarán en vigor al publicarse en el sitio.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                10. Ley Aplicable y Jurisdicción
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes de los Estados Unidos Mexicanos. Cualquier disputa estará sujeta a la jurisdicción de los tribunales competentes de Tijuana, Baja California.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-display-3 font-semibold text-foreground mb-4">
                                11. Contacto
                            </h2>
                            <p className="text-body text-foreground/70 leading-relaxed mb-4">
                                Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos por:
                            </p>
                            <ul className="list-none space-y-2 text-foreground/70">
                                <li><strong>Correo:</strong> {CONTACT_CONFIG.email}</li>
                                <li><strong>WhatsApp:</strong> {CONTACT_CONFIG.phone}</li>
                            </ul>
                        </section>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
