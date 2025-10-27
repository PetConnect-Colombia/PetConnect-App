'use client';

export default function ComoAdoptar() {
  const pasos = [
    {
      titulo: "1. Registro en la Plataforma",
      descripcion:
        "Crea una cuenta en nuestra plataforma proporcionando información básica como nombre, correo electrónico y número de contacto. Asegúrate de completar tu perfil con detalles adicionales sobre ti y tu hogar.",
    },
    {
      titulo: "2. Diligenciar formulario",
      descripcion:
        "Diligenciar el formulario de onboarding, con toda la información para la adopción.",
    },
    {
      titulo: "3. Envío de Solicitud de Adopción",
      descripcion:
        "Una vez que encuentres una mascota que te interese, completa el formulario de solicitud de adopción. Proporciona información detallada sobre tu experiencia con mascotas, tu entorno y por qué deseas adoptar.",
    },
    {
      titulo: "4. Revisión de Solicitudes",
      descripcion:
        "Nuestro equipo revisará tu solicitud y puede contactarte para obtener información adicional o para programar una entrevista. Este proceso nos ayuda a asegurar que cada mascota vaya a un hogar adecuado.",
    },
    {
      titulo: "5. Aprobación y Adopción",
      descripcion:
        "Una vez que todo esté en orden, recibirás la aprobación final para adoptar. Te proporcionaremos toda la información necesaria para completar el proceso de adopción y llevar a tu nueva mascota a casa.",
    },
    {
      titulo: "6. Seguimiento Post-Adopción",
      descripcion:
        "Después de la adopción, nuestro equipo realizará un seguimiento para asegurarse de que tanto tú como tu nueva mascota estén adaptándose bien. Estamos aquí para apoyarte en cada paso del camino.",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-10 justify-start min-h-screen py-20 bg-gradient-to-br from-[#e0f7fa] to-[#f8fafc]">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-5xl font-bold text-[#3DD9D6] drop-shadow-lg">Registro y Gestión de Solicitudes</h1>
        <p className="text-lg text-gray-600">Paso a paso para adoptar.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4">
        {pasos.map((paso, idx) => (
          <div
            key={idx}
            className="bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col gap-2 border-l-8 border-[#3DD9D6] animate-fade-in"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-[#3DD9D6]">{idx + 1}</span>
              <h2 className="text-xl font-semibold text-[#3DD9D6]">{paso.titulo.replace(/^\d+\.\s/, '')}</h2>
            </div>
            <p className="text-gray-700">{paso.descripcion}</p>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}