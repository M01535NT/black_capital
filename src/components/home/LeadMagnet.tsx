     1|"use client";
     2|
     3|import { useState } from "react";
     4|import { useForm } from "react-hook-form";
     5|import { zodResolver } from "@hookform/resolvers/zod";
     6|import { createClient } from "@/lib/supabase/client";
     7|import posthog from "posthog-js";
     8|import { toast } from "sonner";
     9|import { Button } from "@/components/ui/button";
    10|import { Input } from "@/components/ui/input";
    11|import { Checkbox } from "@/components/ui/checkbox";
    12|import { FadeIn } from "@/components/ui/motion";
    13|import { Loader2, CheckCircle2 } from "lucide-react";
    14|import { leadSchema, LeadFormValues } from "@/lib/validations/lead";
    15|
    16|export function LeadMagnet() {
    17|    const [isSubmitting, setIsSubmitting] = useState(false);
    18|    const [isSuccess, setIsSuccess] = useState(false);
    19|    const supabase = createClient();
    20|
    21|    const {
    22|        register,
    23|        handleSubmit,
    24|        setValue,
    25|        watch,
    26|        formState: { errors },
    27|    } = useForm<LeadFormValues>({
    28|        resolver: zodResolver(leadSchema),
    29|        defaultValues: {
    30|            full_name: "",
    31|            email: "",
    32|            phone: "",
    33|            privacy_accepted: false,
    34|            source: "organic",
    35|            status: "new",
    36|            notes: "",
    37|        },
    38|    });
    39|
    40|    const privacyValue = watch("privacy_accepted");
    41|    const [company, setCompany] = useState("");
    42|
    43|    async function onSubmit(data: LeadFormValues) {
    44|        setIsSubmitting(true);
    45|
    46|        posthog.capture("lead_magnet_submitted", {
    47|            source: "homepage_cta",
    48|            has_company: !!company,
    49|        });
    50|
    51|        try {
    52|            const notes = company
    53|                ? `Lead Magnet Homepage — Empresa: ${company}`
    54|                : "Lead Magnet Homepage";
    55|
    56|            const { error } = await supabase.from("leads").insert([
    57|                {
    58|                    full_name: data.full_name,
    59|                    email: data.email,
    60|                    phone: data.phone || null,
    61|                    privacy_accepted: true,
    62|                    source: "organic",
    63|                    status: "new",
    64|                    notes,
    65|                },
    66|            ]);
    67|
    68|            if (error) throw error;
    69|
    70|            setIsSuccess(true);
    71|            toast.success("¡Solicitud enviada con éxito!");
    72|        } catch (error) {
    73|            console.error("Error capturing lead:", error);
    74|            toast.error("Ocurrió un error. Por favor intenta nuevamente.");
    75|        } finally {
    76|            setIsSubmitting(false);
    77|        }
    78|    }
    79|
    80|    return (
    81|        <section className="w-full py-24 bg-background relative overflow-hidden">
    82|            {/* Decorative Gold Border Top/Bottom */}
    83|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
    84|            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
    85|
    86|            <div className="container mx-auto px-4">
    87|                <FadeIn direction="up" delay={0.1}>
    88|                    <div className="max-w-5xl mx-auto bg-zinc-950/80 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8 md:p-12 shadow-2xl shadow-gold-500/5 relative overflow-hidden">
    89|                        {/* Subtle Glow inside the card */}
    90|                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/8 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    91|                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    92|
    93|                        {!isSuccess ? (
    94|                            <div className="flex flex-col md:flex-row gap-12 relative z-10">
    95|                                {/* Left Copy */}
    96|                                <div className="flex-1 space-y-6">
    97|                                    <span className="animate-gold-shimmer font-bold uppercase tracking-widest text-sm">
    98|                                        Acceso Privilegiado
    99|                                    </span>
   100|                                    <h2 className="section-heading text-3xl md:text-5xl text-white">
   101|                                        Únete al Directorio de Inversores
   102|                                    </h2>
   103|                                    <p className="text-white/70 text-lg max-w-md">
   104|                                        Recibe análisis de mercado exclusivos, proyecciones financieras estructuradas y acceso a inventario Off-Market antes de su publicación general.
   105|                                    </p>
   106|                                </div>
   107|
   108|                                {/* Right Form */}
   109|                                <div className="flex-1">
   110|                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
   111|                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   112|                                            <div className="space-y-1">
   113|                                                        <Input
   114|                                                            placeholder="Nombre Completo"
   115|                                                            className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
   116|                                                            {...register("full_name")}
   117|                                                        />
   118|                                                        {errors.full_name && (
   119|                                                            <p className="text-xs text-red-400">{errors.full_name.message}</p>
   120|                                                        )}
   121|                                                    </div>
   122|                                                    <div className="space-y-1">
   123|                                                        <Input
   124|                                                            placeholder="Empresa o Fondo"
   125|                                                            className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
   126|                                                            value={company}
   127|                                                            onChange={(e) => setCompany(e.target.value)}
   128|                                                        />
   129|                                                    </div>
   130|                                        </div>
   131|
   132|                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   133|                                            <div className="space-y-1">
   134|                                                <Input
   135|                                                    type="email"
   136|                                                    placeholder="Correo Corporativo"
   137|                                                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
   138|                                                    {...register("email")}
   139|                                                />
   140|                                                {errors.email && (
   141|                                                    <p className="text-xs text-red-400">{errors.email.message}</p>
   142|                                                )}
   143|                                            </div>
   144|                                            <div className="space-y-1">
   145|                                                <Input
   146|                                                    type="tel"
   147|                                                    placeholder="Teléfono (Opcional)"
   148|                                                    className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-gold-500"
   149|                                                    {...register("phone")}
   150|                                                />
   151|                                            </div>
   152|                                        </div>
   153|
   154|                                        <div className="flex items-start space-x-3 pt-2">
   155|                                            <Checkbox
   156|                                                id="privacy"
   157|                                                checked={privacyValue}
   158|                                                onCheckedChange={(checked) =>
   159|                                                    setValue("privacy_accepted", checked === true, { shouldValidate: true })
   160|                                                }
   161|                                                className="border-white/20 data-[state=checked]:bg-gold-500 data-[state=checked]:text-black mt-1"
   162|                                            />
   163|                                            <label
   164|                                                htmlFor="privacy"
   165|                                                className="text-sm text-white/60 leading-tight cursor-pointer"
   166|                                            >
   167|                                                Acepto el{" "}
   168|                                                <a href="/legal/privacidad" className="text-gold-500 hover:underline">
   169|                                                    Aviso de Privacidad
   170|                                                </a>{" "}
   171|                                                y consiento el tratamiento de mis datos para prospección comercial.
   172|                                            </label>
   173|                                        </div>
   174|                                        {errors.privacy_accepted && (
   175|                                            <p className="text-xs text-red-400">{errors.privacy_accepted.message}</p>
   176|                                        )}
   177|
   178|                                        <Button
   179|                                            type="submit"
   180|                                            disabled={isSubmitting}
   181|                                            className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold tracking-widest uppercase mt-4"
   182|                                        >
   183|                                            {isSubmitting ? (
   184|                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
   185|                                            ) : null}
   186|                                            {isSubmitting ? "Procesando..." : "Solicitar Acceso"}
   187|                                        </Button>
   188|                                    </form>
   189|                                </div>
   190|                            </div>
   191|                        ) : (
   192|                            <div className="relative z-10 py-12 flex flex-col items-center justify-center text-center space-y-4">
   193|                                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4">
   194|                                    <CheckCircle2 className="w-8 h-8 text-gold-500" />
   195|                                </div>
   196|                                <h3 className="text-2xl font-bold text-white">
   197|                                    ¡Gracias por tu interés!
   198|                                </h3>
   199|                                <p className="text-white/70 max-w-md">
   200|                                    Tu solicitud ha sido registrada exitosamente. Nuestro equipo de inversiones se pondrá en contacto contigo en las próximas 24 horas con acceso a nuestro directorio exclusivo.
   201|                                </p>
   202|                            </div>
   203|                        )}
   204|                    </div>
   205|                </FadeIn>
   206|            </div>
   207|        </section>
   208|    );
   209|}
   210|