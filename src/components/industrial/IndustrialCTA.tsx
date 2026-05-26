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
    14|import { Loader2, CheckCircle2, Download } from "lucide-react";
    15|
    16|const ctaSchema = z.object({
    17|    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    18|    company: z.string().min(1, "Empresa requerida para solicitudes industriales"),
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
    39|export function IndustrialCTA() {
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
    67|            source: "landing_industrial",
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
    78|                    source: "landing_industrial",
    79|                    status: "new",
    80|                    notes: `Industrial Landing — Empresa: ${data.company}`,
    81|                },
    82|            ]);
    83|
    84|            if (error) throw error;
    85|
    86|            setIsSuccess(true);
    87|            toast.success("¡Solicitud enviada con éxito!");
    88|        } catch (error) {
    89|            console.error("Error capturing lead:", error);
    90|            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
    91|        } finally {
    92|            setIsSubmitting(false);
    93|        }
    94|    }
    95|
    96|    return (
    97|        <section className="w-full py-24 bg-background relative overflow-hidden">
    98|            {/* Decorative borders */}
    99|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-500/30 to-transparent" />
   100|            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
   101|
   102|            <div className="container mx-auto px-4">
   103|                <FadeIn direction="up" delay={0.1}>
   104|                    <div className="max-w-5xl mx-auto bg-zinc-950/80 backdrop-blur-sm border border-steel-500/20 p-8 md:p-12 relative overflow-hidden">
   105|                        {/* Corner accents */}
   106|                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-500/30" />
   107|                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-500/30" />
   108|                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-500/30" />
   109|                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-500/30" />
   110|
   111|                        {/* Subtle Glow */}
   112|                        <div className="absolute top-0 right-0 w-96 h-96 bg-steel-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
   113|
   114|                        {!isSuccess ? (
   115|                            <div className="flex flex-col md:flex-row gap-12 relative z-10">
   116|                                {/* Left Copy */}
   117|                                <div className="flex-1 space-y-6">
   118|                                    <div className="flex items-center gap-3">
   119|                                        <Download className="w-5 h-5 text-gold-500" />
   120|                                        <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
   121|                                            Portafolio Industrial
   122|                                        </span>
   123|                                    </div>
   124|
   125|                                    <h2 className="section-heading text-3xl md:text-4xl text-white">
   126|                                        Recibe Nuestro Portafolio
   127|                                        <br />
   128|                                        <span className="metallic-gold">Industrial Actualizado</span>
   129|                                    </h2>
   130|
   131|                                    <p className="text-white/50 text-base max-w-md leading-relaxed">
   132|                                        Análisis financiero con cap rates, ocupación histórica,
   133|                                        benchmarks de mercado y proyecciones de rendimiento
   134|                                        para cada activo industrial disponible.
   135|                                    </p>
   136|
   137|                                    <div className="flex flex-wrap gap-4 pt-2">
   138|                                        {["Cap Rates", "Benchmarks", "Proyecciones"].map((tag) => (
   139|                                            <span
   140|                                                key={tag}
   141|                                                className="px-3 py-1 border border-steel-500/20 text-xs font-bold uppercase tracking-widest text-steel-400"
   142|                                            >
   143|                                                {tag}
   144|                                            </span>
   145|                                        ))}
   146|                                    </div>
   147|                                </div>
   148|
   149|                                {/* Right Form */}
   150|                                <div className="flex-1">
   151|                                    <form
   152|                                        onSubmit={handleSubmit(onSubmit)}
   153|                                        className="space-y-4"
   154|                                    >
   155|                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   156|                                            <div className="space-y-1">
   157|                                                <Input
   158|                                                    placeholder="Nombre Completo"
   159|                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
   160|                                                    {...register("fullName")}
   161|                                                />
   162|                                                {errors.fullName && (
   163|                                                    <p className="text-xs text-red-400">
   164|                                                        {errors.fullName.message}
   165|                                                    </p>
   166|                                                )}
   167|                                            </div>
   168|                                            <div className="space-y-1">
   169|                                                <Input
   170|                                                    placeholder="Empresa *"
   171|                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
   172|                                                    {...register("company")}
   173|                                                />
   174|                                                {errors.company && (
   175|                                                    <p className="text-xs text-red-400">
   176|                                                        {errors.company.message}
   177|                                                    </p>
   178|                                                )}
   179|                                            </div>
   180|                                        </div>
   181|
   182|                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   183|                                            <div className="space-y-1">
   184|                                                <Input
   185|                                                    type="email"
   186|                                                    placeholder="Correo Corporativo"
   187|                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
   188|                                                    {...register("email")}
   189|                                                />
   190|                                                {errors.email && (
   191|                                                    <p className="text-xs text-red-400">
   192|                                                        {errors.email.message}
   193|                                                    </p>
   194|                                                )}
   195|                                            </div>
   196|                                            <div className="space-y-1">
   197|                                                <Input
   198|                                                    type="tel"
   199|                                                    placeholder="Teléfono (Opcional)"
   200|                                                    className="bg-black/50 border-steel-500/20 text-white placeholder:text-white/25 focus-visible:ring-gold-500 rounded-none"
   201|                                                    {...register("phone")}
   202|                                                />
   203|                                            </div>
   204|                                        </div>
   205|
   206|                                        <div className="flex items-start space-x-3 pt-2">
   207|                                            <Checkbox
   208|                                                id="industrial-privacy"
   209|                                                checked={privacyValue}
   210|                                                onCheckedChange={(checked) =>
   211|                                                    setValue("privacy", checked === true, {
   212|                                                        shouldValidate: true,
   213|                                                    })
   214|                                                }
   215|                                                className="border-steel-500/30 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
   216|                                            />
   217|                                            <label
   218|                                                htmlFor="industrial-privacy"
   219|                                                className="text-sm text-white/40 leading-tight cursor-pointer"
   220|                                            >
   221|                                                Acepto el{" "}
   222|                                                <a
   223|                                                    href="/legal/privacidad"
   224|                                                    className="text-gold-500 hover:underline"
   225|                                                >
   226|                                                    Aviso de Privacidad
   227|                                                </a>{" "}
   228|                                                y consiento el tratamiento de mis datos para
   229|                                                prospección comercial.
   230|                                            </label>
   231|                                        </div>
   232|                                        {errors.privacy && (
   233|                                            <p className="text-xs text-red-400">
   234|                                                {errors.privacy.message}
   235|                                            </p>
   236|                                        )}
   237|
   238|                                        <Button
   239|                                            type="submit"
   240|                                            disabled={isSubmitting}
   241|                                            className="w-full bg-gold-500 text-black hover:bg-gold-400 font-bold tracking-widest uppercase mt-4 rounded-none"
   242|                                        >
   243|                                            {isSubmitting ? (
   244|                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
   245|                                            ) : null}
   246|                                            {isSubmitting
   247|                                                ? "Procesando..."
   248|                                                : "Solicitar Portafolio Industrial"}
   249|                                        </Button>
   250|                                    </form>
   251|                                </div>
   252|                            </div>
   253|                        ) : (
   254|                            <div className="relative z-10 py-12 flex flex-col items-center justify-center text-center space-y-4">
   255|                                <div className="w-16 h-16 bg-gold-500/20 flex items-center justify-center mb-4">
   256|                                    <CheckCircle2 className="w-8 h-8 text-gold-500" />
   257|                                </div>
   258|                                <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
   259|                                    Solicitud Registrada
   260|                                </h3>
   261|                                <p className="text-white/50 max-w-md">
   262|                                    Nuestro equipo de inversiones industriales se pondrá en
   263|                                    contacto contigo en las próximas 24 horas con el portafolio
   264|                                    actualizado y análisis financiero correspondiente.
   265|                                </p>
   266|                            </div>
   267|                        )}
   268|                    </div>
   269|                </FadeIn>
   270|            </div>
   271|        </section>
   272|    );
   273|}
   274|