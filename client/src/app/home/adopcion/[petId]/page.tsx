'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPetById } from '@/services/pets.service';
import { createAdoptionRequest } from '@/services/adoption.service'; // Need to create this service function
import { useAuth } from '@/app/context/AuthContext';
import { useAlert } from '@/app/context/AlertContext';
import { ArrowLeft, PawPrint, Mail, Phone, MessageSquare } from 'lucide-react';

interface Pet {
  _id: string;
  name: string;
  image: string;
  kind: 'Perro' | 'Gato';
}

export default function AdoptionFormPage() {
  const { petId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      try {
        setLoadingPet(true);
        setError(null);
        const fetchedPet = await getPetById(petId as string);
        setPet(fetchedPet);
      } catch (err: any) {
        console.error('Error fetching pet details for adoption form:', err);
        setError('Error al cargar los detalles de la mascota.');
      } finally {
        setLoadingPet(false);
      }
    };

    fetchPet();
  }, [petId]);

  useEffect(() => {
    if (user?.email) {
      setContactEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      showAlert('error', 'Debes iniciar sesión para enviar una solicitud de adopción.');
      router.push('/auth/login');
      return;
    }

    if (!contactEmail || !contactPhone) {
      setError('Por favor, completa tu email y teléfono de contacto.');
      return;
    }

    if (!petId) {
      setError('ID de mascota no encontrado.');
      return;
    }

    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem('token') || '';
      await createAdoptionRequest({
        pet: petId as string, // petId is now part of the data object
        contactEmail,
        contactPhone,
        message,
      }, token);
      showAlert('success', 'Solicitud de adopción enviada con éxito. Nos pondremos en contacto contigo pronto.');
      router.push(`/home/catalogo/${petId}`); // Go back to pet detail page
    } catch (err: any) {
      console.error('Error submitting adoption request:', err);
      setError(err.response?.data?.message || 'Error al enviar la solicitud de adopción.');
      showAlert('error', err.response?.data?.message || 'Error al enviar la solicitud de adopción.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingPet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">Cargando formulario de adopción...</p>
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
        <p className="text-lg text-gray-700">Mascota no encontrada para adopción.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
        <div className="mb-6">
          <Link
            href={`/home/catalogo/${pet._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver al Perfil de {pet.name}
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-[#3DD9D6] mb-4">Solicitud de Adopción para {pet.name}</h1>
        <p className="text-gray-700 mb-6">
          Por favor, completa el siguiente formulario para iniciar el proceso de adopción.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <Image
              src={pet.image || '/placeholder-pet.jpg'}
              alt={pet.name}
              width={80}
              height={80}
              objectFit="cover"
              className="rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
              <p className="text-gray-600 text-sm">{pet.kind}</p>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Tu Email de Contacto
            </label>
            <span className="absolute left-3 top-10 text-[#3DD9D6]">
              <Mail size={20} />
            </span>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
              required
              readOnly={!!user?.email} // Make read-only if user is logged in and email is pre-filled
            />
          </div>

          <div className="relative">
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
              Tu Teléfono de Contacto
            </label>
            <span className="absolute left-3 top-10 text-[#3DD9D6]">
              <Phone size={20} />
            </span>
            <input
              type="tel"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Mensaje (Opcional)
            </label>
            <span className="absolute left-3 top-10 text-[#3DD9D6]">
              <MessageSquare size={20} />
            </span>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
              placeholder="Cuéntanos por qué te gustaría adoptar a esta mascota..."
            ></textarea>
          </div>

          {error && (
            <p className="text-sm text-[#E63946] bg-[#ffeaea] border border-[#E63946] rounded-md px-3 py-2 mt-2 animate-fade-in">
              {error}
            </p>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={loadingSubmit}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white ${
                loadingSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3DD9D6] hover:bg-[#2BB2B0]'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3DD9D6] transition-all duration-200`}
            >
              {loadingSubmit ? 'Enviando...' : 'Enviar Solicitud de Adopción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
