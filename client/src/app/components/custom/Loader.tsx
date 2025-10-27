'use client';

export default function Loader() {
  const colors = ['#FFA23C', '#7ED957', '#A259FF', '#3DD9D6']; // Naranja, Verde, Morado, Celeste

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="flex gap-3">
        {colors.map((color, i) => (
          <span
            key={i}
            className="w-6 h-6 rounded-full animate-bounce"
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
