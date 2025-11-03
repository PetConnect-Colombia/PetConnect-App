'use client';
import { useEffect, useState } from 'react';
import { useDonations } from "@/hooks/useDonation";
import { useAlert } from '@/app/context/AlertContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void; // amount prop removed
};

export default function DonationModal({ isOpen, onClose, onSuccess }: Props) { // amount prop removed
  const [donationAmount, setDonationAmount] = useState(20000); // Default to 20000 cents = $200.00 COP
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { addDonation } = useDonations(); // donations prop removed

  useEffect(() => {
    if (!isOpen) {
      setDonationAmount(20000); // Reset amount on close
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (donationAmount < 1000) { // Minimum donation of $10.00 COP
      setError('La donación mínima es de $10.00 COP');
      return;
    }

    setLoading(true);

    try {
      await addDonation(donationAmount); // Call addDonation with the amount
      // addDonation now handles redirection, so onSuccess and onClose are not called here
      // showAlert("success", "Redirigiendo a Stripe..."); // Alert before redirect
    } catch (err: any) {
      setError(err.message || 'Error al iniciar la donación. Intenta de nuevo.');
      showAlert("error", error || 'Error al iniciar la donación.');
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
                Hacer una Donación
              </h3>
              <p className="text-sm text-gray-500">Tu apoyo es vital para nuestros peluditos.</p>
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
              <label className="block text-sm font-medium text-gray-700">Cantidad a Donar (COP)</label>
              <input
                type="number"
                inputMode="numeric"
                value={donationAmount / 100} // Display in COP, convert to cents for backend
                onChange={(e) => setDonationAmount(Number(e.target.value) * 100)}
                placeholder="Ej: 20000"
                className="mt-1 block w-full p-3 pl-4 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3DD9D6] transition"
                required
                min={100} // Minimum $1.00 COP
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
              {loading ? 'Redirigiendo...' : `Donar $${(donationAmount / 100).toLocaleString('es-CO')}`}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
