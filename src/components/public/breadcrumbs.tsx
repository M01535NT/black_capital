import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const allItems: BreadcrumbItem[] = [{ label: "Inicio", href: "/" }, ...items];
    const parentItem = [...allItems].reverse().find((item, index) => index > 0 && item.href);
    const currentItem = allItems[allItems.length - 1];

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
            <nav aria-label="Breadcrumb" className="min-w-0">
                {parentItem?.href ? (
                    <Link
                        href={parentItem.href}
                        className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-white/[0.08] px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/56 transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
                    >
                        <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">Volver a {parentItem.label}</span>
                    </Link>
                ) : (
                    <span className="block truncate text-sm text-white/45">{currentItem.label}</span>
                )}
            </nav>
        </>
    );
}
