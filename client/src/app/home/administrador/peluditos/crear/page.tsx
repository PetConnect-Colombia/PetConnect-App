'use client'

import { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { useRouter } from 'next/navigation';

export default function CrearPeluditoPage() {
  const { addPet } = usePets();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    kind: "Perro",
    shortBio: "",
    personality: "",
    rescuer: "",
    size: "",
    history: "",
    image: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const required = ["name", "age", "kind", "shortBio", "personality", "rescuer", "size", "history", "image"];
    const missing = required.filter((f) => !form[f as keyof typeof form]);
    if (missing.length > 0) return alert(`Faltan campos: ${missing.join(", ")}`);

    const token = localStorage.getItem("token") || "";
    await addPet(form, token);
    router.push('/home/administrador/peluditos'); // Redirect back to the list
  };

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/home/administrador/peluditos')} className="p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="text-[#3DD9D6]" />
        </button>
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Crear Nuevo Peludito</h2>
      </div>

      {/* FORMULARIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Edad (ej: 2 años)" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
        <select name="kind" value={form.kind} onChange={handleChange} className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800">
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        <input name="shortBio" value={form.shortBio} onChange={handleChange} placeholder="Descripción corta" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
        <input name="personality" value={form.personality} onChange={handleChange} placeholder="Personalidad (ej: Juguetón)" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
        <input name="rescuer" value={form.rescuer} onChange={handleChange} placeholder="Rescatista o refugio" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
        <input name="size" value={form.size} onChange={handleChange} placeholder="Tamaño (Pequeño, Mediano, Grande)" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
        <textarea name="history" value={form.history} onChange={handleChange} placeholder="Historia breve" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" rows={4}></textarea>
        <input name="image" value={form.image} onChange={handleChange} placeholder="URL de imagen" className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3DD9D6] focus:ring-[#3DD9D6] text-slate-800" />
      </div>

      <div className="flex justify-end mb-6">
        <button onClick={handleAdd} className="flex items-center gap-0.5rem bg-[#3DD9D6] text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-[#2BB2B0] transition">
          <PlusCircle size={18} /> Agregar
        </button>
      </div>

    </section>
  );
}
