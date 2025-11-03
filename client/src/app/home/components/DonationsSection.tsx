'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';

export default function DonationsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <HeartHandshake size={64} className="text-[#3DD9D6] mx-auto mb-6" />
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Apoya Nuestra Causa</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Tu generosidad transforma vidas. Cada donación se destina directamente a proporcionar alimento, atención veterinaria, refugio seguro y programas de adopción para mascotas necesitadas. Juntos, podemos darles una segunda oportunidad.
        </p>
        <Link href="/home/donaciones" passHref>
          <button className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#27CCF5] hover:bg-[#02A7CF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
            <span className="mr-2">💖</span> Haz tu Donación
          </button>
        </Link>
      </div>
    </section>
  );
}
