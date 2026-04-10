"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ConsoleChartItem = {
  name: string;
  value: number;
};

type GamesPerYearItem = {
  year: string;
  total: number;
};

type DashboardChartsProps = {
  consolesByGames: ConsoleChartItem[];
  gamesPerYear: GamesPerYearItem[];
};

const PIE_COLORS = ["#22d3ee", "#f97316", "#f43f5e", "#a855f7", "#84cc16", "#eab308"];

export default function DashboardCharts({
  consolesByGames,
  gamesPerYear,
}: DashboardChartsProps) {
  const pieData = consolesByGames.filter((item) => item.value > 0);

  return (
    <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-2">
      <section className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md xl:min-h-[360px]">
        <div className="mb-3 w-full px-6 text-left">
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-cyan-300/80">Consolas</p>
          <h2 className="mt-2 ml-4 text-xl font-bold text-white">Juegos por consola</h2>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          {pieData.length > 0 ? (
            <PieChart width={360} height={330}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="42%"
                innerRadius={45}
                outerRadius={90}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ paddingTop: "16px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
                formatter={(value, name) => [`${value} juegos`, name]}
              />
            </PieChart>
          ) : (
            <p className="text-sm text-gray-400">No hay datos de juegos por consola para mostrar.</p>
          )}
        </div>
      </section>

      <section className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
        <div className="mb-3">
          <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300/80">Lanzamientos</p>
          <h2 className="mt-2 text-xl font-bold text-white">Juegos por año</h2>
          <p className="mt-2 text-sm text-gray-400">
            Distribucion de juegos segun el año de lanzamiento.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center">
          {gamesPerYear.length > 0 ? (
            <BarChart width={520} height={260} data={gamesPerYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
                }}
                formatter={(value) => [`${value} juegos`, "Cantidad"]}
              />
              <Bar dataKey="total" fill="#22d3ee" radius={[12, 12, 0, 0]} />
            </BarChart>
          ) : (
            <p className="text-sm text-gray-400">No hay datos de juegos por año para mostrar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
