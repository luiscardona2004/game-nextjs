import { PrismaClient } from "../app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import FormActionButton from "./FormActionButton";
import { resolveStoredImageSrc } from "@/lib/image-src";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function deleteConsole(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const redirectTo = String(formData.get("redirect_to") ?? "/consoles");

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
  redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}alert=console-deleted`);
}

type ConsolesResultsProps = {
  page: number;
  search: string;
};

export default async function ConsolesResults({ page, search }: ConsolesResultsProps) {
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
  const startItem = totalConsoles === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem =
    totalConsoles === 0
      ? 0
      : Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, totalConsoles);

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
    <div className="transition-opacity duration-300">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-400">
          Mostrando <span className="font-semibold text-white">{startItem}</span> -{" "}
          <span className="font-semibold text-white">{endItem}</span> de{" "}
          <span className="font-semibold text-white">{totalConsoles}</span> consolas
          {search && (
            <>
              {" "}
              para <span className="text-cyan-400">"{search}"</span>
            </>
          )}
        </p>

        <p className="text-sm text-gray-500">
          Pagina <span className="text-white">{currentPage}</span> de{" "}
          <span className="text-white">{totalPages}</span>
        </p>
      </div>

      {consoles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {consoles.map((consoleItem) => (
            <div
              key={consoleItem.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-xl"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img src={resolveStoredImageSrc(consoleItem.image)} alt={consoleItem.name} className="h-full w-full object-cover" />
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
                      <input type="hidden" name="redirect_to" value={`/consoles${createPageLink(currentPage)}`} />
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
  );
}
