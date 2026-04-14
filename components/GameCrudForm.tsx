"use client";

import { useActionState } from "react";
import Link from "next/link";
import FormActionButton from "@/components/FormActionButton";
import GameImageInput from "@/components/GameImageInput";
import { emptyCrudFormState, type CrudFormState } from "@/lib/crud-schemas";

type ConsoleOption = {
  id: number;
  name: string;
};

type GameInitialValues = {
  id?: number;
  title?: string;
  cover?: string;
  developer?: string;
  releasedate?: string;
  genre?: string;
  description?: string;
  console_id?: string;
  price?: string;
};

type GameCrudFormProps = {
  mode: "create" | "edit";
  consoles: ConsoleOption[];
  initialValues?: GameInitialValues;
  cancelHref: string;
  submitLabel: string;
  pendingLabel: string;
  submitClassName: string;
  action: (state: CrudFormState, formData: FormData) => Promise<CrudFormState>;
  confirmMessage?: string;
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-300">{message}</p>;
}

export default function GameCrudForm({
  mode,
  consoles,
  initialValues,
  cancelHref,
  submitLabel,
  pendingLabel,
  submitClassName,
  action,
  confirmMessage,
}: GameCrudFormProps) {
  const [state, formAction] = useActionState(action, emptyCrudFormState);

  const values = {
    id: state.values.id ?? (initialValues?.id ? String(initialValues.id) : ""),
    current_cover: state.values.current_cover ?? initialValues?.cover ?? "",
    title: state.values.title ?? initialValues?.title ?? "",
    developer: state.values.developer ?? initialValues?.developer ?? "",
    releasedate: state.values.releasedate ?? initialValues?.releasedate ?? "",
    genre: state.values.genre ?? initialValues?.genre ?? "",
    description: state.values.description ?? initialValues?.description ?? "",
    console_id: state.values.console_id ?? initialValues?.console_id ?? "",
    price: state.values.price ?? initialValues?.price ?? "",
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
          <input type="hidden" name="current_cover" value={values.current_cover} />
        </>
      )}

      {state.formError && (
        <div className="md:col-span-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.formError}
        </div>
      )}

      <div className="md:col-span-2">
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-200">
          Titulo
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={values.title}
          className={inputClassName}
          placeholder="Ej. God of War Ragnarok"
        />
        <FieldError message={state.fieldErrors.title} />
      </div>

      <div>
        <label htmlFor="developer" className="mb-2 block text-sm font-medium text-gray-200">
          Desarrollador
        </label>
        <input
          id="developer"
          name="developer"
          type="text"
          required
          defaultValue={values.developer}
          className={inputClassName}
          placeholder="Ej. Santa Monica Studio"
        />
        <FieldError message={state.fieldErrors.developer} />
      </div>

      <div>
        <label htmlFor="genre" className="mb-2 block text-sm font-medium text-gray-200">
          Genero
        </label>
        <input
          id="genre"
          name="genre"
          type="text"
          required
          defaultValue={values.genre}
          className={inputClassName}
          placeholder="Ej. Accion / Aventura"
        />
        <FieldError message={state.fieldErrors.genre} />
      </div>

      <div>
        <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-200">
          Precio
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={values.price}
          className={inputClassName}
          placeholder="Ej. 59.99"
        />
        <FieldError message={state.fieldErrors.price} />
      </div>

      <div>
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

      <div>
        <label htmlFor="console_id" className="mb-2 block text-sm font-medium text-gray-200">
          Consola
        </label>
        <select
          id="console_id"
          name="console_id"
          required
          defaultValue={values.console_id}
          className={inputClassName}
        >
          <option value="" disabled>
            Selecciona una consola
          </option>
          {consoles.map((console) => (
            <option key={console.id} value={console.id}>
              {console.name}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors.console_id} />
      </div>

      <GameImageInput
        label={mode === "edit" ? "Cambiar imagen del juego" : "Imagen del juego"}
        helperText={
          mode === "edit"
            ? `Imagen actual: ${values.current_cover}. Si no eliges otra, se conserva la actual.`
            : "Selecciona una imagen desde tu equipo. Si no eliges ninguna, se usara no-image.png."
        }
        currentImage={values.current_cover || undefined}
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
          placeholder="Describe el juego, su historia o su jugabilidad..."
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
