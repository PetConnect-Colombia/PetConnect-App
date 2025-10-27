"use client";

import { useState } from "react";
import { PawPrint, Edit2, Trash2, PlusCircle, Save } from "lucide-react";
import { usePets } from "@/hooks/usePets";

export default function CrudPeluditos() {
  const { pets, loading, addPet, editPet, removePet } = usePets();

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
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Crear mascota
  const handleAdd = async () => {
    const required = ["name", "age", "kind", "shortBio", "personality", "rescuer", "size", "history", "image"];
    const missing = required.filter((f) => !form[f as keyof typeof form]);
    if (missing.length > 0) return alert(`Faltan campos: ${missing.join(", ")}`);

    const token = localStorage.getItem("token") || "";
    await addPet(form, token);
    setForm({
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
  };

  // ✏️ Editar mascota
  const handleEdit = (m: any) => {
    setEditId(m._id);
    setForm({
      name: m.name,
      age: m.age,
      kind: m.kind,
      shortBio: m.shortBio,
      personality: m.personality,
      rescuer: m.rescuer,
      size: m.size,
      history: m.history,
      image: m.image,
    });
  };

  // 💾 Guardar cambios
  const handleUpdate = async () => {
    if (!editId) return;
    const token = localStorage.getItem("token") || "";
    await editPet(editId, form, token);
    setEditId(null);
    setForm({
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
  };

  // 🗑️ Eliminar
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token") || "";
    if (confirm("¿Eliminar esta mascota?")) await removePet(id, token);
  };

  if (loading) return <p className="text-center py-8">Cargando mascotas...</p>;

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <PawPrint className="text-[#3DD9D6] w-8 h-8" />
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Gestión de Peluditos</h2>
      </div>

      {/* FORMULARIO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="input" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Edad (ej: 2 años)" className="input" />
        <select name="kind" value={form.kind} onChange={handleChange} className="input">
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        <input name="shortBio" value={form.shortBio} onChange={handleChange} placeholder="Descripción corta" className="input" />
        <input name="personality" value={form.personality} onChange={handleChange} placeholder="Personalidad (ej: Juguetón)" className="input" />
        <input name="rescuer" value={form.rescuer} onChange={handleChange} placeholder="Rescatista o refugio" className="input" />
        <input name="size" value={form.size} onChange={handleChange} placeholder="Tamaño (Pequeño, Mediano, Grande)" className="input" />
        <input name="history" value={form.history} onChange={handleChange} placeholder="Historia breve" className="input" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="URL de imagen" className="input" />
      </div>

      <div className="flex justify-end mb-6">
        {editId ? (
          <button onClick={handleUpdate} className="btn-yellow">
            <Save size={18} /> Guardar
          </button>
        ) : (
          <button onClick={handleAdd} className="btn-blue">
            <PlusCircle size={18} /> Agregar
          </button>
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border mt-4 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#e0f7fa] text-[#2D2D2D]">
              <th className="p-3">Nombre</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Edad</th>
              <th className="p-3">Tamaño</th>
              <th className="p-3">Rescatista</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((m: any) => (
              <tr key={m._id} className="text-[#2D2D2D] border-t hover:bg-[#f8fafc] transition">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.kind}</td>
                <td className="p-3">{m.age}</td>
                <td className="p-3">{m.size}</td>
                <td className="p-3">{m.rescuer}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(m)} className="action-edit">
                    <Edit2 size={16} /> Editar
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="action-delete">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        .input {
          border: 1px solid #3dd9d6;
          color: #2d2d2d;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          ring: 2px solid #3dd9d6;
          border-color: #3dd9d6;
        }
        .btn-blue {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #3dd9d6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }
        .btn-blue:hover {
          background: #2bb2b0;
        }
        .btn-yellow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffd93d;
          color: #2d2d2d;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }
        .btn-yellow:hover {
          background: #ffe066;
        }
        .action-edit {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #3dd9d6;
        }
        .action-edit:hover {
          text-decoration: underline;
          color: #2bb2b0;
        }
        .action-delete {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #e63946;
        }
        .action-delete:hover {
          text-decoration: underline;
          color: #b91c1c;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
