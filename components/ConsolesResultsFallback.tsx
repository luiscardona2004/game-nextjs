type ConsolesResultsFallbackProps = {
  search: string;
};

export default function ConsolesResultsFallback({ search }: ConsolesResultsFallbackProps) {
  return (
    <div className="transition-opacity duration-300">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-400">
          {search ? (
            <>
              Buscando consolas para <span className="text-cyan-400">"{search}"</span>...
            </>
          ) : (
            <>Cargando consolas...</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-xl"
          >
            <div className="flex h-48 w-full items-center justify-center bg-[#11182d]">
              <span className="loading loading-ring loading-lg text-cyan-400" />
            </div>

            <div className="space-y-3 p-4">
              <div className="h-6 rounded-xl bg-white/10" />
              <div className="h-4 w-2/3 rounded-xl bg-white/10" />
              <div className="h-16 rounded-2xl bg-white/10" />
              <div className="h-4 w-1/2 rounded-xl bg-white/10" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-9 rounded-xl bg-white/10" />
                <div className="h-9 rounded-xl bg-white/10" />
                <div className="h-9 rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
