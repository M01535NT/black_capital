import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
    label: string;
    url: string;
}

interface DocListProps {
    documents: Document[] | null;
}

export function DocList({ documents }: DocListProps) {
    if (!documents || documents.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold mb-3">Documentos</h3>
            {documents.map((doc, i) => (
                <Button
                    key={i}
                    asChild
                    variant="outline"
                    className="w-full justify-start font-medium border-foreground/20 hover:bg-muted py-5 text-base"
                >
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                        <FileText className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0" />
                        <span className="truncate">{doc.label}</span>
                        <Download className="ml-auto h-4 w-4 text-muted-foreground" />
                    </a>
                </Button>
            ))}
        </div>
    );
}
