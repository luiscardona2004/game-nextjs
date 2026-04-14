"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { stackClientApp } from "@/stack/client";

export default function SignOutButton() {
  const router = useRouter();
  const user = stackClientApp.useUser({ or: "return-null" });

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Cerrar sesion",
      text: "Estas seguro de que quieres cerrar sesion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      background: "#0f172a",
      color: "#e2e8f0",
    });

    if (!result.isConfirmed) {
      return;
    }

    await user.signOut();
    router.push("/?alert=signed-out");
  };

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
    >
      Salir
    </button>
  );
}
