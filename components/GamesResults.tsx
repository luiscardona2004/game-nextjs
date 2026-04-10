import { PrismaClient } from "../app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import Link from "next/link";
import Imagen from "next/image";
import { revalidatePath } from "next/cache";
import FormActionButton from "./FormActionButton";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function deleteGame(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (Number.isNaN(id)) {
    throw new Error("ID de juego invalido.");
  }

  await prisma.game.delete({
    where: { id },
  });

  revalidatePath("/games");
}

type GamesResultsProps = {
  page: number;
  search: string;
};

export default async function GamesResults({ page, search }: GamesResultsProps) {
  const itemsPerPage = 10;

  const where = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            developer: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            genre: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            console: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      }
    : {};

  const totalGames = await prisma.game.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalGames / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startItem = totalGames === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem =
    totalGames === 0
      ? 0
      : Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, totalGames);

  const games = await prisma.game.findMany({
    where,
    include: { console: true },
    orderBy: { title: "asc" },
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
          <span className="font-semibold text-white">{totalGames}</span> juegos
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

      {games.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {games.map((game) => (
            <div
              key={game.id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Imagen
                  src={`/img/${game.cover}`}
                  alt={game.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-3 left-3 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur-sm">
                  {game.genre}
                </div>
              </div>

              <div className="p-4">
                <h2 className="line-clamp-1 text-lg font-bold text-white">{game.title}</h2>
                <p className="mt-1 text-sm text-gray-400">{game.console.name}</p>
                <p className="mt-1 text-xs text-gray-500">{game.developer}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-cyan-400">
                    ${Number(game.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(game.releasedate).getFullYear()}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Link
                    href={`/games/${game.id}`}
                    className="rounded-xl bg-cyan-500/15 px-3 py-2 text-center text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/30"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/games/${game.id}/edit`}
                    className="rounded-xl bg-amber-500/15 px-3 py-2 text-center text-xs font-medium text-amber-300 transition hover:bg-amber-500/30"
                  >
                    Editar
                  </Link>

                  <form action={deleteGame}>
                    <input type="hidden" name="id" value={game.id} />
                    <FormActionButton
                      label="Eliminar"
                      pendingLabel="Eliminando..."
                      confirmMessage={`Estas seguro de eliminar "${game.title}"? Esta accion no se puede deshacer.`}
                      className="w-full rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/30"
                    />
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <h3 className="text-xl font-semibold text-white">No se encontraron juegos</h3>
          <p className="mt-2 text-sm text-gray-400">Intenta con otro termino de busqueda.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={createPageLink(Math.max(1, currentPage - 1))}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              currentPage === 1
                ? "pointer-events-none bg-white/5 text-gray-600"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Anterior
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={createPageLink(p)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                p === currentPage
                  ? "bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {p}
            </Link>
          ))}

          <Link
            href={createPageLink(Math.min(totalPages, currentPage + 1))}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              currentPage === totalPages
                ? "pointer-events-none bg-white/5 text-gray-600"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Siguiente
          </Link>
        </div>
      )}
    </div>
  );
}
