'use client'
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function SolicitudesAdopcion() {
  const solicitudesMock = [
    { id: 1, nombre: 'Juan Pérez', mascota: 'Max', estado: 'Pendiente' },
    { id: 2, nombre: 'Ana Gómez', mascota: 'Luna', estado: 'Pendiente' },
  ];

  const [solicitudes, setSolicitudes] = useState(solicitudesMock);

  const handleEstado = (id: number, estado: string) => {
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id ? { ...s, estado } : s
      )
    );
  };

  const estadoColor = (estado: string) => {
    if (estado === 'Aceptada') return 'text-[#4BB543] bg-[#e8fbe6] border-[#7ED957]';
    if (estado === 'Rechazada') return 'text-[#E63946] bg-[#ffeaea] border-[#E63946]';
    return 'text-[#FFA23C] bg-[#fff5e6] border-[#FFA23C]';
  };

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="text-[#3DD9D6] w-8 h-8" />
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Solicitudes de Adopción</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#e0f7fa] text-[#2D2D2D]">
              <th className="p-3">Solicitante</th>
              <th className="p-3">Mascota</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id} className="text-[#2D2D2D] border-t hover:bg-[#f8fafc] transition">
                <td className="p-3">{s.nombre}</td>
                <td className="p-3">{s.mascota}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full border font-semibold text-sm ${estadoColor(s.estado)}`}>
                    {s.estado}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {s.estado === 'Pendiente' && (
                    <>
                      <button
                        onClick={() => handleEstado(s.id, 'Aceptada')}
                        className="flex items-center gap-1 bg-[#7ED957] text-white px-3 py-1 rounded hover:bg-[#4BB543] transition"
                      >
                        <CheckCircle2 size={16} /> Aceptar
                      </button>
                      <button
                        onClick={() => handleEstado(s.id, 'Rechazada')}
                        className="flex items-center gap-1 bg-[#E63946] text-white px-3 py-1 rounded hover:bg-[#b91c1c] transition"
                      >
                        <XCircle size={16} /> Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </section>
  );
}