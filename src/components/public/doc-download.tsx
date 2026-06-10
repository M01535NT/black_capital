"use client";

import { FileText, FileCheck, FileSearch, Ruler } from "lucide-react";
import { GatedBrochure } from "@/components/public/gated-brochure";

interface Document {
    label: string;
    url: string;
}

interface DocDownloadProps {
    documents: Document[] | null;
    propertyId: string;
    propertyName: string;
}

const DOC_ICONS: Record<string, typeof FileText> = {
    escrituras: FileCheck,
    avaluo: FileSearch,
    planos: Ruler,
    brochure: FileText,
};

function getDocType(label: string): string {
    const lower = label.toLowerCase();
    if (lower.includes("escritura")) return "escrituras";
    if (lower.includes("avalu") || lower.includes("valu")) return "avaluo";
    if (lower.includes("plano") || lower.includes("arquitect")) return "planos";
    return "brochure";
}

function getDocIcon(label: string) {
    const type = getDocType(label);
    return DOC_ICONS[type] || FileText;
}

function getDocColor(label: string): string {
    const type = getDocType(label);
    const colors: Record<string, string> = {
        escrituras: "text-white/70 bg-white/[0.04] border-white/[0.08]",
        avaluo: "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20",
        planos: "text-white/60 bg-white/[0.035] border-white/[0.08]",
        brochure: "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20",
    };
    return colors[type] || colors.brochure;
}

export function DocDownload({ documents, propertyId, propertyName }: DocDownloadProps) {
    if (!documents || documents.length === 0) return null;

    return (
        <div>
            <h2 className="text-display-3 font-display font-semibold tracking-display uppercase text-body-xl tracking-tight text-foreground mb-4">
                Documentos Disponibles
            </h2>
            <p className="text-body-sm text-foreground/50 mb-6 leading-relaxed">
                Para acceder a cualquier documento, comparte tus datos y te lo enviamos
                directamente a tu correo electrónico.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc, i) => {
                    const Icon = getDocIcon(doc.label);
                    const colorClasses = getDocColor(doc.label);
                    return (
                        <div
                            key={i}
                            className="group flex items-center gap-4 border border-white/[0.08] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-[var(--color-accent)]/30"
                        >
                            <div className={`flex size-11 shrink-0 items-center justify-center border transition-colors duration-300 ${colorClasses}`}>
                                <Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {doc.label}
                                </p>
                                <p className="text-caption text-foreground/50 mt-0.5">
                                    PDF · Recibirás en tu correo
                                </p>
                            </div>
                            <GatedBrochure
                                propertyId={propertyId}
                                propertyName={propertyName}
                                pdfUrl={doc.url}
                                label="Descargar"
                                docType={getDocType(doc.label)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
