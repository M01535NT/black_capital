"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, FileText, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface DocumentLink {
    id: string;
    label: string;
    type: string;
}

type Step = "idle" | "checking" | "form" | "code" | "ready" | "error";

type DocumentCardProps = {
    doc: DocumentLink;
    propertyId: string;
    propertyTitle: string;
};

export function DocumentCard({ doc, propertyId, propertyTitle }: DocumentCardProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("idle");
    const [error, setError] = useState("");
    const [requestId, setRequestId] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [devCode, setDevCode] = useState("");

    async function startRequestFromSession() {
        setOpen(true);
        setStep("checking");
        setError("");
        setDevCode("");

        try {
            const response = await fetch("/api/document-access/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ propertyId, documentId: doc.id }),
            });
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || "No se pudo iniciar la solicitud.");
            }

            if (json.downloadUrl) {
                setRequestId(json.requestId || "");
                setDownloadUrl(json.downloadUrl);
                setStep("ready");
                return;
            }

            setStep("form");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo iniciar la solicitud.");
            setStep("error");
        }
    }

    async function submitProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStep("checking");
        setError("");

        const formData = new FormData(event.currentTarget);
        const body = {
            propertyId,
            documentId: doc.id,
            fullName: String(formData.get("fullName") || ""),
            phone: String(formData.get("phone") || ""),
            email: String(formData.get("email") || ""),
            acceptedNda: formData.get("acceptedNda") === "on",
            acceptedPrivacy: formData.get("acceptedPrivacy") === "on",
        };

        try {
            const response = await fetch("/api/document-access/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || "No se pudo enviar la solicitud.");
            }

            if (json.downloadUrl) {
                setRequestId(json.requestId || "");
                setDownloadUrl(json.downloadUrl);
                setStep("ready");
                return;
            }

            setRequestId(json.requestId || "");
            setDevCode(json.devCode || "");
            setStep("code");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
            setStep("form");
        }
    }

    async function submitCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStep("checking");
        setError("");

        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch("/api/document-access/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId,
                    code: String(formData.get("code") || ""),
                }),
            });
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || "No se pudo validar el código.");
            }

            setDownloadUrl(json.downloadUrl);
            setStep("ready");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo validar el código.");
            setStep("code");
        }
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            setStep("idle");
            setError("");
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={startRequestFromSession}
                className="group flex w-full items-center gap-3 border border-white/[0.08] bg-white/[0.025] p-3 text-left transition-all hover:border-[var(--color-accent)]/25 hover:bg-[var(--color-accent)]/[0.04]"
            >
                <span className="flex size-9 shrink-0 items-center justify-center border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10">
                    <FileText className="size-4 text-[var(--color-accent)]" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-sm font-semibold text-white transition-colors group-hover:text-[var(--color-accent)]">
                        {doc.label}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-caption uppercase tracking-wider text-white/42">
                        <LockKeyhole className="size-3" aria-hidden="true" />
                        {doc.type}
                    </span>
                </span>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                    Solicitar
                </span>
            </button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="border-white/[0.08] bg-[#080808] text-white sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-display-3 leading-tight text-white">
                            Solicitar documentos
                        </DialogTitle>
                        <DialogDescription className="text-body text-white/58">
                            {doc.label} · {propertyTitle}
                        </DialogDescription>
                    </DialogHeader>

                    {step === "checking" && (
                        <div className="flex min-h-40 items-center justify-center gap-3 text-body text-white/60">
                            <Loader2 className="size-4 animate-spin text-[var(--color-accent)]" />
                            Preparando solicitud...
                        </div>
                    )}

                    {step === "error" && (
                        <div className="space-y-4">
                            <p role="alert" className="border border-red-400/20 bg-red-400/10 p-3 text-body-sm text-red-100">{error}</p>
                            <Button type="button" onClick={() => setStep("form")} className="brushed-gold rounded-full px-5 text-black">
                                Intentar de nuevo
                            </Button>
                        </div>
                    )}

                    {step === "form" && (
                        <form onSubmit={submitProfile} className="space-y-4">
                            {error && <p role="alert" className="border border-red-400/20 bg-red-400/10 p-3 text-body-sm text-red-100">{error}</p>}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="space-y-2 text-body-sm text-white/62">
                                    Nombre completo
                                    <Input name="fullName" required minLength={2} autoComplete="name" className="border-white/[0.1] bg-white/[0.04] text-white" />
                                </label>
                                <label className="space-y-2 text-body-sm text-white/62">
                                    WhatsApp
                                    <Input name="phone" required inputMode="tel" autoComplete="tel" placeholder="+52 664 000 0000" className="border-white/[0.1] bg-white/[0.04] text-white" />
                                </label>
                            </div>
                            <label className="block space-y-2 text-body-sm text-white/62">
                                Correo opcional
                                <Input name="email" type="email" autoComplete="email" className="border-white/[0.1] bg-white/[0.04] text-white" />
                            </label>
                            <div className="space-y-3 border border-white/[0.08] bg-white/[0.025] p-3">
                                <label className="flex items-start gap-3 text-body-sm leading-5 text-white/66">
                                    <input name="acceptedNda" type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
                                    Acepto el NDA para consultar documentos privados de esta operación.
                                </label>
                                <label className="flex items-start gap-3 text-body-sm leading-5 text-white/66">
                                    <input name="acceptedPrivacy" type="checkbox" required className="mt-1 accent-[var(--color-accent)]" />
                                    Acepto el aviso de privacidad y el uso de mis datos para seguimiento inmobiliario.
                                </label>
                            </div>
                            <Button type="submit" className="brushed-gold min-h-11 w-full rounded-full px-5 text-black">
                                Solicitar documentos
                            </Button>
                        </form>
                    )}

                    {step === "code" && (
                        <form onSubmit={submitCode} className="space-y-4">
                            {error && <p role="alert" className="border border-red-400/20 bg-red-400/10 p-3 text-body-sm text-red-100">{error}</p>}
                            <div className="border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" />
                                    <p className="text-body-sm leading-6 text-white/70">
                                        Enviamos un código a tu WhatsApp. Al validarlo, quedará registrada tu solicitud y podrás abrir el documento.
                                    </p>
                                </div>
                            </div>
                            {devCode && (
                                <p className="border border-white/[0.08] bg-white/[0.025] p-3 text-body-sm text-white/62">
                                    Código de prueba local: <span className="font-semibold text-[var(--color-accent)]">{devCode}</span>
                                </p>
                            )}
                            <label className="block space-y-2 text-body-sm text-white/62">
                                Código de verificación
                                <Input name="code" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} className="border-white/[0.1] bg-white/[0.04] text-white" />
                            </label>
                            <Button type="submit" className="brushed-gold min-h-11 w-full rounded-full px-5 text-black">
                                Validar WhatsApp
                            </Button>
                        </form>
                    )}

                    {step === "ready" && (
                        <div className="space-y-5">
                            <div className="border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" />
                                    <div>
                                        <p className="text-body text-white">Solicitud registrada.</p>
                                        <p className="mt-1 text-body-sm leading-6 text-white/60">
                                            Tu acceso queda validado para futuras solicitudes mientras la sesión siga vigente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button asChild className="brushed-gold min-h-11 w-full rounded-full px-5 text-black">
                                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                                    Abrir documento
                                </a>
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
