"use client";

import Image from "next/image";

interface PetProfileModalProps {
  open: boolean;
  pet: any | null;
  onClose: () => void;
}

export default function PetProfileModal({ open, pet, onClose }: PetProfileModalProps) {
  if (!open || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-[90%] max-w-lg animate-fade-in">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-[#3DD9D6] text-2xl font-bold"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Imagen */}
        <div className="relative w-full h-60 mb-5 rounded-xl overflow-hidden">
          <Image
            src={pet.image}
            alt={pet.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* Información */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#3DD9D6] mb-1">{pet.name}</h2>
          <p className="text-gray-600 text-sm mb-1">
            {pet.kind} • {pet.age}
          </p>
          <p className="text-gray-500 italic mb-3">{pet.personality}</p>

          <div className="border-t border-gray-200 my-3" />

          <p className="text-gray-700 text-sm mb-2">
            <span className="font-semibold text-[#3DD9D6]">Descripción corta: </span>
            {pet.shortBio}
          </p>

          <p className="text-gray-700 text-sm mb-3">
            <span className="font-semibold text-[#3DD9D6]">Historia: </span>
            {pet.history}
          </p>

          <div className="border-t border-gray-200 my-3" />

          <p className="text-gray-700 text-sm mb-2">
            <span className="font-semibold text-[#3DD9D6]">Tamaño:</span> {pet.size}
          </p>
          <p className="text-gray-700 text-sm mb-5">
            <span className="font-semibold text-[#3DD9D6]">Rescatista:</span> {pet.rescuer}
          </p>

          {/* Botón adoptar */}
          <button
            className="bg-[#FFD93D] text-[#2D2D2D] font-semibold px-6 py-2 rounded-full shadow hover:bg-[#ffe066] transition-all hover:cursor-pointer"
            onClick={() => alert(`Has mostrado interés en adoptar a ${pet.name} 🐾`)}
          >
            Adoptar
          </button>
        </div>
      </div>

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
