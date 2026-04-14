"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getImageValidationHint,
  IMAGE_INPUT_ACCEPT,
  validateImageFile,
} from "@/lib/image-validation";
import { resolveStoredImageSrc } from "@/lib/image-src";

type GameImageInputProps = {
  inputId?: string;
  inputName?: string;
  label: string;
  helperText: string;
  currentImage?: string;
};

export default function GameImageInput({
  inputId = "cover",
  inputName = "cover",
  label,
  helperText,
  currentImage,
}: GameImageInputProps) {
  const previewWidth = 250;
  const previewHeight = 250;

  const fallbackImage = useMemo(() => {
    return resolveStoredImageSrc(currentImage);
  }, [currentImage]);

  const [previewUrl, setPreviewUrl] = useState(fallbackImage);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    setPreviewUrl(fallbackImage);
  }, [fallbackImage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFileError("");
      setPreviewUrl(fallbackImage);
      return;
    }

    try {
      validateImageFile(file);
      setFileError("");
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "La imagen seleccionada no es valida.");
      event.target.value = "";
      setPreviewUrl(fallbackImage);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="md:col-span-2">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-200">
        {label}
      </label>

      <div className="rounded-2xl border border-white/10 bg-[#0f172a]/60 p-4">
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-[#11182d] p-2">
            <img
              src={previewUrl}
              alt="Vista previa de la imagen"
              className="block rounded-xl object-cover ring-1 ring-white/10"
              style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
            />
          </div>
        </div>

        <p className="mb-3 text-center text-xs text-gray-400">Vista previa</p>

        <div className="mx-auto w-full max-w-xl">
          <input
            id={inputId}
            name={inputName}
            type="file"
            accept={IMAGE_INPUT_ACCEPT}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-300 hover:file:bg-cyan-500/30 focus:border-cyan-400"
          />
          <p className="mt-2 text-xs text-gray-500">{helperText}</p>
          <p className="mt-1 text-xs text-gray-500">{getImageValidationHint()}</p>
          {fileError && <p className="mt-2 text-sm text-rose-300">{fileError}</p>}
        </div>
      </div>
    </div>
  );
}
