export const SWAG_COLORS = {
  page: "#F7EFE3",
  cream: "#FFF7EB",
  ink: "#1c1917",
  muted: "#6b6560",
  soft: "#8a847c",
  accent: "#F45118",
} as const;

export const DEFAULT_ACCENT: string = SWAG_COLORS.accent;

export const ACCENT_PRESETS = [
  { id: "orange", label: "Orange", color: "#F45118" },
  { id: "red", label: "Red", color: "#DC2626" },
  { id: "blue", label: "Blue", color: "#2563EB" },
  { id: "yellow", label: "Yellow", color: "#EAB308" },
  { id: "purple", label: "Purple", color: "#9333EA" },
  { id: "maroon", label: "Maroon", color: "#7F1D1D" },
] as const;

export function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function mixHexWithWhite(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel: number) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function relativeLuminance(r: number, g: number, b: number) {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foreground: string, background: string) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const fgLum = relativeLuminance(fg.r, fg.g, fg.b);
  const bgLum = relativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Darkens light accent colors so highlighted text stays readable on cream backgrounds. */
export function accentTextColor(hex: string, background = SWAG_COLORS.cream) {
  const { r, g, b } = hexToRgb(hex);

  for (let step = 0; step <= 14; step += 1) {
    const mix = step / 14;
    const darken = mix * 0.72;
    const next = rgbToHex(
      Math.round(r * (1 - darken)),
      Math.round(g * (1 - darken)),
      Math.round(b * (1 - darken)),
    );

    if (contrastRatio(next, background) >= 3.2 || step === 14) {
      return next;
    }
  }

  return hex;
}

export const BG_REF = 1080;

export function bgX(x: number, width: number) {
  return (x / BG_REF) * width;
}

export function bgY(y: number, height: number) {
  return (y / BG_REF) * height;
}

export function bgSize(size: number, width: number, height: number) {
  return size * (Math.min(width, height) / BG_REF);
}

export function spacing(scale: number, size: "sm" | "md" | "lg" | "xl") {
  const base = { sm: 16, md: 28, lg: 48, xl: 64 };
  return Math.round(base[size] * scale);
}
