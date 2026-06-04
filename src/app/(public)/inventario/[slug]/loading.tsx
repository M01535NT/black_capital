export default function PropertyLoading() {
    return (
        <div className="w-full min-h-screen bg-background" aria-busy="true" aria-label="Cargando propiedad">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-6 space-y-8">
                {/* Gallery skeleton */}
                <div className="rounded-2xl overflow-hidden">
                    <div className="skeleton-shimmer aspect-[16/9] sm:aspect-[16/10]" />
                    {/** Thumbnails */}
                    <div className="flex gap-2 p-3 bg-foreground/[0.02]">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton-shimmer size-[64px] rounded-lg shrink-0" />
                        ))}
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="skeleton-shimmer skeleton-text-sm w-32 h-3" />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left column */}
                    <div className="flex-1 min-w-0 space-y-8">
                        {/* Header */}
                        <div className="space-y-3">
                            <div className="skeleton-shimmer skeleton-text-sm w-20 h-3" />
                            <div className="skeleton-shimmer skeleton-text w-3/4 h-9" />
                            <div className="skeleton-shimmer skeleton-text-sm w-48 h-3.5" />
                            <div className="skeleton-shimmer skeleton-text w-40 h-7 mt-2" />
                        </div>

                        <div className="h-px bg-foreground/5" />

                        {/* Metrics grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-xl border border-foreground/5 p-4 space-y-2">
                                    <div className="skeleton-shimmer skeleton-text-sm w-16 h-3" />
                                    <div className="skeleton-shimmer skeleton-text w-20 h-5" />
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-foreground/5" />

                        {/* Description lines */}
                        <div className="space-y-3">
                            {[90, 85, 70, 80, 60].map((w, i) => (
                                <div key={i} className="skeleton-shimmer skeleton-text-sm" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="lg:w-80 space-y-6">
                        <div className="skeleton-shimmer rounded-2xl h-48" />
                        <div className="skeleton-shimmer rounded-xl h-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}
