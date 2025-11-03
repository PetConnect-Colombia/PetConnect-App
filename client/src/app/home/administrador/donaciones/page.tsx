'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getDonations } from '@/services/donations.service'; // Need to create this service function
import { DollarSign } from 'lucide-react';

interface Donation {
  _id: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  description: string;
  donorEmail?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string; // Date string
}

export default function AdminDonationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/auth/login'); // Redirect if not admin
        return;
      }

      const fetchDonations = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getDonations(); // Call the service
          setDonations(data.items); // Assuming API returns { items: [...] }
        } catch (err: any) {
          console.error('Error fetching donations:', err);
          setError('Error al cargar las donaciones.');
        } finally {
          setLoading(false);
        }
      };
      fetchDonations();
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (loading || authLoading) {
    return <p className="text-center py-8">Cargando donaciones...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  }

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="text-[#3DD9D6] w-8 h-8" />
          <h2 className="text-2xl font-bold text-[#3DD9D6]">Gestión de Donaciones</h2>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <p className="text-gray-700">No hay donaciones registradas aún.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border mt-4 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#e0f7fa] text-[#2D2D2D]">
                <th className="p-3">ID de Sesión</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Moneda</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Email Donante</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} className="text-[#2D2D2D] border-t hover:bg-[#f8fafc] transition">
                  <td className="p-3 text-sm">{donation.stripeSessionId}</td>
                  <td className="p-3 font-semibold">${donation.amount.toLocaleString('es-CO')}</td>
                  <td className="p-3 uppercase">{donation.currency}</td>
                  <td className="p-3">{donation.description}</td>
                  <td className="p-3">{donation.donorEmail || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{new Date(donation.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}