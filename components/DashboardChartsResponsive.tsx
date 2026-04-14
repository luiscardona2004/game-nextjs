"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
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

type DashboardChartsResponsiveProps = {
  consolesByGames: ConsoleChartItem[];
  gamesPerYear: GamesPerYearItem[];
};

const PIE_COLORS = ["#22d3ee", "#f97316", "#f43f5e", "#a855f7", "#84cc16", "#eab308"];

export default function DashboardChartsResponsive({
  consolesByGames,
  gamesPerYear,
}: DashboardChartsResponsiveProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pieData = consolesByGames.filter((item) => item.value > 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section className="flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:p-5">
        <div className="mb-3 w-full text-left sm:px-3">
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan-300/80 sm:text-sm">
            Consolas
          </p>
          <h2 className="mt-2 text-lg font-bold text-white sm:ml-4 sm:text-xl">
            Juegos por consola
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {!isMounted ? (
            <div className="flex h-[300px] w-full items-center justify-center sm:h-[330px]">
              <span className="loading loading-ring loading-xl text-cyan-400" />
            </div>
          ) : pieData.length > 0 ? (
            <div className="h-[300px] w-full sm:h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="42%"
                    innerRadius={40}
                    outerRadius="58%"
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                    iconSize={10}
                  />
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
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No hay datos de juegos por consola para mostrar.</p>
          )}
        </div>
      </section>

      <section className="flex min-h-[360px] flex-col rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md sm:p-5">
        <div className="mb-3">
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300/80 sm:text-sm">
            Lanzamientos
          </p>
          <h2 className="mt-2 text-lg font-bold text-white sm:text-xl">Juegos por año</h2>
          <p className="mt-2 text-sm text-gray-400">
            Distribucion de juegos segun el año de lanzamiento.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {!isMounted ? (
            <div className="flex h-[280px] w-full items-center justify-center sm:h-[300px]">
              <span className="loading loading-ring loading-xl text-fuchsia-400" />
            </div>
          ) : gamesPerYear.length > 0 ? (
            <div className="h-[280px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gamesPerYear} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fontSize: 12 }} />
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
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No hay datos de juegos por ano para mostrar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
