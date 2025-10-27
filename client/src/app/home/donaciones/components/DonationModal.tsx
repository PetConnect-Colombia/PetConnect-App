'use client';
import { useEffect, useState } from 'react';
import { CreditCard, Calendar, User, Shield } from 'lucide-react';
import { useDonations } from "@/hooks/useDonation";
import { useAlert } from '@/app/context/AlertContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  onSuccess?: (data: any) => void;
};

export default function DonationModal({ isOpen, onClose, amount, onSuccess }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { donations, addDonation } = useDonations();

  useEffect(() => {
    if (!isOpen) {
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setName('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // --- Helpers de formato y validación ---
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const luhnCheck = (cc: string) => {
    const digits = cc.replace(/\D/g, '');
    return digits.length >= 12;
  };

  const validExpiry = (value: string) => {
    const m = value.replace(/\s/g, '').split('/');
    if (m.length !== 2) return false;
    const mm = parseInt(m[0], 10);
    const yy = parseInt(m[1], 10);
    if (isNaN(mm) || isNaN(yy)) return false;
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (yy < currentYear) return false;
    if (yy === currentYear && mm < currentMonth) return false;
    return true;
  };

  const validCvc = (value: string) => {
    const d = value.replace(/\D/g, '');
    return d.length >= 3 && d.length <= 4;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rawCard = cardNumber.replace(/\s/g, '');
    if (luhnCheck(rawCard)) {
      setError('Número de tarjeta inválido');
      return;
    }
    if (!validExpiry(expiry)) {
      setError('Fecha de expiración inválida');
      return;
    }
    if (!validCvc(cvc)) {
      setError('CVC inválido');
      return;
    }
    if (!name.trim()) {
      setError('Ingresa el nombre del titular');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      await addDonation({ amount: 20000, cardNumber, expiry, cvc, name },token);

      showAlert("success", "Donacion exitosa.");
      setLoading(false);
      onClose();
    } catch (err) {
      setError('Error de red. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="donation-modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl z-10 animate-fade-in">
        <form onSubmit={handleSubmit} className="p-7">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 id="donation-modal-title" className="text-xl font-bold text-[#2d2d2d]">
                Donar {amount ? `- $${amount}` : ''}
              </h3>
              <p className="text-sm text-gray-500">Ingresa los datos de tu tarjeta</p>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-[#3DD9D6] text-2xl font-bold transition"
              onClick={() => !loading && onClose()}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Número de tarjeta</label>
              <span className="absolute left-3 top-10 text-[#3DD9D6]">
                <CreditCard size={20} />
              </span>
              <input
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 1234 1234 1234"
                className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
                required
                maxLength={23}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700">Expiración (MM/YY)</label>
                <span className="absolute left-3 top-10 text-[#3DD9D6]">
                  <Calendar size={20} />
                </span>
                <input
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
                  required
                  maxLength={5}
                />
              </div>

              <div className="w-[110px] relative">
                <label className="block text-sm font-medium text-gray-700">CVC</label>
                <span className="absolute left-3 top-10 text-[#3DD9D6]">
                  <Shield size={20} />
                </span>
                <input
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
                  required
                  maxLength={4}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Nombre en la tarjeta</label>
              <span className="absolute left-3 top-10 text-[#3DD9D6]">
                <User size={20} />
              </span>
              <input
                autoComplete="cc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="mt-1 block w-full p-3 pl-10 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[#E63946] bg-[#ffeaea] border border-[#E63946] rounded-md px-3 py-2 mt-2 animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => !loading && onClose()}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md font-semibold text-white flex items-center gap-2 transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3DD9D6] hover:bg-[#2BB2B0]'
              }`}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
              {loading ? 'Procesando...' : `Donar${amount ? ` $${amount}` : ''}`}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}