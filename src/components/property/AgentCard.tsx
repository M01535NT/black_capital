import Image from "next/image";
import { MessageCircle, Mail } from "lucide-react";

export interface AgentInfo {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    license_number: string | null;
}

/**
 * Renders one or many agents with photo, name, license, and WhatsApp/email buttons.
 * The wrapper title (Asesor a Cargo / Asesores a Cargo) is owned by the caller.
 */
export function AgentCard({ agent }: { agent: AgentInfo }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 font-semibold text-[var(--color-accent)]">
                {agent.photo_url ? (
                    <Image
                        src={agent.photo_url}
                        alt={agent.full_name}
                        width={56}
                        height={56}
                        className="size-full object-cover"
                    />
                ) : (
                    <span className="text-lg">{agent.full_name.charAt(0).toUpperCase()}</span>
                )}
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
                <p className="font-semibold leading-tight text-white">
                    {agent.full_name}
                </p>
                {agent.license_number && (
                    <p className="text-caption uppercase tracking-wider text-white/45">
                        Céd. {agent.license_number}
                    </p>
                )}
                <div className="flex flex-col gap-1.5 pt-1">
                    {agent.phone && (
                        <a
                            href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
                        >
                            <MessageCircle className="size-3" />
                            WhatsApp
                        </a>
                    )}
                    {agent.email && (
                        <a
                            href={`mailto:${agent.email}`}
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/56 transition-colors hover:border-white/18 hover:text-white"
                        >
                            <Mail className="size-3" />
                            Email
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
