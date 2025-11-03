'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPetById } from '@/services/pets.service'; // Import the service function
import { ArrowLeft, PawPrint, Heart, Calendar, Ruler, User, BookOpen } from 'lucide-react';

interface Pet {
  _id: string;
  name: string;
  image: string;
  age: string;
  kind: 'Perro' | 'Gato';
  shortBio: string;
  personality: string;
  rescuer: string;
  size: string;
  history: string;
  status: 'disponible' | 'en proceso de adopción' | 'en seguimiento' | 'adoptado';
}

export default function PetDetailPage() {
  const { petId } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPet = await getPetById(petId as string);
        setPet(fetchedPet);
      } catch (err: any) {
        console.error('Error fetching pet details:', err);
        setError('Error al cargar los detalles de la mascota.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">Cargando detalles de la mascota...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">Mascota no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
        <div className="mb-6">
          <Link
            href="/home/catalogo"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver al Catálogo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
            <Image
              src={pet.image || '/placeholder-pet.jpg'}
              alt={pet.name}
              fill // Use fill prop instead of layout="fill"
              className="object-cover" // Add object-cover to className instead of objectFit
            />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-[#3DD9D6] mb-3">{pet.name}</h1>
            <p className="text-lg text-gray-700 mb-4">{pet.shortBio}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <PawPrint size={20} className="mr-2 text-[#3DD9D6]" />
                <span>{pet.kind}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-2 text-[#3DD9D6]" />
                <span>{pet.age}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Ruler size={20} className="mr-2 text-[#3DD9D6]" />
                <span>{pet.size}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Heart size={20} className="mr-2 text-[#3DD9D6]" />
                <span>{pet.personality}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#3DD9D6] mb-2">Historia</h2>
            <p className="text-gray-700 mb-6">{pet.history}</p>

            <h2 className="text-2xl font-bold text-[#3DD9D6] mb-2">Rescatista</h2>
            <div className="flex items-center text-gray-700 mb-6">
              <User size={20} className="mr-2 text-[#3DD9D6]" />
              <span>{pet.rescuer}</span>
            </div>

            <div className="mt-6">
              {pet.status === 'disponible' ? (
                <Link href="/home/catalogo" passHref> {/* Changed href */}
                  <button className="bg-[#3DD9D6] hover:bg-[#2BB2B0] text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#3DD9D6] focus:ring-opacity-50 flex items-center justify-center">
                    Ir a catálogo
                  </button>
                </Link>
              ) : (
                <button
                  className="bg-gray-400 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg cursor-not-allowed"
                  disabled
                >
                  {pet.status === 'en proceso de adopción' ? 'En Proceso de Adopción' :
                   pet.status === 'en seguimiento' ? 'En Seguimiento' :
                   'Adoptado'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
