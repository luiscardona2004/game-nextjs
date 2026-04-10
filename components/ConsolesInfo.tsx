import { PrismaClient } from "../app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import FormActionButton from "./FormActionButton";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function deleteConsole(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (Number.isNaN(id)) {
    throw new Error("ID de consola invalido.");
  }

  const consoleItem = await prisma.console.findUnique({
    where: { id },
    include: { _count: { select: { games: true } } },
  });

  if (!consoleItem) {
    throw new Error("La consola no existe.");
  }

  if (consoleItem._count.games > 0) {
    throw new Error("No puedes eliminar una consola que tiene juegos asociados.");
  }

  await prisma.console.delete({
    where: { id },
  });

  revalidatePath("/consoles");
}

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
  const itemsPerPage = 8;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { manufacturer: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const totalConsoles = await prisma.console.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalConsoles / itemsPerPage));
  const currentPage = Math.min(page, totalPages);

  const consoles = await prisma.console.findMany({
    where,
    include: { _count: { select: { games: true } } },
    orderBy: { name: "asc" },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  const createPageLink = (newPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    query.set("page", String(newPage));
    return `?${query.toString()}`;
  };

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
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-fuchsia-500/20"
          >
            + Agregar consola
          </Link>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <form action="/consoles" method="GET" className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Buscar por nombre o fabricante..."
              className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
            />
            <button
              type="submit"
              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Buscar
            </button>
            {search && (
              <Link
                href="/consoles"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Limpiar
              </Link>
            )}
          </form>
        </div>

        {consoles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {consoles.map((consoleItem) => (
              <div
                key={consoleItem.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={`/img/${consoleItem.image}`} alt={consoleItem.name} fill className="object-cover" />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-white">{consoleItem.name}</h2>
                  <p className="mt-1 text-sm text-gray-400">{consoleItem.manufacturer}</p>
                  <p className="mt-3 line-clamp-3 text-sm text-gray-300">{consoleItem.description}</p>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(consoleItem.releasedate).getFullYear()}</span>
                    <span>{consoleItem._count.games} juegos</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link href={`/consoles/${consoleItem.id}`} className="rounded-xl bg-cyan-500/15 px-3 py-2 text-center text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/30">
                      Ver
                    </Link>
                    <Link href={`/consoles/${consoleItem.id}/edit`} className="rounded-xl bg-amber-500/15 px-3 py-2 text-center text-xs font-medium text-amber-300 transition hover:bg-amber-500/30">
                      Editar
                    </Link>
                    {consoleItem._count.games > 0 ? (
                      <span className="rounded-xl bg-white/5 px-3 py-2 text-center text-xs font-medium text-gray-500">
                        En uso
                      </span>
                    ) : (
                      <form action={deleteConsole}>
                        <input type="hidden" name="id" value={consoleItem.id} />
                        <FormActionButton
                          label="Eliminar"
                          pendingLabel="Eliminando..."
                          confirmMessage={`Estas seguro de eliminar "${consoleItem.name}"?`}
                          className="w-full rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/30"
                        />
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-xl font-semibold text-white">No se encontraron consolas</h3>
            <p className="mt-2 text-sm text-gray-400">Intenta con otro termino de busqueda.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <Link href={createPageLink(Math.max(1, currentPage - 1))} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${currentPage === 1 ? "pointer-events-none bg-white/5 text-gray-600" : "bg-white/10 text-white hover:bg-white/20"}`}>
              Anterior
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={createPageLink(p)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${p === currentPage ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
                {p}
              </Link>
            ))}
            <Link href={createPageLink(Math.min(totalPages, currentPage + 1))} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${currentPage === totalPages ? "pointer-events-none bg-white/5 text-gray-600" : "bg-white/10 text-white hover:bg-white/20"}`}>
              Siguiente
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
