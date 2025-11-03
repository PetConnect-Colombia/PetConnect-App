'use client'
import { useEffect, useState } from "react";
import { CheckCircle2, Eye } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useAlert } from "@/app/context/AlertContext";
import { useRouter } from 'next/navigation';
import { getAllAdoptionRequests, updateAdoptionRequestStatus } from '@/services/adoption-requests.service';

interface AdoptionRequest {
  _id: string;
  pet: {
    _id: string;
    name: string;
    image: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  formSubmission: string; // Assuming this is now part of AdoptionRequest
  contactPhone: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt: string;
}

export default function SolicitudesAdopcion() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();

  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
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
    if (isAuthenticated && user?.role === 'admin') {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          const data = await getAllAdoptionRequests();
          setRequests(data.items || []);
          setError(null);
        } catch (err) {
          console.error("Error fetching adoption requests:", err);
          setError("Error al cargar las solicitudes de adopción.");
          showAlert("error", "Error al cargar las solicitudes de adopción.");
        } finally {
          setLoading(false);
        }
      };
      fetchRequests();
    }
  }, [isAuthenticated, user, showAlert]);

  const handleStatusChange = async (id: string, newStatus: AdoptionRequest['status']) => {
    try {
      await updateAdoptionRequestStatus(id, newStatus);
      setRequests(prevRequests =>
        prevRequests.map(req => (req._id === id ? { ...req, status: newStatus } : req))
      );
      showAlert('success', `Estado de la solicitud actualizado a ${newStatus}`);
    } catch (err) {
      console.error("Error updating adoption request status:", err);
      showAlert("error", "Error al actualizar el estado de la solicitud.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Should be redirected by the first useEffect
  }

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="text-[#3DD9D6] w-8 h-8" />
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Formulario de solicitud</h2>
      </div>

      {error && <p className="text-center py-4 text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#e0f7fa] text-[#2D2D2D]">
              <th className="p-3">Mascota</th>
              <th className="p-3">Solicitante</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No hay solicitudes de adopción por el momento.
                </td>
              </tr>
            ) : (
              requests.map(req => (
                <tr key={req._id} className="text-[#2D2D2D] border-t hover:bg-[#f8fafc] transition">
                  <td className="p-3 flex items-center gap-3">
                    <img src={req.pet.image} alt={req.pet.name} className="w-12 h-12 rounded-full object-cover" />
                    <span>{req.pet.name}</span>
                  </td>
                  <td className="p-3">{req.user.name}</td>
                  <td className="p-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <select onChange={(e) => handleStatusChange(req._id, e.target.value as AdoptionRequest['status'])} value={req.status} className="p-2 rounded border-gray-300">
                      <option value="pendiente">Pendiente</option>
                      <option value="aprobada">Aprobada</option>
                      <option value="rechazada">Rechazada</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => router.push(`/home/administrador/adopciones/${req.formSubmission}`)}
                      className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                    >
                      <Eye size={16} /> Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </section>
  );
}
