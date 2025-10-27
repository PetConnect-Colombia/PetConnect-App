import Link from "next/link";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col gap-6 justify-center items-center w-full text-center">
            <h1 className="text-7xl font-bold text-[#3DD9D6]">PetConnect</h1>
            <p className="text-2xl text-gray-600">Servicios integrales para la adopción responsable y el bienestar animal.</p>
              <button className="bg-[#3DD9D6] text-white text-lg font-semibold px-4 py-2 rounded-full">
                <Link href="/home/catalogo">
                    Buscar ahora
                </Link>
              </button>
        </div>
    </div>
  );
}