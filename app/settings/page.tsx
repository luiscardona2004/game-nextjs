import { AccountSettings } from "@stackframe/stack";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import { stackServerApp } from "@/stack/server";

export default async function SettingsPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/settings">
      <div className="min-h-[calc(100dvh-7rem)] bg-[#0a0f1f] text-white">
        <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300/80">Settings</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Configuracion de la cuenta
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
              Administra tu perfil, seguridad, correos, sesiones activas y otras opciones
              personales desde un solo lugar.
            </p>
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-3 shadow-2xl">
            <div className="rounded-[24px] border border-slate-200/80 bg-white text-slate-900 shadow-inner">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Cuenta
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Perfil y preferencias
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Revisa tus datos, credenciales y configuraciones personales.
                </p>
              </div>
              <AccountSettings />
            </div>
          </section>
        </div>
      </div>
    </SideBar>
  );
}
