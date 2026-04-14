const DEFAULT_IMAGE_PATH = "/img/no-image.png";

export function resolveStoredImageSrc(image?: string | null) {
  const value = image?.trim();

  if (!value) {
    return DEFAULT_IMAGE_PATH;
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `/img/${value}`;
}
