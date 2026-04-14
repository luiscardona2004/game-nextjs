"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import Swal from "sweetalert2";

type FormActionButtonProps = {
  label: string;
  pendingLabel?: string;
  className: string;
  confirmMessage?: string;
};

export default function FormActionButton({
  label,
  pendingLabel = "Procesando...",
  className,
  confirmMessage,
}: FormActionButtonProps) {
  const { pending } = useFormStatus();
  const skipConfirmRef = useRef(false);

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={async (event) => {
        if (pending) return;
        if (confirmMessage && !skipConfirmRef.current) {
          event.preventDefault();

          const result = await Swal.fire({
            title: "Confirmar accion",
            text: confirmMessage,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#06b6d4",
            cancelButtonColor: "#334155",
            background: "#0f172a",
            color: "#e2e8f0",
          });

          if (result.isConfirmed) {
            skipConfirmRef.current = true;
            event.currentTarget.form?.requestSubmit();
            setTimeout(() => {
              skipConfirmRef.current = false;
            }, 0);
          }
        }
      }}
      className={`${className} ${pending ? "cursor-not-allowed opacity-70" : ""}`}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {pending && (
          <span className="loading loading-ring loading-sm" />
        )}
        {pending ? pendingLabel : label}
      </span>
    </button>
  );
}
