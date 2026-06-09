export function Eyebrow({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <span className="h-px w-10 bg-[var(--color-accent)]/60" />
      <span className="text-caption text-white/70">
        {label}
      </span>
    </div>
  );
}
