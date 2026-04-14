"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type ConsolesSearchBarProps = {
  initialSearch: string;
};

export default function ConsolesSearchBar({ initialSearch }: ConsolesSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set("search", trimmedQuery);
    } else {
      params.delete("search");
    }

    params.delete("page");

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(nextUrl);
    });
  };

  const handleClear = () => {
    setQuery("");
    startTransition(() => {
      router.replace(pathname);
    });
  };

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            name="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o fabricante..."
            className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
          />
          {isPending && (
            <div className="pointer-events-none absolute inset-x-4 bottom-2 h-[2px] overflow-hidden rounded-full bg-cyan-400/10">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            isPending
              ? "cursor-not-allowed bg-cyan-400/70 text-slate-950"
              : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          }`}
        >
          {isPending ? "Buscando..." : "Buscar"}
        </button>

        {query.trim() && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isPending}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Limpiar
          </button>
        )}
      </form>

      <div className="mt-3 min-h-6 text-sm text-gray-400">
        {isPending ? (
          <p className="mt-4 inline-flex items-center gap-2 text-cyan-300">
            <span className="loading loading-ring loading-sm text-cyan-400" />
            Actualizando resultados...
          </p>
        ) : query.trim() ? (
          <p className="mt-4">
            Filtra el catalogo usando <span className="text-cyan-300">"{query.trim()}"</span>.
          </p>
        ) : (
          <p className="mt-4"></p>
        )}
      </div>
    </div>
  );
}
