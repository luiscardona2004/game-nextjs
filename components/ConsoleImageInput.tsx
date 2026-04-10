"use client";

import { useEffect, useMemo, useState } from "react";

type ConsoleImageInputProps = {
  inputId?: string;
  inputName?: string;
  label: string;
  helperText: string;
  currentImage?: string;
};

export default function ConsoleImageInput({
  inputId = "image",
  inputName = "image",
  label,
  helperText,
  currentImage,
}: ConsoleImageInputProps) {
  const previewWidth = 140;
  const previewHeight = 140;

  const fallbackImage = useMemo(() => {
    return currentImage?.trim() ? `/img/${currentImage}` : "/img/no-image.png";
  }, [currentImage]);

  const [previewUrl, setPreviewUrl] = useState(fallbackImage);

  useEffect(() => {
    setPreviewUrl(fallbackImage);
  }, [fallbackImage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
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
              alt="Vista previa de la consola"
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
            accept="image/*"
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-300 hover:file:bg-cyan-500/30 focus:border-cyan-400"
          />
          <p className="mt-2 text-xs text-gray-500">{helperText}</p>
        </div>
      </div>
    </div>
  );
}
