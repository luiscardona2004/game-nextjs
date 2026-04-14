import { PrismaClient } from "../../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import FormActionButton from "@/components/FormActionButton";
import { resolveStoredImageSrc } from "@/lib/image-src";

function formatStableDate(date: Date | string) {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getUTCDate()).padStart(2, "0");
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
  const year = parsedDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function deleteConsole(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  if (Number.isNaN(id)) throw new Error("ID de consola invalido.");

  const consoleItem = await prisma.console.findUnique({
    where: { id },
    include: { _count: { select: { games: true } } },
  });

  if (!consoleItem) throw new Error("La consola no existe.");
  if (consoleItem._count.games > 0) {
    throw new Error("No puedes eliminar una consola que tiene juegos asociados.");
  }

  await prisma.console.delete({ where: { id } });
  revalidatePath("/consoles");
  redirect("/consoles?alert=console-deleted");
}

type ConsoleDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsoleDetail({ params }: ConsoleDetailProps) {
  const { id } = await params;
  const consoleId = Number(id);
  if (Number.isNaN(consoleId)) notFound();

  const consoleItem = await prisma.console.findUnique({
    where: { id: consoleId },
    include: {
      games: { orderBy: { title: "asc" }, take: 6 },
      _count: { select: { games: true } },
    },
  });

  if (!consoleItem) notFound();

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/consoles" className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
            Volver al catalogo
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            <div className="flex items-start justify-center border-b border-white/10 bg-black/20 p-6 md:border-b-0 md:border-r md:p-8">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11182d] p-2 shadow-xl">
                <div className="relative h-[180px] w-[180px] overflow-hidden rounded-xl">
                  <img src={resolveStoredImageSrc(consoleItem.image)} alt={consoleItem.name} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">Consola</p>
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">{consoleItem.name}</h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-sm text-cyan-300">{consoleItem.manufacturer}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">{consoleItem._count.games} juegos</span>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-400">Lanzamiento</p>
                <p className="mt-1 text-sm font-medium text-white">{formatStableDate(consoleItem.releasedate)}</p>
              </div>

              <div className="mt-8">
                <h2 className="mb-3 text-lg font-semibold text-white">Descripcion</h2>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="leading-7 text-gray-300">{consoleItem.description}</p>
                </div>
              </div>

              {consoleItem.games.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-lg font-semibold text-white">Juegos relacionados</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {consoleItem.games.map((game) => (
                      <Link key={game.id} href={`/games/${game.id}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300 transition hover:bg-white/10">
                        {game.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/consoles/${consoleItem.id}/edit`} className="rounded-2xl bg-amber-500/15 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/30">
                  Editar
                </Link>
                {consoleItem._count.games > 0 ? (
                  <span className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-gray-500">No se puede eliminar</span>
                ) : (
                  <form action={deleteConsole}>
                    <input type="hidden" name="id" value={consoleItem.id} />
                    <FormActionButton
                      label="Eliminar"
                      pendingLabel="Eliminando..."
                      confirmMessage={`Estas seguro de eliminar "${consoleItem.name}"?`}
                      className="rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/30"
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
