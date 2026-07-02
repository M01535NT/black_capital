export default function PropertyLoading() {
    return (
        <div className="min-h-screen w-full bg-background" aria-busy="true" aria-label="Cargando propiedad">
            {/* Encabezado compacto */}
            <div className="border-b border-white/[0.06] pt-24 lg:pt-28">
                <div className="mx-auto max-w-[90rem] space-y-4 px-6 pb-7 sm:px-10 lg:px-16">
                    <div className="skeleton-shimmer h-3 w-28" />
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <div className="skeleton-shimmer h-5 w-44" />
                            <div className="skeleton-shimmer h-10 w-72 sm:w-96" />
                        </div>
                        <div className="skeleton-shimmer h-8 w-40" />
                    </div>
                </div>
            </div>

            {/* Galería */}
            <div className="border-b border-white/[0.06]">
                <div className="mx-auto max-w-[90rem] space-y-3 px-4 py-8 sm:px-10 lg:px-16">
                    <div className="skeleton-shimmer h-4 w-24" />
                    <div className="skeleton-shimmer aspect-[16/9] sm:aspect-[16/10]" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="skeleton-shimmer size-12 shrink-0" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Shell: índice + contenido */}
            <div className="mx-auto grid max-w-[90rem] grid-cols-1 px-4 sm:px-10 lg:grid-cols-[220px_1fr] lg:px-16">
                <div className="hidden space-y-4 border-r border-white/[0.06] py-10 pr-8 lg:block">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton-shimmer h-3.5 w-32" />
                    ))}
                </div>
                <div className="space-y-10 py-8 md:py-10 lg:pl-12">
                    <div className="space-y-3">
                        {[90, 85, 70, 80].map((w, i) => (
                            <div key={i} className="skeleton-shimmer h-3.5" style={{ width: `${w}%` }} />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-px border border-white/[0.06] bg-white/[0.04] sm:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2 bg-background p-4">
                                <div className="skeleton-shimmer h-5 w-16" />
                                <div className="skeleton-shimmer h-3 w-20" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="skeleton-shimmer h-4 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
