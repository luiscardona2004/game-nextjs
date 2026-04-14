"use client";

import { useActionState } from "react";
import Link from "next/link";
import ConsoleImageInput from "@/components/ConsoleImageInput";
import FormActionButton from "@/components/FormActionButton";
import { emptyCrudFormState, type CrudFormState } from "@/lib/crud-schemas";

type ConsoleInitialValues = {
  id?: number;
  image?: string;
  name?: string;
  manufacturer?: string;
  releasedate?: string;
  description?: string;
};

type ConsoleCrudFormProps = {
  mode: "create" | "edit";
  initialValues?: ConsoleInitialValues;
  cancelHref: string;
  submitLabel: string;
  pendingLabel: string;
  submitClassName: string;
  action: (state: CrudFormState, formData: FormData) => Promise<CrudFormState>;
  confirmMessage?: string;
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-300">{message}</p>;
}

export default function ConsoleCrudForm({
  mode,
  initialValues,
  cancelHref,
  submitLabel,
  pendingLabel,
  submitClassName,
  action,
  confirmMessage,
}: ConsoleCrudFormProps) {
  const [state, formAction] = useActionState(action, emptyCrudFormState);

  const values = {
    id: state.values.id ?? (initialValues?.id ? String(initialValues.id) : ""),
    current_image: state.values.current_image ?? initialValues?.image ?? "",
    name: state.values.name ?? initialValues?.name ?? "",
    manufacturer: state.values.manufacturer ?? initialValues?.manufacturer ?? "",
    releasedate: state.values.releasedate ?? initialValues?.releasedate ?? "",
    description: state.values.description ?? initialValues?.description ?? "",
  };

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      {mode === "edit" && (
        <>
          <input type="hidden" name="id" value={values.id} />
          <input type="hidden" name="current_image" value={values.current_image} />
        </>
      )}

      {state.formError && (
        <div className="md:col-span-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.formError}
        </div>
      )}

      <div className="md:col-span-2">
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-200">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={values.name}
          className={inputClassName}
        />
        <FieldError message={state.fieldErrors.name} />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="manufacturer" className="mb-2 block text-sm font-medium text-gray-200">
          Fabricante
        </label>
        <input
          id="manufacturer"
          name="manufacturer"
          type="text"
          required
          defaultValue={values.manufacturer}
          className={inputClassName}
        />
        <FieldError message={state.fieldErrors.manufacturer} />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="releasedate" className="mb-2 block text-sm font-medium text-gray-200">
          Fecha de lanzamiento
        </label>
        <input
          id="releasedate"
          name="releasedate"
          type="date"
          required
          defaultValue={values.releasedate}
          className={inputClassName}
        />
        <FieldError message={state.fieldErrors.releasedate} />
      </div>

      <ConsoleImageInput
        label={mode === "edit" ? "Cambiar imagen de la consola" : "Imagen de la consola"}
        helperText={
          mode === "edit"
            ? `Imagen actual: ${values.current_image}. Si no eliges otra, se conserva la actual.`
            : "Selecciona una imagen desde tu equipo. Si no eliges ninguna, se usara no-image.png."
        }
        currentImage={values.current_image || undefined}
      />

      <div className="md:col-span-2">
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-200">
          Descripcion
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={values.description}
          className={inputClassName}
        />
        <FieldError message={state.fieldErrors.description} />
      </div>

      <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
        <Link
          href={cancelHref}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Cancelar
        </Link>
        <FormActionButton
          label={submitLabel}
          pendingLabel={pendingLabel}
          confirmMessage={confirmMessage}
          className={submitClassName}
        />
      </div>
    </form>
  );
}
