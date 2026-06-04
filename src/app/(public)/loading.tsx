export default function Loading() {
    return (
        <div className="w-full flex-1 animate-pulse duration-1000" aria-busy="true" aria-label="Cargando contenido">
            {/* Hero skeleton */}
            <div className="h-[60vh] bg-zinc-900/50" />
            {/* Content skeleton */}
            <div className="container mx-auto px-4 py-16 space-y-8">
                <div className="h-8 bg-zinc-800 rounded w-1/3 mx-auto" />
                <div className="h-4 bg-zinc-800/60 rounded w-2/3 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[4/5] bg-zinc-800/40 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
