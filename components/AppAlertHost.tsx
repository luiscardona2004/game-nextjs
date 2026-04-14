"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

const ALERTS: Record<
  string,
  { icon: "success" | "info" | "warning" | "error"; title: string; text: string }
> = {
  "game-created": {
    icon: "success",
    title: "Juego guardado",
    text: "El juego se creo correctamente.",
  },
  "game-updated": {
    icon: "success",
    title: "Juego actualizado",
    text: "Los cambios del juego se guardaron correctamente.",
  },
  "game-deleted": {
    icon: "success",
    title: "Juego eliminado",
    text: "El juego se elimino correctamente.",
  },
  "console-created": {
    icon: "success",
    title: "Consola guardada",
    text: "La consola se creo correctamente.",
  },
  "console-updated": {
    icon: "success",
    title: "Consola actualizada",
    text: "Los cambios de la consola se guardaron correctamente.",
  },
  "console-deleted": {
    icon: "success",
    title: "Consola eliminada",
    text: "La consola se elimino correctamente.",
  },
  "signed-out": {
    icon: "success",
    title: "Sesion cerrada",
    text: "Has salido correctamente de tu cuenta.",
  },
};

export default function AppAlertHost() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastAlertRef = useRef<string | null>(null);

  useEffect(() => {
    const alertKey = searchParams.get("alert");

    if (!alertKey || lastAlertRef.current === alertKey) {
      return;
    }

    const alertConfig = ALERTS[alertKey];

    if (!alertConfig) {
      return;
    }

    lastAlertRef.current = alertKey;

    void Swal.fire({
      icon: alertConfig.icon,
      title: alertConfig.title,
      text: alertConfig.text,
      confirmButtonColor: "#06b6d4",
      background: "#0f172a",
      color: "#e2e8f0",
    }).then(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("alert");
      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
      lastAlertRef.current = null;
    });
  }, [pathname, router, searchParams]);

  return null;
}
