export function Eyebrow({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <span className="h-px w-10 bg-[var(--color-accent)]/60" />
      <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
        {label}
      </span>
    </div>
  );
}
