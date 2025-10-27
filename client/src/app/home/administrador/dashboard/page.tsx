"use client";

import { BarChart } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { stats, loading, error } = useDashboard();

  if (loading)
    return <p className="text-center py-8 text-[#3DD9D6]">Cargando datos...</p>;
  if (error)
    return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  if (!stats)
    return <p className="text-center py-8 text-gray-500">Sin datos aún</p>;

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[#3DD9D6] mb-6">
        Dashboard de Administración
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#e0f7fa] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#3DD9D6]">
            {stats.totalMascotas}
          </span>
          <span className="text-gray-700 mt-2">Mascotas registradas</span>
        </div>
        <div className="bg-[#fff5e6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#FFA23C]">
            {stats.totalSolicitudes}
          </span>
          <span className="text-gray-700 mt-2">Solicitudes totales</span>
        </div>
        <div className="bg-[#e8fbe6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#7ED957]">
            {stats.solicitudesAceptadas}
          </span>
          <span className="text-gray-700 mt-2">Solicitudes aceptadas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold text-[#3DD9D6] mb-2">
            Mascotas por especie
          </h3>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: stats.perros, label: "Perros" },
                  { id: 1, value: stats.gatos, label: "Gatos" },
                ],
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            height={220}
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold text-[#3DD9D6] mb-2">
            Estado de solicitudes
          </h3>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: ["Pendientes", "Aceptadas", "Rechazadas"],
              },
            ]}
            series={[
              {
                data: [
                  stats.solicitudesPendientes,
                  stats.solicitudesAceptadas,
                  stats.solicitudesRechazadas,
                ],
                color: "#3DD9D6",
              },
            ]}
            height={220}
          />
        </div>
      </div>
    </section>
  );
}
