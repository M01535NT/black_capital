import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";
import { CONTACT_CONFIG } from "@/lib/contact-config";

export const metadata: Metadata = {
    title: "Aviso de Privacidad | Black Capital",
    description:
        "Aviso de privacidad de Black Capital: qué datos solicitamos y para qué los usamos.",
    alternates: {
        canonical: "https://blackmx.vercel.app/legal/aviso-privacidad",
    },
};

export default function PrivacidadPage() {
    return (
        <div className="w-full flex-1 bg-background">
            <div className="bg-zinc-950 py-16 border-b border-[var(--color-accent)]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-accent)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-display-2 uppercase text-foreground mb-4">
                        Aviso de Privacidad
                    </h1>
                    <p className="footer-legal-type text-[var(--color-accent)]/80 max-w-2xl">
                        Última actualización: junio 2026
                    </p>
                </div>
            </div>

            <FadeIn>
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-foreground/70">
                        <section>
                        <h2 className="text-display-3 font-semibold text-foreground border-b border-foreground/10 pb-4">
                            I. Responsable del Tratamiento
                        </h2>
                            <p>
                                Black Capital, con domicilio en Tijuana, Baja California, México, es responsable
                                de los datos personales que nos proporciones. Los tratamos conforme a la Ley Federal
                                de Protección de Datos Personales en Posesión de los Particulares (&ldquo;LFPDPPP&rdquo;) y demás normatividad aplicable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                II. Datos Personales Recabados
                            </h2>
                            <p>Recabamos los siguientes datos personales:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nombre completo</li>
                                <li>Correo electrónico</li>
                                <li>Número telefónico</li>
                                <li>Empresa (opcional)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                III. Finalidades del Tratamiento
                            </h2>
                            <p>Usamos tus datos para:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Enviarte información sobre propiedades que solicites</li>
                                <li>Contactarte para asesoría inmobiliaria</li>
                                <li>Dar seguimiento a tus solicitudes</li>
                                <li>Compartirte oportunidades relevantes</li>
                                <li>Mejorar nuestros servicios y experiencia de usuario</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                IV. Derechos ARCO
                            </h2>
                            <p>
                                Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento
                                de tus datos personales. Para ejercer estos derechos, contáctanos en:{" "}
                                <a href={`mailto:${CONTACT_CONFIG.email}`} className="text-[var(--color-accent)] hover:underline">
                                    {CONTACT_CONFIG.email}
                                </a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                V. Seguridad de los Datos
                            </h2>
                            <p>
                                Aplicamos medidas administrativas, técnicas y físicas razonables para
                                proteger tus datos personales contra daño, pérdida, alteración, destrucción,
                                uso, acceso o tratamiento no autorizado.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                VI. Contacto
                            </h2>
                            <p>
                                Para cualquier consulta sobre este aviso de privacidad, escríbenos a{" "}
                                <a href={`mailto:${CONTACT_CONFIG.email}`} className="text-[var(--color-accent)] hover:underline">
                                    {CONTACT_CONFIG.email}
                                </a>{" "}
                                o llamar al {CONTACT_CONFIG.phone}.
                            </p>
                        </section>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
