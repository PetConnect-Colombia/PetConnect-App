'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPets } from '@/services/pets.service'; // Import the service function
import { PawPrint } from 'lucide-react';

interface Pet {
  _id: string;
  name: string;
  image: string;
  age: string;
  kind: string;
  shortBio: string;
}

export default function AvailablePetsSection() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailablePets = async () => {
      try {
        setLoading(true);
        setError(null);
        const availablePets = await getPets('disponible'); // Fetch pets with 'disponible' status
        setPets(availablePets.slice(0, 4)); // Take up to 4 pets
      } catch (err: any) {
        console.error('Error fetching available pets:', err);
        setError('Error al cargar las mascotas disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePets();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-lg text-gray-700">Cargando mascotas disponibles...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </section>
    );
  }

  if (pets.length === 0) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-[#3DD9D6] mb-8">Mascotas Disponibles para Adoptar</h2>
        <p className="text-lg text-gray-700">No hay mascotas disponibles para adoptar en este momento. ¡Vuelve pronto!</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#3DD9D6] mb-8">Mascotas Disponibles para Adoptar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pets.map((pet) => (
            <div key={pet._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={pet.image || '/placeholder-pet.jpg'} // Use a placeholder if image is missing
                  alt={pet.name}
                  fill // Use fill prop instead of layout="fill"
                  className="object-cover" // Add object-cover to className instead of objectFit
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{pet.age} - {pet.kind}</p>
                <p className="text-gray-700 text-sm line-clamp-2">{pet.shortBio}</p>
                <Link href={`/home/catalogo/${pet._id}`} passHref>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#3DD9D6] hover:bg-[#2BB2B0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3DD9D6]">
                    <PawPrint size={16} className="mr-2" /> Ver Perfil
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/home/catalogo" passHref>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#27CCF5] hover:bg-[#02A7CF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Ver Todas las Mascotas
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
