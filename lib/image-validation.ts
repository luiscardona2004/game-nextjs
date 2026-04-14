import { z } from "zod";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;

export const IMAGE_INPUT_ACCEPT = ALLOWED_IMAGE_EXTENSIONS.join(",");

export function getImageValidationHint() {
  return "Formatos permitidos: JPG, PNG o WEBP. Tamano maximo: 4 MB.";
}

const imageFileSchema = z
  .object({
    size: z.number().gt(0, "El archivo seleccionado esta vacio."),
    type: z.enum(ALLOWED_IMAGE_MIME_TYPES, {
      error: () => ({ message: "La imagen debe estar en formato JPG, PNG o WEBP." }),
    }),
    name: z.string().min(1, "El archivo debe tener un nombre valido."),
  })
  .superRefine((file, context) => {
    const extension = file.name.includes(".")
      ? `.${file.name.split(".").pop()?.toLowerCase()}`
      : "";

    if (
      !ALLOWED_IMAGE_EXTENSIONS.includes(
        extension as (typeof ALLOWED_IMAGE_EXTENSIONS)[number]
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La extension del archivo no es valida. Usa JPG, PNG o WEBP.",
        path: ["name"],
      });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La imagen no puede pesar mas de 4 MB.",
        path: ["size"],
      });
    }
  });

export function validateImageFile(file: { size: number; type: string; name: string }) {
  const parsed = imageFileSchema.safeParse(file);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "La imagen seleccionada no es valida.");
  }
}
