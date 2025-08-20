// src/components/HeroDecor.tsx

export default function HeroDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      {/* soft blobs */}
      <div className="absolute -top-12 -left-10 w-64 h-64 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="absolute top-24 left-1/3 w-40 h-40 rounded-full bg-amber-200/40 blur-2xl" />
      <div className="absolute bottom-10 left-20 w-52 h-52 rounded-full bg-blue-300/30 blur-3xl" />
      
      {/* pills */}
      <div className="absolute top-40 right-64 h-10 w-40 rounded-full bg-blue-100/70" />
      <div className="absolute bottom-24 left-1/2 h-9 w-36 rounded-full bg-amber-100/70" />

      {/* subtle rotated square */}
      <div className="absolute bottom-10 right-10 w-16 h-16 rotate-12 bg-blue-400/20 rounded-lg" />
    </div>
  );
}
