export default function PropertyLoading() {
    return (
        <div className="w-full animate-pulse" aria-busy="true" aria-label="Cargando propiedad">
            <div className="h-[50vh] bg-zinc-900/50" />
            <div className="container mx-auto px-4 py-8">
                <div className="h-4 bg-zinc-800 rounded w-24 mb-4" />
                <div className="h-10 bg-zinc-800 rounded w-3/4 mb-3" />
                <div className="h-6 bg-zinc-800/60 rounded w-1/2 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-4 bg-zinc-800/40 rounded w-full" />
                        <div className="h-4 bg-zinc-800/40 rounded w-5/6" />
                        <div className="h-4 bg-zinc-800/40 rounded w-4/6" />
                    </div>
                    <div className="h-72 bg-zinc-800/30 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
