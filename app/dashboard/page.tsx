import { PrismaClient } from "../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import DashboardCharts from "@/components/DashboardCharts";
import SideBar from "@/components/SideBar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  const [totalGames, totalConsoles, consoles, games] = await Promise.all([
    prisma.game.count(),
    prisma.console.count(),
    prisma.console.findMany({
      include: { _count: { select: { games: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.game.findMany({
      select: { releasedate: true },
      orderBy: { releasedate: "asc" },
    }),
  ]);

  const consolesByGames = consoles.map((consoleItem) => ({
    name: consoleItem.name,
    value: consoleItem._count.games,
  }));

  const gamesPerYearMap = games.reduce<Record<string, number>>((accumulator, game) => {
    const year = String(new Date(game.releasedate).getFullYear());
    accumulator[year] = (accumulator[year] ?? 0) + 1;
    return accumulator;
  }, {});

  const gamesPerYear = Object.entries(gamesPerYearMap).map(([year, total]) => ({
    year,
    total,
  }));

  return (
    <SideBar currentPath="/dashboard">
      <div className="bg-[#0a0f1f] text-white">
        <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-7xl flex-col gap-3 overflow-hidden p-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">
              Dashboard
            </p>
            <h1 className="text-xl font-bold md:text-2xl">Resumen del catalogo</h1>
            <p className="mt-1 text-sm text-gray-400">
              Visualiza rapido cuantos juegos y consolas tienes registradas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-4 shadow-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Juegos</p>
              <p className="mt-2 text-3xl font-black text-white">{totalGames}</p>
              <p className="mt-1 text-sm text-cyan-100/80">Total de juegos registrados</p>
            </div>

            <div className="rounded-3xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 p-4 shadow-xl">
              <p className="ml-4 text-sm uppercase tracking-[0.25em] text-fuchsia-300/80">
                Consolas
              </p>
              <p className="mt-2 text-3xl font-black text-white">{totalConsoles}</p>
              <p className="mt-1 text-sm text-fuchsia-100/80">Total de consolas registradas</p>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <DashboardCharts consolesByGames={consolesByGames} gamesPerYear={gamesPerYear} />
          </div>
        </div>
      </div>
    </SideBar>
  );
}
