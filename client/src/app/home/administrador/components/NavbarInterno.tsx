export default function NavbarInterno({ current, setCurrent }: { current: string; setCurrent: (v: string) => void }) {
  const opciones = [
    { key: 'inicio', label: 'Inicio' },
    { key: 'peluditos', label: 'Peluditos' },
    { key: 'solicitudes', label: 'Solicitudes de Adopción' },
    { key: 'seguimientos', label: 'Seguimientos' }, // New optionS
    { key: 'blogs', label: 'Blogs' },
    { key: 'donaciones', label: 'Donaciones' },
  ];
  return (
    <nav className="flex gap-2 md:gap-4 border-b border-[#3DD9D6] mb-8 bg-white/80 rounded-t-xl shadow-sm px-2 py-1">
      {opciones.map((op) => (
        <button
          key={op.key}
          className={`py-2 px-4 font-semibold rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-[#3DD9D6] 
            ${current === op.key
              ? 'bg-[#3DD9D6] text-white shadow-md scale-105'
              : 'bg-white text-[#3DD9D6] hover:bg-[#e0f7fa] hover:scale-105'
            }`}
          onClick={() => setCurrent(op.key)}
        >
          {op.label}
        </button>
      ))}
    </nav>
  );
}