'use client';

import React from 'react';
import Link from 'next/link';
import { UserPlus, FileText, Send, CheckCircle } from 'lucide-react';

export default function StepsToAdoptSection() {
  const pasos = [
    {
      titulo: "Registro en la Plataforma",
      descripcion:
        "Crea una cuenta y completa tu perfil con información básica sobre ti y tu hogar.",
      icon: UserPlus,
    },
    {
      titulo: "Diligenciar Formulario",
      descripcion:
        "Completa el formulario de adopción con detalles sobre tu experiencia y entorno.",
      icon: FileText,
    },
    {
      titulo: "Envío de Solicitud",
      descripcion:
        "Envía tu solicitud para la mascota que te interese y espera la revisión de nuestro equipo.",
      icon: Send,
    },
    {
      titulo: "Confirmación y Aprobación",
      descripcion:
        "Recibe la aprobación final y prepárate para llevar a tu nueva mascota a casa.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">Pasos para Adoptar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pasos.map((paso, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-[#3DD9D6]"
            >
              <paso.icon size={48} className="text-[#3DD9D6] mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{paso.titulo}</h3>
              <p className="text-gray-600 text-sm">{paso.descripcion}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/home/como-adoptar" passHref>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#27CCF5] hover:bg-[#02A7CF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Más Detalles sobre la Adopción
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
