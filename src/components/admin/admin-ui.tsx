import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const adminCardClass =
    "min-w-0 max-w-full border border-white/[0.08] bg-white/[0.025] shadow-[0_18px_70px_rgba(0,0,0,0.24)]";

export function AdminPageHeader({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: { label: string; href: string; icon?: LucideIcon };
}) {
    const Icon = action?.icon;

    return (
        <div className="flex min-w-0 flex-col gap-5 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] gold-ink">
                        {eyebrow}
                    </p>
                )}
                <h1 className="break-words text-3xl leading-tight tracking-normal text-white sm:text-4xl lg:text-5xl">
                    {title}
                </h1>
                {description && (
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <Link
                    href={action.href}
                    className="brushed-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold"
                >
                    {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                    {action.label}
                </Link>
            )}
        </div>
    );
}

export function AdminStatCard({
    href,
    icon: Icon,
    label,
    value,
    note,
    accent = "gold",
}: {
    href?: string;
    icon: LucideIcon;
    label: string;
    value: string | number;
    note?: string;
    accent?: "gold" | "green" | "blue" | "muted";
}) {
    const content = (
        <div className={cn(adminCardClass, "group p-5 transition-colors hover:border-[var(--color-accent)]/30")}>
            <div className="mb-5 flex items-center justify-between">
                <span
                    className={cn(
                        "flex h-10 w-10 items-center justify-center border",
                        accent === "gold" && "gold-gradient border-[var(--color-accent)]/25 text-black",
                        accent === "green" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                        accent === "blue" && "border-sky-500/20 bg-sky-500/10 text-sky-400",
                        accent === "muted" && "border-white/[0.08] bg-white/[0.035] text-white/60",
                    )}
                >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {href && <ArrowRight className="h-4 w-4 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]" />}
            </div>
            <p className="text-4xl leading-none text-white">{value}</p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">{label}</p>
            {note && <p className="mt-2 text-xs leading-5 text-white/50">{note}</p>}
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

export function AdminSectionCard({
    title,
    action,
    children,
    className,
}: {
    title: string;
    action?: { label: string; href: string };
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn(adminCardClass, "p-5", className)}>
            <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
                <h2 className="min-w-0 text-[11px] font-bold uppercase tracking-[0.18em] text-white/48">{title}</h2>
                {action && (
                    <Link href={action.href} className="text-[11px] font-bold uppercase tracking-[0.14em] gold-ink">
                        {action.label}
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
}

export function AdminEmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: { label: string; href: string };
}) {
    return (
        <div className={cn(adminCardClass, "px-6 py-14 text-center")}>
            <div className="gold-gradient mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-[var(--color-accent)]/25 text-black">
                <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl text-white">{title}</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">{description}</p>
            {action && (
                <Link href={action.href} className="brushed-gold mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-bold">
                    {action.label}
                </Link>
            )}
        </div>
    );
}

