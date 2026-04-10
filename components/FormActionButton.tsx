"use client";

import { useFormStatus } from "react-dom";

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

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (pending) return;
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
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
