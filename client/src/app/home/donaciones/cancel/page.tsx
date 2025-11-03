'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function DonationCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in">
        <XCircle size={64} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-700 mb-3">Donación Cancelada</h1>
        <p className="text-lg text-gray-700 mb-6">
          Tu donación ha sido cancelada. Si tienes algún problema, por favor contáctanos.
        </p>
        <Link
          href="/home/donaciones"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-500 transition-all duration-200"
        >
          Volver a Donar
        </Link>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
