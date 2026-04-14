export default function SettingsLoading() {
  return (
    <div className="min-h-[calc(100dvh-7rem)] bg-[#0a0f1f] text-white">
      <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-md">
          <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300/80">Settings</p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">Configuracion de la cuenta</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
            Cargando perfil, seguridad y preferencias...
          </p>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-3 shadow-2xl">
          <div className="flex min-h-[480px] items-center justify-center rounded-[24px] border border-slate-200/80 bg-white text-slate-900 shadow-inner">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-ring loading-xl text-fuchsia-500" />
              <p className="text-sm font-medium text-slate-600">Preparando tus ajustes...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
