'use client';

import { PieChart } from '@mui/x-charts/PieChart';
import DonationModal from '@/app/home/donaciones/components/DonationModal';
import { useEffect, useState } from 'react';
import { useDonations } from '@/hooks/useDonation';

export default function Donaciones() {
  const [open, setOpen] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  // Simulación de total donado
  const totalDonado = 3000000;

  return (
    <div className="flex flex-col items-center gap-20 justify-center min-h-screen py-20 bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] transition-colors duration-500">
      <div className="flex flex-col gap-2 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold text-[#3DD9D6] drop-shadow-lg">Apoya a Nuestra Causa</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">Tu donación nos permite seguir rescatando y cuidando a más animales.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 justify-center text-center mx-4 md:mx-20 w-full max-w-5xl">
        <div className="flex flex-col gap-4 md:w-1/2 text-left bg-white/80 rounded-2xl p-8 shadow-lg animate-fade-in">
          <h2 className="text-3xl font-bold text-[#3DD9D6] mb-2">¿Cómo se invierte tu ayuda?</h2>
          <p className="text-lg text-gray-600">Cada contribución es vital. Con tu apoyo, podemos proporcionar alimento, atención veterinaria, refugio y programas de esterilización. Este gráfico muestra cómo distribuimos los recursos para maximizar el impacto de cada donación en el bienestar de nuestros animales.</p>
          <button
            className="bg-[#3DD9D6] text-white text-lg font-semibold px-6 py-3 rounded-full mt-4 w-fit hover:bg-[#32b8b5] focus:ring-2 focus:ring-[#3DD9D6] focus:outline-none shadow transition-all duration-200"
            onClick={() => setOpen(true)}
            aria-label="Hacer donación"
          >
            Hacer donación
          </button>
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-gray-500 text-sm">Total donado este mes:</span>
            <span className="text-2xl font-bold text-[#3DD9D6]">${totalDonado.toLocaleString('es-CO')}</span>
          </div>
          {showThanks && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-center animate-fade-in">
              ¡Gracias por tu generosidad! 💙
            </div>
          )}
        </div>

        <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xl flex items-center justify-center animate-fade-in">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 2000000.0, label: 'Alimento y suministros' },
                  { id: 1, value: 500000.0, label: 'Atención veterinaria' },
                  { id: 2, value: 300000.0, label: 'Mantenimiento del refugio' },
                  { id: 3, value: 200000.0, label: 'Programas de esterilización' },
                ],
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            height={260}
            slotProps={{
              legend: {
                position: { vertical: 'middle'},
              },
            }}
          />
        </article>
      </div>

      <DonationModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />

      {/* Animaciones Tailwind personalizadas */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}