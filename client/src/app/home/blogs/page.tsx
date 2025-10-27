"use client";

import Image from "next/image";
import BlogModal from "./components/BlogModal";
import { useState } from "react";
import { useBlogs } from "@/hooks/useBlogs";

export default function Campañas() {
  const { blogs, loading, error } = useBlogs();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
        <p className="text-[#3DD9D6] text-2xl font-semibold animate-pulse">
          Cargando campañas...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
        <p className="text-red-500 font-semibold text-lg">Error al cargar las campañas 😿</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
      <div className="text-center mt-16 mb-8">
        <h1 className="text-[#3DD9D6] font-extrabold text-4xl md:text-5xl drop-shadow-lg mb-2">
          Campañas y Noticias
        </h1>
        <p className="text-lg text-gray-600">
          Infórmate y participa en nuestras campañas por el bienestar animal.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-600 text-lg">No hay campañas disponibles 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden animate-fade-in"
            >
              <div className="relative w-full h-48">
                <Image
                  src={blog.image || "/placeholder.jpg"}
                  alt={blog.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-[#3DD9D6] mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-700 mb-4 flex-1 line-clamp-3">
                  {blog.summary}
                </p>
                <button
                  className="mt-auto bg-[#3DD9D6] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#2BB2B0] transition"
                  onClick={() => {
                    setSelectedBlog(blog);
                    setModalOpen(true);
                  }}
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BlogModal
        open={modalOpen}
        blog={selectedBlog}
        onClose={() => setModalOpen(false)}
      />

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
