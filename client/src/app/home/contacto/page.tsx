'use client';

export default function ContactoAdopciones() {
  return (
    <footer className="w-full bg-white/90 py-20">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-[#3DD9D6] mb-2">¿Tienes dudas sobre adopciones?</h2>
          <p className="text-gray-700 mb-3">
            Nuestro equipo está listo para ayudarte en todo el proceso de adopción y resolver tus inquietudes.
          </p>
          <p className="text-gray-600">
            Horario de atención: <span className="font-semibold">Lunes a Viernes, 9:00am - 6:00pm</span>
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center md:items-end gap-2">
          <span className="text-gray-700 font-semibold">Contáctanos:</span>
          <a
            href="mailto:adopciones@petconnect.com"
            className="text-[#3DD9D6] hover:underline font-medium"
          >
            adopciones@petconnect.com
          </a>
          <a
            href="tel:+573001234567"
            className="text-[#3DD9D6] hover:underline font-medium"
          >
            +57 300 123 4567
          </a>
          <span className="text-gray-600">Cra. 45 # 123-45, Bogotá, Colombia</span>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} PetConnect. Todos los derechos reservados.
      </div>
    </footer>
  );
}