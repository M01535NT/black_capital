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
        escrituras: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        avaluo: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        planos: "text-purple-400 bg-purple-500/10 border-purple-500/20",
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
                            className="group flex items-center gap-4 p-4 rounded-2xl border border-foreground/5 bg-card hover:border-[var(--color-accent)]/30 hover:shadow-[0_0_32px_-8px_rgba(210,167,60,0.12)] transition-all duration-300"
                        >
                            <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-300 ${colorClasses}`}>
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
