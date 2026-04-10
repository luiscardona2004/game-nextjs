export default function CreateGameLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816]">
      <div className="absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative flex flex-col items-center gap-4">
        <span className="loading loading-ring loading-xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"></span>

        <p className="text-sm tracking-wide text-blue-200/70">
          Cargando creacion de juego...
        </p>
      </div>
    </div>
  );
}
