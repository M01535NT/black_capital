     1|"use client";
     2|
     3|import { useState } from "react";
     4|import { useForm } from "react-hook-form";
     5|import { zodResolver } from "@hookform/resolvers/zod";
     6|import * as z from "zod";
     7|import { createClient } from "@/lib/supabase/client";
     8|import posthog from "posthog-js";
     9|import { toast } from "sonner";
    10|import { Button } from "@/components/ui/button";
    11|import { Input } from "@/components/ui/input";
    12|import { Checkbox } from "@/components/ui/checkbox";
    13|import { FadeIn } from "@/components/ui/motion";
    14|import { Loader2, CheckCircle2, Lock } from "lucide-react";
    15|
    16|const ctaSchema = z.object({
    17|    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    18|    company: z.string().optional(),
    19|    email: z
    20|        .string()
    21|        .email("Debe ser un correo electrónico válido")
    22|        .refine(
    23|            (val) =>
    24|                !/(tempmail|mailinator|guerrilla|yopmail|throwaway|10minute|trashmail)/i.test(
    25|                    val
    26|                ),
    27|            { message: "Por favor, utiliza un correo corporativo o personal real" }
    28|        ),
    29|    phone: z.string().optional(),
    30|    privacy: z
    31|        .boolean()
    32|        .refine((val) => val === true, {
    33|            message: "Debes aceptar el aviso de privacidad",
    34|        }),
    35|});
    36|
    37|type CTAFormValues = z.infer<typeof ctaSchema>;
    38|
    39|export function LuxuryCTA() {
    40|    const [isSubmitting, setIsSubmitting] = useState(false);
    41|    const [isSuccess, setIsSuccess] = useState(false);
    42|    const supabase = createClient();
    43|
    44|    const {
    45|        register,
    46|        handleSubmit,
    47|        setValue,
    48|        watch,
    49|        formState: { errors },
    50|    } = useForm<CTAFormValues>({
    51|        resolver: zodResolver(ctaSchema),
    52|        defaultValues: {
    53|            fullName: "",
    54|            company: "",
    55|            email: "",
    56|            phone: "",
    57|            privacy: false,
    58|        },
    59|    });
    60|
    61|    const privacyValue = watch("privacy");
    62|
    63|    async function onSubmit(data: CTAFormValues) {
    64|        setIsSubmitting(true);
    65|
    66|        posthog.capture("lead_magnet_submitted", {
    67|            source: "landing_luxury",
    68|            has_company: !!data.company,
    69|        });
    70|
    71|        try {
    72|            const { error } = await supabase.from("leads").insert([
    73|                {
    74|                    full_name: data.fullName,
    75|                    email: data.email,
    76|                    phone: data.phone || null,
    77|                    privacy_accepted: true,
    78|                    source: "landing_luxury",
    79|                    status: "new",
    80|                    notes: data.company
    81|                        ? `Luxury Landing — Empresa/Fondo: ${data.company}`
    82|                        : "Luxury Landing",
    83|                },
    84|            ]);
    85|
    86|            if (error) throw error;
    87|
    88|            setIsSuccess(true);
    89|            toast.success("¡Solicitud enviada con éxito!");
    90|        } catch (error) {
    91|            console.error("Error capturing lead:", error);
    92|            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
    93|        } finally {
    94|            setIsSubmitting(false);
    95|        }
    96|    }
    97|
    98|    return (
    99|        <section id="luxury-cta" className="w-full py-28 bg-background relative overflow-hidden">
   100|            {/* Decorative borders */}
   101|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
   102|            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
   103|
   104|            {/* Floating glow */}
   105|            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/3 blur-[150px] pointer-events-none" />
   106|
   107|            <div className="container mx-auto px-4">
   108|                <FadeIn direction="up" delay={0.1}>
   109|                    <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-14 relative overflow-hidden border border-gold-500/15">
   110|                        {/* Inner glow */}
   111|                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
   112|                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
   113|
   114|                        {!isSuccess ? (
   115|                            <div className="flex flex-col md:flex-row gap-14 relative z-10">
   116|                                {/* Left Copy */}
   117|                                <div className="flex-1 space-y-6">
   118|                                    <div className="flex items-center gap-3">
   119|                                        <Lock className="w-4 h-4 text-gold-500" />
   120|                                        <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
   121|                                            Acceso Privado
   122|                                        </span>
   123|                                    </div>
   124|
   125|                                    <h2 className="section-heading text-3xl md:text-4xl text-white">
   126|                                        Accede al Directorio
   127|                                        <br />
   128|                                        <span className="metallic-gold">de Propiedades Exclusivas</span>
   129|                                    </h2>
   130|
   131|                                    <p className="text-white/45 text-base max-w-md leading-relaxed">
   132|                                        Portafolio reservado con propiedades Off-Market, análisis
   133|                                        financiero personalizado, y acompañamiento fiduciario para
   134|                                        inversiones de alto patrimonio.
   135|                                    </p>
   136|
   137|                                    <div className="flex items-center gap-3 pt-2 text-foreground/30 text-xs uppercase tracking-widest">
   138|                                        <div className="w-2 h-2 rounded-full bg-gold-500/50" />
   139|                                        Respuesta en menos de 24h
   140|                                    </div>
   141|                                </div>
   142|
   143|                                {/* Right Form */}
   144|                                <div className="flex-1">
   145|                                    <form
   146|                                        onSubmit={handleSubmit(onSubmit)}
   147|                                        className="space-y-4"
   148|                                    >
   149|                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   150|                                            <div className="space-y-1">
   151|                                                <Input
   152|                                                    placeholder="Nombre Completo"
   153|                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
   154|                                                    {...register("fullName")}
   155|                                                />
   156|                                                {errors.fullName && (
   157|                                                    <p className="text-xs text-red-400">
   158|                                                        {errors.fullName.message}
   159|                                                    </p>
   160|                                                )}
   161|                                            </div>
   162|                                            <div className="space-y-1">
   163|                                                <Input
   164|                                                    placeholder="Empresa o Fondo"
   165|                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
   166|                                                    {...register("company")}
   167|                                                />
   168|                                            </div>
   169|                                        </div>
   170|
   171|                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   172|                                            <div className="space-y-1">
   173|                                                <Input
   174|                                                    type="email"
   175|                                                    placeholder="Correo Electrónico"
   176|                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
   177|                                                    {...register("email")}
   178|                                                />
   179|                                                {errors.email && (
   180|                                                    <p className="text-xs text-red-400">
   181|                                                        {errors.email.message}
   182|                                                    </p>
   183|                                                )}
   184|                                            </div>
   185|                                            <div className="space-y-1">
   186|                                                <Input
   187|                                                    type="tel"
   188|                                                    placeholder="Teléfono (Opcional)"
   189|                                                    className="bg-black/30 border-gold-500/15 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-xl"
   190|                                                    {...register("phone")}
   191|                                                />
   192|                                            </div>
   193|                                        </div>
   194|
   195|                                        <div className="flex items-start space-x-3 pt-2">
   196|                                            <Checkbox
   197|                                                id="luxury-privacy"
   198|                                                checked={privacyValue}
   199|                                                onCheckedChange={(checked) =>
   200|                                                    setValue("privacy", checked === true, {
   201|                                                        shouldValidate: true,
   202|                                                    })
   203|                                                }
   204|                                                className="border-gold-500/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
   205|                                            />
   206|                                            <label
   207|                                                htmlFor="luxury-privacy"
   208|                                                className="text-sm text-white/40 leading-tight cursor-pointer"
   209|                                            >
   210|                                                Acepto el{" "}
   211|                                                <a
   212|                                                    href="/legal/privacidad"
   213|                                                    className="text-gold-500 hover:underline"
   214|                                                >
   215|                                                    Aviso de Privacidad
   216|                                                </a>{" "}
   217|                                                y consiento el tratamiento de mis datos para
   218|                                                prospección comercial.
   219|                                            </label>
   220|                                        </div>
   221|                                        {errors.privacy && (
   222|                                            <p className="text-xs text-red-400">
   223|                                                {errors.privacy.message}
   224|                                            </p>
   225|                                        )}
   226|
   227|                                        <Button
   228|                                            type="submit"
   229|                                            disabled={isSubmitting}
   230|                                            className="w-full bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase mt-4 rounded-full"
   231|                                        >
   232|                                            {isSubmitting ? (
   233|                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
   234|                                            ) : null}
   235|                                            {isSubmitting
   236|                                                ? "Procesando..."
   237|                                                : "Solicitar Acceso Exclusivo"}
   238|                                        </Button>
   239|                                    </form>
   240|                                </div>
   241|                            </div>
   242|                        ) : (
   243|                            <div className="relative z-10 py-16 flex flex-col items-center justify-center text-center space-y-4">
   244|                                <div className="w-20 h-20 rounded-full bg-gold-500/15 flex items-center justify-center mb-4">
   245|                                    <CheckCircle2 className="w-10 h-10 text-gold-500" />
   246|                                </div>
   247|                                <h3 className="text-2xl font-bold text-white">
   248|                                    ¡Bienvenido al Directorio Exclusivo!
   249|                                </h3>
   250|                                <p className="text-white/50 max-w-md">
   251|                                    Tu solicitud ha sido registrada. Nuestro equipo de relaciones
   252|                                    con inversores se pondrá en contacto contigo en las próximas
   253|                                    24 horas para brindarte acceso personalizado.
   254|                                </p>
   255|                            </div>
   256|                        )}
   257|                    </div>
   258|                </FadeIn>
   259|            </div>
   260|        </section>
   261|    );
   262|}
   263|