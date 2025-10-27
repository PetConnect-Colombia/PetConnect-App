"use client";

import { useState } from "react";
import { PawPrint, Edit2, Trash2, PlusCircle, Save } from "lucide-react";
import { useDonations } from "@/hooks/useDonation";

export default function DonacionesList() {
  const { donations, loading } = useDonations();


  if (loading) return <p className="text-center py-8">Cargando campañas...</p>;

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <PawPrint className="text-[#3DD9D6] w-8 h-8" />
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Donaciones recibidas</h2>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border mt-4 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#e0f7fa] text-[#2D2D2D]">
              <th className="p-3">Nombre</th>
              <th className="p-3">Número de tarjeta</th>
              <th className="p-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((b: any) => (
              <tr key={b._id} className="border-t text-[#2D2D2D] hover:bg-[#f8fafc] transition">
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.cardNumber}</td>
                <td className="p-3 truncate max-w-xs">{b.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        .input {
          border: 1px solid #3dd9d6;
          color: #2d2d2d;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          outline: none;
          transition: 0.2s;
        }
        .btn-blue,
        .btn-yellow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }
        .btn-blue {
          background: #3dd9d6;
          color: white;
        }
        .btn-blue:hover {
          background: #2bb2b0;
        }
        .btn-yellow {
          background: #ffd93d;
          color: #2d2d2d;
        }
        .btn-yellow:hover {
          background: #ffe066;
        }
        .action-edit {
          color: #3dd9d6;
        }
        .action-edit:hover {
          text-decoration: underline;
          color: #2bb2b0;
        }
        .action-delete {
          color: #e63946;
        }
        .action-delete:hover {
          text-decoration: underline;
          color: #b91c1c;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
