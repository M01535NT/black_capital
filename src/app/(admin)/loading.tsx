export default function AdminLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse" aria-busy="true" aria-label="Cargando panel de administración">
            <div className="h-8 bg-zinc-800 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 bg-zinc-800/40 rounded-xl" />
                ))}
            </div>
            <div className="h-64 bg-zinc-800/30 rounded-xl" />
        </div>
    );
}
