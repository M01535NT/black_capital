import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const allItems: BreadcrumbItem[] = [
        { label: "Inicio", href: "/" },
        ...items,
    ];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: allItems.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-sm text-foreground/40">
                    {allItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-foreground/20 shrink-0" />}
                            {i === allItems.length - 1 || !item.href ? (
                                <span className="text-foreground/70 font-medium truncate max-w-[180px] sm:max-w-[260px]">
                                    {i === 0 && <Home className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />}
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-gold-500 transition-colors truncate max-w-[180px] sm:max-w-[260px]"
                                >
                                    {i === 0 && <Home className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />}
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
