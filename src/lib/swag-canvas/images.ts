export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

let brandingLogoCache: HTMLImageElement | null | undefined;

export async function loadBrandingLogo(): Promise<HTMLImageElement | null> {
  if (brandingLogoCache !== undefined) return brandingLogoCache;

  try {
    brandingLogoCache = await loadImage("/post-event/branding-logo.png");
  } catch {
    brandingLogoCache = null;
  }

  return brandingLogoCache;
}

export function drawBrandingLogo(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  width: number,
  height: number,
) {
  if (!logo) return;

  const pad = Math.round(72 * (width / 1080));
  const maxW = Math.round(200 * (width / 1080));
  const maxH = Math.round(80 * (height / 1080));
  const scale = Math.min(maxW / logo.width, maxH / logo.height);
  const drawW = logo.width * scale;
  const drawH = logo.height * scale;
  const x = width - pad - drawW;
  const y = pad;

  ctx.drawImage(logo, x, y, drawW, drawH);
}
