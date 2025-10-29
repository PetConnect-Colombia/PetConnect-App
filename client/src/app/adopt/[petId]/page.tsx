'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useAlert } from '@/app/context/AlertContext';
import { useLoader } from '@/app/context/LoaderContext';
import { submitAdopterForm } from '@/services/form.service';
import { createAdoptionRequest } from '@/services/adoption.service';
import Link from 'next/link';

// Define the structure for form data
interface FormData {
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
}

export default function AdoptPetPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const petId = params.petId as string;
  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    housingType: '',
    hasOtherPets: false,
    hasChildren: false,
    livesWithAdults: false,
    ageRange: '',
    department: '',
    city: '',
    petPreference: '',
    reasonForAdoption: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Loading state for auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  // If not authenticated, return null (redirect will handle it)
  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkboxes

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error on change
  };

  const validateStep = (): boolean => {
    let errors: Partial<FormData> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.fullName) errors.fullName = 'Nombre completo es requerido';
      if (!formData.email) errors.email = 'Email es requerido';
      if (!formData.phone) errors.phone = 'Teléfono es requerido';
      if (!formData.phone || !/^[0-9]{7,10}$/.test(formData.phone)) errors.phone = 'Teléfono inválido';
    }
    if (currentStep === 2) {
      if (!formData.housingType) errors.housingType = 'Tipo de vivienda es requerido';
      if (!formData.ageRange) errors.ageRange = 'Rango de edad es requerido';
    }
    if (currentStep === 3) {
      if (!formData.department) errors.department = 'Departamento es requerido';
      if (!formData.city) errors.city = 'Ciudad es requerida';
      if (!formData.petPreference) errors.petPreference = 'Preferencia de mascota es requerida';
    }
    if (currentStep === 4) {
      if (!formData.reasonForAdoption) errors.reasonForAdoption = 'Razón para adoptar es requerida';
    }

    setFormErrors(errors);
    isValid = Object.keys(errors).length === 0;
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      showAlert('error', 'Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    showLoader();
    try {
      // First, submit the detailed adopter form
      const submissionResponse = await submitAdopterForm(formData);
      const formSubmissionId = submissionResponse.item._id; // Assuming the ID is nested under 'item'

      // Then, create the actual adoption request linking the user and pet
      await createAdoptionRequest({
        pet: petId,
        formSubmission: formSubmissionId, // Pass the form submission ID
        contactEmail: formData.email,
        contactPhone: formData.phone,
        message: formData.reasonForAdoption,
      });

      showAlert('success', '¡Solicitud enviada! Pronto revisaremos tu información.');
      router.push('/profile'); // Redirect to user profile to see their requests
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert('error', 'Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      hideLoader();
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required />
              {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="housingType" className="block text-sm font-medium text-gray-700">Tipo de Vivienda</label>
              <select id="housingType" name="housingType" value={formData.housingType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required>
                <option value="">Selecciona...</option>
                <option value="Casa con patio">Casa con patio</option>
                <option value="Casa sin patio">Casa sin patio</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Finca">Finca</option>
              </select>
              {formErrors.housingType && <p className="text-red-500 text-xs mt-1">{formErrors.housingType}</p>}
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="hasOtherPets" name="hasOtherPets" checked={formData.hasOtherPets} onChange={handleChange} className="h-4 w-4 text-[#3DD9D6] border-gray-300 rounded focus:ring-[#3DD9D6]" />
              <label htmlFor="hasOtherPets" className="ml-2 block text-sm text-gray-900">¿Tienes otras mascotas?</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="hasChildren" name="hasChildren" checked={formData.hasChildren} onChange={handleChange} className="h-4 w-4 text-[#3DD9D6] border-gray-300 rounded focus:ring-[#3DD9D6]" />
              <label htmlFor="hasChildren" className="ml-2 block text-sm text-gray-900">¿Hay niños en casa?</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="livesWithAdults" name="livesWithAdults" checked={formData.livesWithAdults} onChange={handleChange} className="h-4 w-4 text-[#3DD9D6] border-gray-300 rounded focus:ring-[#3DD9D6]" />
              <label htmlFor="livesWithAdults" className="ml-2 block text-sm text-gray-900">¿Vives con otros adultos?</label>
            </div>
            <div>
              <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">Rango de Edad</label>
              <select id="ageRange" name="ageRange" value={formData.ageRange} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required>
                <option value="">Selecciona...</option>
                <option value="18-25">18-25 años</option>
                <option value="26-35">26-35 años</option>
                <option value="36-50">36-50 años</option>
                <option value=">50">Más de 50 años</option>
              </select>
              {formErrors.ageRange && <p className="text-red-500 text-xs mt-1">{formErrors.ageRange}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
              <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required />
              {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required />
              {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
            </div>
            <div>
              <label htmlFor="petPreference" className="block text-sm font-medium text-gray-700">Preferencia de Mascota</label>
              <select id="petPreference" name="petPreference" value={formData.petPreference} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required>
                <option value="">Selecciona...</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="No importa">No importa</option>
              </select>
              {formErrors.petPreference && <p className="text-red-500 text-xs mt-1">{formErrors.petPreference}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="reasonForAdoption" className="block text-sm font-medium text-gray-700">Razón para Adoptar</label>
              <textarea id="reasonForAdoption" name="reasonForAdoption" value={formData.reasonForAdoption} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" required></textarea>
              {formErrors.reasonForAdoption && <p className="text-red-500 text-xs mt-1">{formErrors.reasonForAdoption}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#3DD9D6]">Formulario de Adopción</h1>
          <Link href={`/home/catalogo`} className="text-gray-500 hover:text-[#3DD9D6] transition">
            &larr; Volver al Catálogo
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Paso {currentStep} de 4</span>
            <span>Mascota: {petId}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#3DD9D6] h-2.5 rounded-full" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrev} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                Anterior
              </button>
            )}
            {currentStep < 4 ? (
              <button type="button" onClick={handleNext} className="ml-auto px-6 py-2 bg-[#3DD9D6] text-white rounded-md hover:bg-[#2BB2B0] transition">
                Siguiente
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="ml-auto px-6 py-2 bg-[#3DD9D6] text-white rounded-md hover:bg-[#2BB2B0] transition disabled:bg-gray-400">
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
