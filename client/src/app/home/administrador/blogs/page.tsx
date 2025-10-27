"use client";

import { useState } from "react";
import { PawPrint, Edit2, Trash2, PlusCircle, Save } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";

export default function CrudBlogs() {
  const { blogs, loading, addBlog, editBlog, removeBlog } = useBlogs();
  const [form, setForm] = useState({ title: "", summary: "", content: "", image: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!form.title || !form.summary || !form.content) return alert("Completa todos los campos");
    const token = localStorage.getItem("token") || "";
    await addBlog(form, token);
    setForm({ title: "", summary: "", content: "", image: "" });
  };

  const handleEdit = (b: any) => {
    setEditId(b._id);
    setForm({ title: b.title, summary: b.summary, content: b.content, image: b.image || "" });
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const token = localStorage.getItem("token") || "";
    await editBlog(editId, form, token);
    setEditId(null);
    setForm({ title: "", summary: "", content: "", image: "" });
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token") || "";
    if (confirm("¿Eliminar esta campaña?")) await removeBlog(id, token);
  };

  if (loading) return <p className="text-center py-8">Cargando campañas...</p>;

  return (
    <section className="p-8 bg-white/90 rounded-2xl shadow-xl mb-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <PawPrint className="text-[#3DD9D6] w-8 h-8" />
        <h2 className="text-2xl font-bold text-[#3DD9D6]">Gestión de Campañas Educativas</h2>
      </div>

      {/* FORMULARIO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="input" />
        <input name="summary" value={form.summary} onChange={handleChange} placeholder="Resumen" className="input" />
        <input name="content" value={form.content} onChange={handleChange} placeholder="Contenido" className="input" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="URL Imagen" className="input" />
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
              <th className="p-3">Título</th>
              <th className="p-3">Resumen</th>
              <th className="p-3">Contenido</th>
              <th className="p-3">Imagen</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b: any) => (
              <tr key={b._id} className="border-t text-[#2D2D2D] hover:bg-[#f8fafc] transition">
                <td className="p-3">{b.title}</td>
                <td className="p-3">{b.summary}</td>
                <td className="p-3 truncate max-w-xs">{b.content}</td>
                <td className="p-3">
                  {b.image ? (
                    <img src={b.image} alt={b.title} className="h-10 w-10 object-cover rounded-md" />
                  ) : (
                    <span className="text-gray-400 italic">Sin imagen</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(b)} className="action-edit">
                    <Edit2 size={16} /> Editar
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="action-delete">
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
        .btn-blue,
        .btn-yellow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }
        .btn-blue {
          background: #3dd9d6;
          color: white;
        }
        .btn-blue:hover {
          background: #2bb2b0;
        }
        .btn-yellow {
          background: #ffd93d;
          color: #2d2d2d;
        }
        .btn-yellow:hover {
          background: #ffe066;
        }
        .action-edit {
          color: #3dd9d6;
        }
        .action-edit:hover {
          text-decoration: underline;
          color: #2bb2b0;
        }
        .action-delete {
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
