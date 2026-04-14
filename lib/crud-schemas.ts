import { z } from "zod";

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} es obligatorio.`);

const validDateString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatoria.`)
    .refine((value) => !Number.isNaN(new Date(value).getTime()), `${label} invalida.`);

const positiveIntFromForm = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .transform((value) => Number(value))
    .refine((value) => Number.isInteger(value) && value > 0, message);

const nonNegativeNumberFromForm = (emptyMessage: string, invalidMessage: string) =>
  z
    .string()
    .trim()
    .min(1, emptyMessage)
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value) && value >= 0, invalidMessage);

export const createGameSchema = z.object({
  title: requiredText("El titulo"),
  developer: requiredText("El desarrollador"),
  releasedate: validDateString("La fecha de lanzamiento"),
  genre: requiredText("El genero"),
  description: requiredText("La descripcion"),
  console_id: positiveIntFromForm("Debes seleccionar una consola valida."),
  price: nonNegativeNumberFromForm(
    "El precio es obligatorio.",
    "El precio debe ser mayor o igual a 0."
  ),
});

export const updateGameSchema = createGameSchema.extend({
  id: positiveIntFromForm("ID de juego invalido."),
});

export const createConsoleSchema = z.object({
  name: requiredText("El nombre"),
  manufacturer: requiredText("El fabricante"),
  releasedate: validDateString("La fecha de lanzamiento"),
  description: requiredText("La descripcion"),
});

export const updateConsoleSchema = createConsoleSchema.extend({
  id: positiveIntFromForm("ID de consola invalido."),
});

export type CrudFieldErrors = Record<string, string>;

export type CrudFormState = {
  formError: string | null;
  fieldErrors: CrudFieldErrors;
  values: Record<string, string>;
};

export const emptyCrudFormState: CrudFormState = {
  formError: null,
  fieldErrors: {},
  values: {},
};

export function getValidationErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Los datos enviados no son validos.";
}

export function getValidationFieldErrors(error: z.ZodError): CrudFieldErrors {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors)
      .map(([key, messages]) => [key, messages?.[0]])
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}
