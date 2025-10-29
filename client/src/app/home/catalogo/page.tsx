"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useAlert } from "@/app/context/AlertContext";
import { useLoader } from "@/app/context/LoaderContext";
import PetProfileModal from "./componets/PetProfileModal";
import { usePets } from "@/hooks/usePets";

export default function Catalogo() {
  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // API
  const { pets, loading, error } = usePets();

  const [filtersItems, setFiltersItems] = useState([
    { id: 1, name: "Todos", selected: true },
    { id: 2, name: "Perros", selected: false },
    { id: 3, name: "Gatos", selected: false },
  ]);

  // Filtrado
  const filteredPets = useMemo(() => {
    const selected = filtersItems.find((f) => f.selected)?.name;
    if (selected === "Todos") return pets;
    if (selected === "Perros") return pets.filter((i) => i.kind === "Perro");
    if (selected === "Gatos") return pets.filter((i) => i.kind === "Gato");
    return pets;
  }, [filtersItems, pets]);

  // Cambiar filtro
  const handleFilterClick = (id: number) => {
    setFiltersItems((prev) =>
      prev.map((item) => ({ ...item, selected: item.id === id }))
    );
  };

  // Simular carga manual
  const handleClick = () => {
    showLoader();
    setTimeout(() => {
      hideLoader();
      showAlert("success", "Datos cargados correctamente 🎉");
    }, 2000);
  };

  // Vista de carga o error
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
        <p className="text-[#3DD9D6] font-semibold text-2xl animate-pulse">
          Cargando mascotas...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
        <p className="text-red-500 font-semibold text-xl">
          Error al cargar el catálogo 😿
        </p>
        <p className="text-gray-600">{error}</p>
      </div>
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en proceso de adopción':
        return 'bg-yellow-100 text-yellow-800';
      case 'en seguimiento':
        return 'bg-blue-100 text-blue-800';
      case 'adoptado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
      {/* HEADER */}
      <div className="text-center mb-8 mt-12">
        <h1 className="text-5xl font-extrabold text-[#3DD9D6] drop-shadow-lg mb-2">
          Encuentra a tu amigo fiel 🐾
        </h1>
        <p className="text-lg text-gray-600">
          Explora los perfiles de las mascotas que esperan un hogar.
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {filtersItems.map((item) => (
          <button
            key={item.id}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 border-2 hover:cursor-pointer ${
              item.selected
                ? "bg-[#3DD9D6] border-[#3DD9D6] text-white shadow-md"
                : "bg-white border-[#3DD9D6] text-[#3DD9D6] hover:bg-[#e0f7fa]"
            }`}
            onClick={() => handleFilterClick(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* CATÁLOGO */}
      {filteredPets.length === 0 ? (
        <p className="text-gray-600 text-lg">No hay mascotas disponibles 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl px-6">
          {filteredPets.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in"
            >
              <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h2 className="text-[#FFD93D] text-2xl font-bold mb-1 text-center">
                {item.name}
              </h2>
              <p className="text-gray-600 text-center text-sm mb-1">
                {item.kind} • {item.age}
              </p>
              <p className="text-gray-500 text-center text-sm mb-3 line-clamp-2">
                {item.personality}
              </p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status || 'disponible')}`}>
                {(item.status || 'disponible').charAt(0).toUpperCase() + (item.status || 'disponible').slice(1)}
              </span>
              <button
                className="bg-[#FFD93D] text-[#2D2D2D] font-semibold px-6 py-2 rounded-full shadow hover:bg-[#ffe066] transition-all hover:cursor-pointer mt-4"
                onClick={() => {
                  setSelectedPet(item);
                  setModalOpen(true);
                }}
              >
                Ver perfil
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE PERFIL */}
      <PetProfileModal
        open={modalOpen}
        pet={selectedPet}
        onClose={() => setModalOpen(false)}
      />

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
