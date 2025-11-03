'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { useAuth } from '@/app/context/AuthContext';
import CrudPeluditos from "./peluditos/page";
import SolicitudesAdopcion from "./adopciones/page";
import Dashboard from "./dashboard/page";
import CrudBlogs from "./blogs/page";
import NavbarInterno from "./components/NavbarInterno";
import AdminDonationsPage from "./donaciones/page"; // Changed import
import SeguimientosList from "../../admin/seguimientos/SeguimientosList"; // New import, relative path

export default function AdministradorPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const initialTab = searchParams.get('tab') || 'inicio'; // Read 'tab' param
  const [current, setCurrent] = useState(initialTab); // Initialize with param or 'inicio'

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'admin') {
        router.push('/home');
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <NavbarInterno current={current} setCurrent={setCurrent} />
        {current === 'inicio' && <Dashboard />}
        {current === 'peluditos' && <CrudPeluditos />}
        {current === 'solicitudes' && <SolicitudesAdopcion />}
        {current === 'seguimientos' && <SeguimientosList setCurrent={setCurrent} />} {/* New conditional render */}
        {current === 'blogs' && <CrudBlogs />}
        {current === 'donaciones' && <AdminDonationsPage />} // Changed component name
      </div>
    </div>
  );
}