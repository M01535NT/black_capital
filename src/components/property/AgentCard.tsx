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
            <div className="size-14 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-semibold shrink-0 border border-gold-500/20 overflow-hidden">
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
                <p className="font-semibold text-foreground leading-tight text-[0.9375rem]">
                    {agent.full_name}
                </p>
                {agent.license_number && (
                    <p className="text-[11px] text-foreground/40 uppercase tracking-wider">
                        Céd. {agent.license_number}
                    </p>
                )}
                <div className="flex flex-col gap-1.5 pt-1">
                    {agent.phone && (
                        <a
                            href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition-colors w-fit"
                        >
                            <MessageCircle className="size-3" />
                            WhatsApp
                        </a>
                    )}
                    {agent.email && (
                        <a
                            href={`mailto:${agent.email}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/50 border border-foreground/10 text-xs font-medium hover:text-foreground/70 hover:border-foreground/20 transition-colors w-fit"
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
