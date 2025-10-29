'use client'
import { useEffect, useState } from "react";
import { getFormSubmissionById } from "@/services/form.service";
import { useAuth } from "@/app/context/AuthContext";
import { useAlert } from "@/app/context/AlertContext";
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface FormSubmission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  housingType: string;
  hasOtherPets: boolean;
  hasChildren: boolean;
  livesWithAdults: boolean;
  ageRange: string;
  department: string;
  city: string;
  petPreference: string;
  reasonForAdoption: string;
  createdAt: string;
}

export default function SubmissionDetails() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'admin') {
        router.push('/home');
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (isAuthenticated && user?.role === 'admin') {
        try {
          setLoading(true);
          const data = await getFormSubmissionById(id);
          setSubmission(data.item);
        } catch (err) {
          console.error("Error fetching form submission:", err);
          setError("Error al cargar la solicitud.");
          showAlert("error", "Error al cargar la solicitud.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubmission();
  }, [isAuthenticated, user, showAlert, id]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  if (!submission) {
    return <p className="text-center py-4 text-red-500">Solicitud no encontrada.</p>;
  }

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="text-[#3DD9D6]" />
        </button>
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Detalles de la Solicitud</h2>
      </div>

      {error && <p className="text-center py-4 text-red-500">{error}</p>}

      {submission && (
        <div className="space-y-4 text-gray-800">
          <p><strong>Nombre Completo:</strong> {submission.fullName}</p>
          <p><strong>Email:</strong> {submission.email}</p>
          <p><strong>Teléfono:</strong> {submission.phone}</p>
          <p><strong>Tipo de Vivienda:</strong> {submission.housingType}</p>
          <p><strong>Tiene otras mascotas:</strong> {submission.hasOtherPets ? 'Sí' : 'No'}</p>
          <p><strong>Tiene niños:</strong> {submission.hasChildren ? 'Sí' : 'No'}</p>
          <p><strong>Vive con adultos:</strong> {submission.livesWithAdults ? 'Sí' : 'No'}</p>
          <p><strong>Rango de edad:</strong> {submission.ageRange}</p>
          <p><strong>Departamento:</strong> {submission.department}</p>
          <p><strong>Ciudad:</strong> {submission.city}</p>
          <p><strong>Preferencia de mascota:</strong> {submission.petPreference}</p>
          <p><strong>Razón para la adopción:</strong> {submission.reasonForAdoption}</p>
          <p><strong>Fecha de Solicitud:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </section>
  );
}