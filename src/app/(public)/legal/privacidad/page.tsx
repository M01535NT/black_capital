import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/motion";

export const metadata: Metadata = {
    title: "Aviso de Privacidad | Black Corporativo",
    description:
        "Aviso de privacidad y política de protección de datos personales de Black Corporativo.",
};

export default function PrivacidadPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Header */}
            <div className="bg-zinc-950 py-16 border-b border-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                        Aviso de Privacidad
                    </h1>
                    <p className="text-gold-500/80 max-w-2xl text-lg">
                        Última actualización: Febrero 2026
                    </p>
                </div>
            </div>

            {/* Content */}
            <FadeIn>
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-foreground/70">
                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                I. Responsable del Tratamiento
                            </h2>
                            <p>
                                Black Corporativo, con domicilio en Ciudad de México, México, es responsable
                                del tratamiento de los datos personales que nos proporcione, los cuales serán
                                protegidos conforme a lo dispuesto por la Ley Federal de Protección de Datos
                                Personales en Posesión de los Particulares (&ldquo;LFPDPPP&rdquo;) y demás normatividad aplicable.
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
                                <li>Empresa o fondo de inversión (opcional)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                III. Finalidades del Tratamiento
                            </h2>
                            <p>Sus datos personales serán utilizados para:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Envío de brochures ejecutivos y documentación de propiedades</li>
                                <li>Contacto para prospección comercial inmobiliaria</li>
                                <li>Clasificación y seguimiento como lead de inversión</li>
                                <li>Envío de comunicaciones comerciales sobre oportunidades de inversión</li>
                                <li>Análisis estadístico y mejora de nuestros servicios</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                IV. Derechos ARCO
                            </h2>
                            <p>
                                Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento
                                de sus datos personales. Para ejercer estos derechos, puede contactarnos en:{" "}
                                <a href="mailto:privacidad@blackcorporativo.com" className="text-gold-500 hover:underline">
                                    privacidad@blackcorporativo.com
                                </a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                V. Seguridad de los Datos
                            </h2>
                            <p>
                                Implementamos medidas de seguridad administrativas, técnicas y físicas para
                                proteger sus datos personales contra daño, pérdida, alteración, destrucción o
                                uso, acceso o tratamiento no autorizado. Utilizamos cifrado de datos en
                                tránsito y en reposo, y nuestros sistemas están protegidos por Row Level
                                Security (RLS) a nivel de base de datos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-foreground border-b border-foreground/10 pb-4">
                                VI. Contacto
                            </h2>
                            <p>
                                Para cualquier consulta sobre este aviso de privacidad, puede escribirnos a{" "}
                                <a href="mailto:contacto@blackcorporativo.com" className="text-gold-500 hover:underline">
                                    contacto@blackcorporativo.com
                                </a>{" "}
                                o llamar al +52 (55) 1234 5678.
                            </p>
                        </section>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
