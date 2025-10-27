'use client'
import { useState } from "react";
import CrudPeluditos from "./peluditos/page";
import SolicitudesAdopcion from "./adopciones/page";
import Dashboard from "./dashboard/page";
import CrudBlogs from "./blogs/page";
import NavbarInterno from "./components/NavbarInterno";
import DonacionesList from "./donaciones/page";

export default function AdministradorPage() {
  const [current, setCurrent] = useState('inicio');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <NavbarInterno current={current} setCurrent={setCurrent} />
        {current === 'inicio' && <Dashboard />}
        {current === 'peluditos' && <CrudPeluditos />}
        {current === 'blogs' && <CrudBlogs />}
        {current === 'solicitudes' && <SolicitudesAdopcion />}
        {current === 'donaciones' && <DonacionesList />}
      </div>
    </div>
  );
}