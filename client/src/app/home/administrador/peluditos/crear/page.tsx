'use client'

import { useState, useEffect } from "react";
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
    status: "disponible",
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "petconnect-pc");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/do1efktan/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.secure_url);
      setForm(prevForm => ({ ...prevForm, image: data.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = async () => {
    if (isUploading) {
      alert("Por favor, espere a que la imagen termine de subir.");
      return;
    }

    const required = ["name", "age", "kind", "shortBio", "personality", "rescuer", "size", "history"];
    const missing = required.filter((f) => !form[f as keyof typeof form]);
    if (missing.length > 0) {
      return alert(`Faltan campos: ${missing.join(", ")}`);
    }

    if (!imageUrl) {
      return alert("Falta la imagen. Por favor, seleccione una imagen y espere a que termine de subir.");
    }

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
        
        <div className="mt-1">
          <label className="block text-sm font-medium text-gray-700">Imagen</label>
          <input type="file" onChange={handleImageChange} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e0f7fa] file:text-[#3DD9D6] hover:file:bg-[#ccefee]"/>
          {isUploading && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
          {imagePreview && !isUploading && <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md"/>}
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button onClick={handleAdd} disabled={isUploading} className="flex items-center gap-0.5rem bg-[#3DD9D6] text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-[#2BB2B0] transition disabled:bg-gray-400">
          <PlusCircle size={18} /> {isUploading ? "Subiendo..." : "Agregar"}
        </button>
      </div>

    </section>
  );
}
