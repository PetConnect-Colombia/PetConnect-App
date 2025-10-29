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

  // Data for Pie Chart (Pet Status)
  const petStatusData = [
    { id: 0, value: stats.adoptedPets, label: "Adoptadas", color: "#7ED957" },
    { id: 1, value: stats.availablePets, label: "Disponibles", color: "#3DD9D6" },
    { id: 2, value: stats.inProcessPets, label: "En Proceso", color: "#FFA23C" },
  ];

  // Data for Bar Chart (Request Status)
  const requestStatusData = [
    { id: 0, value: stats.pendingRequests, label: "Pendientes", color: "#FFA23C" },
    { id: 1, value: stats.approvedRequests, label: "Aprobadas", color: "#7ED957" },
    { id: 2, value: stats.rejectedRequests, label: "Rechazadas", color: "#FF6B6B" },
  ];
  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-[#3DD9D6] mb-6">
        Dashboard de Administración
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#e0f7fa] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#3DD9D6]">
            {stats.totalPets}
          </span>
          <span className="text-gray-700 mt-2">Mascotas Registradas</span>
        </div>
        <div className="bg-[#e8fbe6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#7ED957]">
            {stats.adoptedPets}
          </span>
          <span className="text-gray-700 mt-2">Mascotas Adoptadas</span>
        </div>
        <div className="bg-[#fff5e6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#FFA23C]">
            {stats.availablePets}
          </span>
          <span className="text-gray-700 mt-2">Mascotas Disponibles</span>
        </div>
        <div className="bg-[#ffe0f7] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#D93DD6]">
            {stats.inProcessPets}
          </span>
          <span className="text-gray-700 mt-2">Mascotas en Proceso</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold text-[#3DD9D6] mb-2">
            Mascotas por Especie
          </h3>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: stats.petsByKind.Perro || 0, label: "Perros" },
                  { id: 1, value: stats.petsByKind.Gato || 0, label: "Gatos" },
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
            Estado de Solicitudes de Adopción
          </h3>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: requestStatusData.map(item => item.label),
              },
            ]}
            series={[
              {
                data: requestStatusData.map(item => item.value),
              },
            ]}
            height={220}
          />
        </div>
      </div>

      {/* Additional Request Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#fff5e6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#FFA23C]">
            {stats.pendingRequests}
          </span>
          <span className="text-gray-700 mt-2">Solicitudes Pendientes</span>
        </div>
        <div className="bg-[#e8fbe6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#7ED957]">
            {stats.approvedRequests}
          </span>
          <span className="text-gray-700 mt-2">Solicitudes Aprobadas</span>
        </div>
        <div className="bg-[#fbe6e6] rounded-xl p-6 flex flex-col items-center shadow">
          <span className="text-4xl font-bold text-[#FF6B6B]">
            {stats.rejectedRequests}
          </span>
          <span className="text-gray-700 mt-2">Solicitudes Rechazadas</span>
        </div>
      </div>
    </section>
  );
}