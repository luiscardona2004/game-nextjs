export default function GamesLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816]">
      
      {/* Glow de fondo */}
      <div className="absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative flex flex-col items-center gap-4">
        
        {/* Loader tipo ring con glow */}
        <span className="loading loading-ring loading-xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"></span>

        {/* Texto */}
        <p className="text-sm tracking-wide text-blue-200/70">
          Cargando catálogo...
        </p>
      </div>
    </div>
  );
}