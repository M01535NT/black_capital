export default function Loading() {
    return (
        <div className="w-full flex-1" aria-busy="true" aria-label="Cargando contenido">
            {/* Hero skeleton with shimmer */}
            <div className="relative h-[60vh] overflow-hidden">
                <div className="skeleton-shimmer w-full h-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="skeleton-shimmer skeleton-text w-64 h-8 mb-4" />
                    <div className="skeleton-shimmer skeleton-text-sm w-48 h-4" />
                </div>
            </div>
            {/* Content skeleton */}
            <div className="container mx-auto px-4 py-16 space-y-8">
                <div className="flex flex-col items-center gap-3 mb-12">
                    <div className="skeleton-shimmer skeleton-text w-full max-w-sm h-8" />
                    <div className="skeleton-shimmer skeleton-text-sm w-64 h-4 mt-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-foreground/5">
                            <div className="skeleton-shimmer aspect-[4/3]" />
                            <div className="p-5 space-y-3 bg-background">
                                <div className="skeleton-shimmer skeleton-text w-3/4 h-5" />
                                <div className="skeleton-shimmer skeleton-text-sm w-1/2 h-3 mt-2" />
                                <div className="flex justify-between pt-3 border-t border-foreground/5">
                                    <div className="skeleton-shimmer skeleton-text-sm w-20 h-3" />
                                    <div className="skeleton-shimmer skeleton-text-sm w-24 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
