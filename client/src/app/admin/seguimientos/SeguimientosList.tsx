'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link'; // Re-import Link
import { useRouter } from 'next/navigation'; // Re-import useRouter
import { followUpService, GroupedFollowUp } from '../../../services/followUp.service'; // Corrected path

interface SeguimientosListProps {
  setCurrent: (value: string) => void;
}

const SeguimientosList: React.FC<SeguimientosListProps> = ({ setCurrent }) => {
  const [groupedFollowUps, setGroupedFollowUps] = useState<GroupedFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Re-initialize router

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const data = await followUpService.getGroupedFollowUps();
        setGroupedFollowUps(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  if (loading) return <div className="text-center p-8">Cargando seguimientos...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => setCurrent('inicio')} // Call setCurrent to change parent state
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Volver al Panel de Administración
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seguimiento de Adopciones</h1>
      {groupedFollowUps.length === 0 ? (
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <p className="text-gray-700">No hay seguimientos programados en este momento.</p>
          <p className="text-gray-500 text-sm mt-2">Cuando se inicie un seguimiento para una mascota, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Adoptante
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email Adoptante
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo de Visita
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedFollowUps.map((group) => (
                <tr key={group.pet._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img className="w-full h-full rounded-full object-cover" src={group.pet?.image || '/placeholder.jpg'} alt={group.pet?.name || 'Mascota'} />
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap font-semibold">{group.pet?.name || '(Mascota eliminada)'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{group.adopter?.name || '(Usuario eliminado)'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{group.adopter?.email || '(Email no disponible)'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Seguimiento</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    <Link
                      href={`/admin/seguimiento/mascota/${group.pet._id}`}
                      className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                    >
                      Ver Proceso
                    </Link>
                    {/* Individual visit links - these will navigate to the form page for a specific follow-up ID */}
                    <Link
                      href={group.visits['1-month'] ? `/admin/seguimiento/${group.visits['1-month']._id}` : '#'}
                      className={`mr-2 text-sm ${group.visits['1-month'] ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
                      onClick={(e) => !group.visits['1-month'] && e.preventDefault()}
                    >
                      Visita 1
                    </Link>
                    <Link
                      href={group.visits['3-month'] ? `/admin/seguimiento/${group.visits['3-month']._id}` : '#'}
                      className={`mr-2 text-sm ${group.visits['3-month'] ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
                      onClick={(e) => !group.visits['3-month'] && e.preventDefault()}
                    >
                      Visita 2
                    </Link>
                    <Link
                      href={group.visits['6-month'] ? `/admin/seguimiento/${group.visits['6-month']._id}` : '#'}
                      className={`text-sm ${group.visits['6-month'] ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
                      onClick={(e) => !group.visits['6-month'] && e.preventDefault()}
                    >
                      Visita 3
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeguimientosList;
