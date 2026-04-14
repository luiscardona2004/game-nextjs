import Link from "next/link";
import { Suspense } from "react";
import ConsolesResults from "./ConsolesResults";
import ConsolesResultsFallback from "./ConsolesResultsFallback";
import ConsolesSearchBar from "./ConsolesSearchBar";

type ConsolesInfoProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function ConsolesInfo({ searchParams }: ConsolesInfoProps) {
  const params = await searchParams;
  const page = Number(params?.page) > 0 ? Number(params?.page) : 1;
  const search = params?.search?.trim() || "";

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">
              Biblioteca
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Catalogo de consolas</h1>
            <p className="mt-2 text-sm text-gray-400">
              Administra las consolas que estan disponibles para tus juegos.
            </p>
          </div>

          <Link
            href="/consoles/create"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-fuchsia-500/20"
          >
            + Agregar consola
          </Link>
        </div>

        <ConsolesSearchBar initialSearch={search} />

        <Suspense key={`${search}-${page}`} fallback={<ConsolesResultsFallback search={search} />}>
          <ConsolesResults page={page} search={search} />
        </Suspense>
      </div>
    </div>
  );
}
