import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  validateImageFile,
} from "@/lib/image-validation";

const UPLOAD_DIR = path.join(process.cwd(), "public", "img");
const DEFAULT_COVER = "no-image.png";

function getSafeExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const allowedExtensions = new Set<string>(ALLOWED_IMAGE_EXTENSIONS);

  return allowedExtensions.has(extension) ? extension : ".png";
}

export async function saveGameCover(file: FormDataEntryValue | null, baseName: string) {
  if (!(file instanceof File)) {
    return null;
  }

  validateImageFile(file);

  await mkdir(UPLOAD_DIR, { recursive: true });

  const extension = getSafeExtension(file.name);
  const normalizedBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "game-cover";

  const fileName = `${normalizedBaseName}-${Date.now()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`catalog/${fileName}`, buffer, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
    });

    return blob.url;
  }

  const filePath = path.join(UPLOAD_DIR, fileName);
  await writeFile(filePath, buffer);

  return fileName;
}

export function resolveCoverName(uploadedCover: string | null, currentCover?: string) {
  if (uploadedCover) {
    return uploadedCover;
  }

  if (currentCover?.trim()) {
    return currentCover;
  }

  return DEFAULT_COVER;
}
