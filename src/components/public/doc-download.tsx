import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocDownloadProps {
    url: string | null;
    label?: string;
}

export function DocDownload({ url, label = "Descargar Documento" }: DocDownloadProps) {
    if (!url) return null;

    return (
        <Button asChild className="w-full bg-gold-500 text-black hover:bg-gold-600 font-bold py-6 text-lg">
            <a href={url} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-5 w-5" />
                {label}
            </a>
        </Button>
    );
}
