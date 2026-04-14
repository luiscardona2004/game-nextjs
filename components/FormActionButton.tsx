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
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {confirmMessage ? (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={async () => {
              if (pending) return;

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
                hiddenSubmitRef.current?.click();
              }
            }}
            className={`${className} ${pending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {pending && <span className="loading loading-ring loading-sm" />}
              {pending ? pendingLabel : label}
            </span>
          </button>
          <button ref={hiddenSubmitRef} type="submit" hidden disabled={pending} aria-hidden="true" />
        </>
      ) : (
        <button
          type="submit"
          disabled={pending}
          className={`${className} ${pending ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {pending && <span className="loading loading-ring loading-sm" />}
            {pending ? pendingLabel : label}
          </span>
        </button>
      )}
    </>
  );
}
