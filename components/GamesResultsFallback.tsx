type GamesResultsFallbackProps = {
  search: string;
};

export default function GamesResultsFallback({ search }: GamesResultsFallbackProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm text-cyan-300">
            <span className="loading loading-ring loading-sm text-cyan-400" />
            {search ? `Buscando "${search}"...` : "Cargando catalogo..."}
          </p>
          <div className="mt-3 h-4 w-72 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="h-4 w-36 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-xl"
          >
            <div className="h-56 animate-pulse bg-white/10" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-9 animate-pulse rounded-xl bg-cyan-500/10" />
                <div className="h-9 animate-pulse rounded-xl bg-amber-500/10" />
                <div className="h-9 animate-pulse rounded-xl bg-rose-500/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
