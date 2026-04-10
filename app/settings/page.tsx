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
      <div className="bg-[#0a0f1f] text-white">
        <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300/80">Settings</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Configuracion de la cuenta
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              Administra tu perfil, seguridad, correos, sesiones activas y otras opciones
              personales desde un solo lugar.
            </p>
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white p-2 shadow-2xl">
            <div className="rounded-[22px] bg-white text-slate-900">
              <AccountSettings />
            </div>
          </section>
        </div>
      </div>
    </SideBar>
  );
}
