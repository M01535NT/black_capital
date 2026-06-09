import { FileText, ArrowUpRight } from "lucide-react";

export interface DocumentLink {
    label: string;
    url: string;
}

/**
 * One document link row inside the "Documentos" sidebar card.
 */
export function DocumentCard({ doc }: { doc: DocumentLink }) {
    return (
        <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-foreground/5 hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/[0.03] transition-all group"
        >
            <div className="size-9 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--color-accent)]/20">
                <FileText className="size-4 text-[var(--color-accent)]" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-body text-foreground truncate group-hover:text-[var(--color-accent)] transition-colors">
                    {doc.label}
                </p>
                <p className="text-caption text-foreground/50 uppercase tracking-wider">PDF</p>
            </div>
            <ArrowUpRight className="size-3.5 text-foreground/50 group-hover:text-[var(--color-accent)] transition-colors shrink-0" />
        </a>
    );
}
