'use client';

import { useState } from 'react';

const initialForm = {
  tipoMascota: '',
  lugarVivienda: '',
  convivencia: '',
  edadUsuario: '',
  departamento: '',
  ciudad: '',
};

const tiposMascota = ['Perro', 'Gato', 'Otro'];
const lugares = ['Casa', 'Apartamento', 'Finca', 'Otro'];
const convivencias = ['Solo/a', 'Familia', 'Niños', 'Adultos mayores', 'Otras mascotas'];
const edades = ['18-25', '26-35', '36-50', '51+'];
const departamentos = ['Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Santander', 'Atlántico', 'Otro'];

export default function OnboardingAdopcion() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [ciudad, setCiudad] = useState('');

  const preguntas = [
    {
      label: '¿Qué tipo de mascota deseas adoptar?',
      name: 'tipoMascota',
      options: tiposMascota,
    },
    {
      label: '¿Dónde vivirá la mascota?',
      name: 'lugarVivienda',
      options: lugares,
    },
    {
      label: '¿Con quién convivirá la mascota?',
      name: 'convivencia',
      options: convivencias,
    },
    {
      label: '¿Cuál es tu rango de edad?',
      name: 'edadUsuario',
      options: edades,
    },
    {
      label: '¿En qué departamento vives?',
      name: 'departamento',
      options: departamentos,
    },
    {
      label: '¿En qué ciudad vives?',
      name: 'ciudad',
      input: true,
    },
  ];

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
    if (name === 'ciudad') setCiudad(value);
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a tu backend o continuar el flujo
    alert('¡Gracias por completar el onboarding!\n' + JSON.stringify(form, null, 2));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-[#3DD9D6] mb-6 text-center">¡Queremos conocerte!</h2>
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            {preguntas[step].label}
          </label>
          {preguntas[step].input ? (
            <input
              type="text"
              value={form.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              placeholder="Escribe tu ciudad"
              className="w-full border text-gray-700 border-[#3DD9D6] rounded px-3 py-2 focus:ring-2 focus:ring-[#3DD9D6] outline-none transition"
              required
            />
          ) : (
            <div className="flex flex-col gap-2">
              {preguntas[step].options?.map((op: string) => (
                <label
                  key={op}
                  className={`flex items-center  text-gray-700 gap-2 p-2 rounded cursor-pointer border transition ${
                    form[preguntas[step].name as keyof typeof form] === op
                      ? 'bg-[#3DD9D6]/20 border-[#3DD9D6]'
                      : 'border-gray-200 hover:bg-[#e0f7fa]'
                  }`}
                >
                  <input
                    type="radio"
                    name={preguntas[step].name}
                    value={op}
                    checked={form[preguntas[step].name as keyof typeof form] === op}
                    onChange={() => handleChange(preguntas[step].name, op)}
                    className="accent-[#3DD9D6] text-gray-700"
                    required
                  />
                  {op}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
            >
              Atrás
            </button>
          ) : <span />}
          {step < preguntas.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                !form[preguntas[step].name as keyof typeof form]
              }
              className={`px-4 py-2 rounded font-semibold transition ${
                form[preguntas[step].name as keyof typeof form]
                  ? 'bg-[#3DD9D6] text-white hover:bg-[#2BB2B0]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#3DD9D6] text-white font-semibold hover:bg-[#2BB2B0] transition"
            >
              Finalizar
            </button>
          )}
        </div>
      </form>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}