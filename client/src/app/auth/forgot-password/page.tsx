'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Te hemos enviado un enlace para restablecer tu contraseña 📩');
      } else {
        setError(data.message || 'No pudimos procesar tu solicitud');
      }
    } catch (err) {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white/90 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fade-in"
        aria-label="Formulario de recuperación de contraseña"
      >
        <div className='flex justify-center'>
          <Image
            src="/Logo.png"
            alt="PetConnect logo"
            width={90}
            height={90}
            className="rounded-full shadow"
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-2xl font-bold text-center text-[#2BB2B0]">
            Recuperar contraseña 🔑
          </h2>
          <h4 className="text-base text-center text-gray-500">
            Ingresa tu correo y te enviaremos instrucciones
          </h4>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md px-3 py-2 text-sm text-center animate-fade-in">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-3 py-2 text-sm text-center animate-fade-in">
            {message}
          </div>
        )}

        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Tu correo electrónico"
            className="mt-1 block w-full p-3 bg-white border border-gray-300 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] focus:border-[#3DD9D6] transition"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3DD9D6] hover:bg-[#2BB2B0]'
          }`}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          )}
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>

        <div>
          <p className="text-base text-center text-gray-500">
            ¿Recordaste tu contraseña?{' '}
            <a href="/auth/login" className="text-[#2BB2B0] hover:underline transition">
              Inicia sesión
            </a>
          </p>
        </div>
      </form>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}