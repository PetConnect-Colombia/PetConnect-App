import Link from "next/link";
import Image from "next/image"; // Import Image component
import AvailablePetsSection from "./components/AvailablePetsSection"; // New import
import DonationsSection from "./components/DonationsSection"; // New import
import StepsToAdoptSection from "./components/StepsToAdoptSection"; // New import

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col"> {/* Changed to flex-col to stack sections */}
      {/* Hero Section */}
      <div className="relative flex-grow flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <Image
          src="/images/hero-adoption.png" // Placeholder image, user should replace
          alt="Perro y gato abrazándose, simbolizando la adopción"
          fill // Use fill prop instead of layout="fill"
          className="z-0 object-contain" // Add object-cover to className instead of objectFit
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white p-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Adopta, No Compres: Salva una Vida
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Cada mascota merece un hogar lleno de amor. Descubre compañeros leales esperando una segunda oportunidad.
          </p>
          <Link href="/home/catalogo" passHref>
            <button className="bg-[#3DD9D6] hover:bg-[#2BB2B0] text-white text-lg md:text-xl font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#3DD9D6] focus:ring-opacity-50">
              Encuentra tu Compañero Ideal
            </button>
          </Link>
        </div>
      </div>

      {/* Available Pets Section */}
      <AvailablePetsSection />

      {/* Donations Section */}
      <DonationsSection />

      {/* Steps to Adopt Section */}
      <StepsToAdoptSection />
    </div>
  );
}