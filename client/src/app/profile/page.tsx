'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { getMyAdoptionRequests } from '@/services/adoption.service';
import Link from 'next/link';
// import { Navbar } from '@/app/components/layout/navbar.component'; // Assuming Navbar can be imported

// Define an interface for the request objects for type safety
interface AdoptionRequest {
  _id: string;
  pet: {
    _id: string;
    name: string;
    image: string;
  };
  status: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated once auth state is determined
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Fetch requests if the user is authenticated
    if (isAuthenticated) {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          const data = await getMyAdoptionRequests();
          setRequests(data.items || []);
        } catch (error) {
          console.error("Error fetching adoption requests:", error);
          // Optionally, show an alert to the user
        } finally {
          setLoading(false);
        }
      };

      fetchRequests();
    } 
  }, [isAuthenticated]);

  // Render a loading state while checking auth or fetching data
  if (authLoading || loading) { // Check both authLoading and loading
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  // Render nothing or a redirect message if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div>
      {/* <Navbar /> Re-enable if your layout doesn't automatically include it */}
      <main className="max-w-4xl mx-auto px-4 py-8 pt-32">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Hola, {user?.name}!
          </h1>
          <Link href="/home" className="inline-block bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg transition">
            &larr; Volver a Inicio
          </Link>
        </div>
        <p className="text-gray-600 mb-8">
          Bienvenido a tu perfil. Aquí puedes ver el estado de tus solicitudes de adopción.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Mis Solicitudes
          </h2>
          {requests.length > 0 ? (
            <ul className="space-y-6">
              {requests.map((req) => (
                <li key={req._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <img 
                      src={req.pet.image} 
                      alt={req.pet.name} 
                      className="w-20 h-20 rounded-md object-cover bg-gray-200"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{req.pet.name}</h3>
                      <p className="text-sm text-gray-500">
                        Solicitado el: {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusChipColor(req.status)}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aún no has realizado ninguna solicitud de adopción.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
