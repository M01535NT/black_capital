export default function AdminLoading() {
    return (
        <div className="p-6 space-y-6" aria-busy="true" aria-label="Cargando panel de administración">
            {/* Title */}
            <div className="skeleton-shimmer skeleton-text w-48 h-8" />
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl border border-foreground/10 p-5 space-y-3">
                        <div className="skeleton-shimmer skeleton-text-sm w-24 h-3" />
                        <div className="skeleton-shimmer skeleton-text w-12 h-7" />
                        <div className="skeleton-shimmer skeleton-text-sm w-16 h-3" />
                    </div>
                ))}
            </div>
            {/* Table skeleton */}
            <div className="rounded-xl border border-foreground/10 overflow-hidden">
                <div className="skeleton-shimmer h-12" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4 p-4 border-t border-foreground/5">
                        <div className="skeleton-shimmer size-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="skeleton-shimmer skeleton-text w-1/3 h-4" />
                            <div className="skeleton-shimmer skeleton-text-sm w-1/5 h-3" />
                        </div>
                        <div className="skeleton-shimmer skeleton-text-sm w-16 h-4 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
