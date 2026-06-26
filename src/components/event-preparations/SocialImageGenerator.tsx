"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Instagram, Linkedin } from "lucide-react";

import hameedPhoto from "@/assets/hameed.jpeg";
import hariPhoto from "@/assets/hari.png";
import leoPhoto from "@/assets/leo.jpeg";
import { Reveal } from "@/components/landing/motion";

type Format = "linkedin" | "instagram";

const HOST_PHOTO_URLS = [hameedPhoto.src, leoPhoto.src, hariPhoto.src] as const;

const FORMATS: Record<Format, { label: string; width: number; height: number }> = {
  linkedin: { label: "LinkedIn post", width: 1080, height: 1350 },
  instagram: { label: "Instagram story", width: 1080, height: 1920 },
};

const C = {
  page: "#F7EFE3",
  cream: "#FFF7EB",
  ink: "#1c1917",
  muted: "#6b6560",
  soft: "#8a847c",
  accent: "#F45118",
};

const BG_REF = 1080;

function bgX(x: number, width: number) {
  return (x / BG_REF) * width;
}

function bgY(y: number, height: number) {
  return (y / BG_REF) * height;
}

function bgSize(size: number, width: number, height: number) {
  return size * (Math.min(width, height) / BG_REF);
}

function drawSoftSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  stops: [number, string][],
  blur: number,
  opacity: number,
) {
  ctx.save();
  ctx.filter = `blur(${blur}px)`;
  ctx.globalAlpha = opacity;
  const grad = ctx.createRadialGradient(cx - radius * 0.12, cy, 0, cx, cy, radius);
  for (const [offset, color] of stops) {
    grad.addColorStop(offset, color);
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPremiumBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const baseGrad = ctx.createRadialGradient(
    bgX(380, width),
    bgY(540, height),
    0,
    bgX(380, width),
    bgY(540, height),
    bgSize(700, width, height),
  );
  baseGrad.addColorStop(0, "rgba(255, 250, 240, 0.9)");
  baseGrad.addColorStop(1, "rgba(244, 226, 204, 0.35)");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  drawSoftSphere(
    ctx,
    bgX(850, width),
    bgY(500, height),
    bgSize(500, width, height),
    [
      [0, "rgba(255, 226, 177, 0.45)"],
      [0.55, "rgba(255, 167, 72, 0.50)"],
      [1, "rgba(244, 82, 24, 0.75)"],
    ],
    bgSize(200, width, height),
    0.85,
  );

  // drawSoftSphere(
  //   ctx,
  //   bgX(600, width),
  //   bgY(209, height),
  //   bgSize(100, width, height),
  //   [
  //     [0, "rgba(255, 226, 177, 0.45)"],
  //     [0.55, "rgba(255, 167, 72, 0.50)"],
  //     [1, "rgba(244, 82, 24, 0.75)"],
  //   ],
  //   bgSize(100, width, height),
  //   0.85,
  // );

  const mainCx = bgX(850, width);
  const mainCy = bgY(760, height);
  const mainR = bgSize(365, width, height);
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = bgSize(1.5, width, height);
  ctx.filter = `blur(${bgSize(2, width, height)}px)`;
  ctx.beginPath();
  ctx.arc(mainCx, mainCy, mainR * 0.92, Math.PI * 1.08, Math.PI * 1.62);
  ctx.stroke();
  ctx.restore();

  // drawSoftSphere(
  //   ctx,
  //   bgX(1080, width),
  //   bgY(220, height),
  //   bgSize(195, width, height),
  //   [
  //     [0, "rgba(245, 78, 20, 0.75)"],
  //     [0.5, "rgba(255, 135, 48, 0.45)"],
  //     [1, "rgba(255, 230, 205, 0.05)"],
  //   ],
  //   bgSize(36, width, height),
  //   0.8,
  // );

  const arcCx = bgX(120, width);
  const arcCy = height + bgSize(40, width, height);
  const arcRadii = [230, 280, 340];
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = bgSize(1, width, height);
  for (const r of arcRadii) {
    const radius = bgSize(r, width, height);
    ctx.beginPath();
    ctx.arc(arcCx, arcCy, radius, Math.PI * 1.05, Math.PI * 1.55);
    ctx.stroke();
  }
  ctx.restore();

  const gridX = bgX(995, width);
  const gridY = bgY(405, height);
  const dotSize = bgSize(4, width, height);
  const dotGap = bgSize(14, width, height);
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let row = 0; row < 6; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const fade = 1 - col * 0.08 - row * 0.03;
      ctx.globalAlpha = Math.max(0.2, 0.5 * fade);
      ctx.beginPath();
      ctx.arc(gridX + col * dotGap, gridY + row * dotGap, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  const pattern = getNoisePattern(ctx);
  if (pattern) {
    ctx.save();
    ctx.globalAlpha = 0.095;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.035;
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

type SocialImageGeneratorProps = {
  attendeeName: string;
  organisation: string;
  embedded?: boolean;
};

let hostImagesCache: HTMLImageElement[] | null = null;

async function loadHostImages() {
  if (hostImagesCache) return hostImagesCache;
  hostImagesCache = await Promise.all(HOST_PHOTO_URLS.map((src) => loadImage(src)));
  return hostImagesCache;
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function ensureFonts() {
  await Promise.all([
    document.fonts.load('800 140px "Bricolage Grotesque"'),
    document.fonts.load('800 96px "Bricolage Grotesque"'),
    document.fonts.load('700 52px "Bricolage Grotesque"'),
    document.fonts.load('700 36px "Inter Tight"'),
    document.fonts.load('600 30px "Inter Tight"'),
    document.fonts.load('700 22px "Inter Tight"'),
  ]);
}

let noisePatternCache: CanvasPattern | null = null;

function getNoisePattern(ctx: CanvasRenderingContext2D) {
  if (noisePatternCache) return noisePatternCache;

  const size = 200;
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const octx = off.getContext("2d");
  if (!octx) return null;

  const imageData = octx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = 128 + Math.random() * 12 - 6;
    imageData.data[i] = grain;
    imageData.data[i + 1] = grain;
    imageData.data[i + 2] = grain;
    imageData.data[i + 3] = 255;
  }
  octx.putImageData(imageData, 0, 0);
  noisePatternCache = ctx.createPattern(off, "repeat");
  return noisePatternCache;
}

function drawAvatarUserIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const headR = size * 0.22;
  ctx.fillStyle = C.soft;
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.12, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.38, size * 0.34, Math.PI, 0);
  ctx.fill();
}

function drawAvatarCircle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  photo: HTMLImageElement | null,
  scale: number,
  cx: number,
  cy: number,
) {
  const radius = bgSize(300, width, height) * scale;
  const ring = Math.max(10, bgSize(5, width, height));

  ctx.save();
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = ring;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + ring * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  if (photo) {
    const cover = Math.max((radius * 2) / photo.width, (radius * 2) / photo.height);
    const drawW = photo.width * cover;
    const drawH = photo.height * cover;
    ctx.drawImage(photo, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  } else {
    ctx.fillStyle = "rgba(255, 247, 235, 0.95)";
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    drawAvatarUserIcon(ctx, cx, cy - radius * 0.06, radius * 1.05);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = C.muted;
    ctx.font = `600 ${Math.round(bgSize(22, width, height) * scale)}px "Inter Tight", system-ui, sans-serif`;
    ctx.fillText("Add your photo", cx, cy + radius * 0.52);
  }

  ctx.restore();
}

function fitWrappedName(
  ctx: CanvasRenderingContext2D,
  name: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
) {
  const lineHeightFactor = 1.12;

  for (let size = maxSize; size >= minSize; size -= 2) {
    ctx.font = `800 ${size}px "Bricolage Grotesque", system-ui, sans-serif`;
    const lineHeight = Math.round(size * lineHeightFactor);

    if (ctx.measureText(name).width <= maxWidth) {
      return { size, lines: [name], lineHeight };
    }

    const lines = wrapText(ctx, name, maxWidth);
    const allFit = lines.every((line) => ctx.measureText(line).width <= maxWidth);
    if (allFit && lines.length > 0) {
      return { size, lines, lineHeight };
    }
  }

  ctx.font = `800 ${minSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  return {
    size: minSize,
    lines: wrapText(ctx, name, maxWidth),
    lineHeight: Math.round(minSize * lineHeightFactor),
  };
}

function attendeeTextMaxWidth(
  width: number,
  height: number,
  scale: number,
  pad: number,
) {
  const avatarCx = bgX(950, width);
  const avatarRadius = bgSize(300, width, height) * scale;
  const avatarRing = Math.max(10, bgSize(5, width, height));
  const gap = spacing(scale, "md");
  return Math.max(
    Math.round(width * 0.42),
    Math.round(avatarCx - avatarRadius - avatarRing - pad - gap),
  );
}

function spacing(scale: number, size: "sm" | "md" | "lg" | "xl") {
  const base = { sm: 16, md: 28, lg: 48, xl: 64 };
  return Math.round(base[size] * scale);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let line = words[0] ?? "";

  for (let i = 1; i < words.length; i += 1) {
    const next = `${line} ${words[i]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
    } else {
      lines.push(line);
      line = words[i] ?? "";
    }
  }

  lines.push(line);
  return lines;
}

function drawHostAvatar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  image: HTMLImageElement,
  borderColor: string,
  borderWidth: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  const cover = Math.max((radius * 2) / image.width, (radius * 2) / image.height);
  const drawW = image.width * cover;
  const drawH = image.height * cover;
  ctx.drawImage(image, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawHostAvatarStack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  overlap: number,
  images: HTMLImageElement[],
) {
  const radius = size / 2;
  const cy = y + radius;
  images.forEach((image, index) => {
    const cx = x + radius + index * (size - overlap);
    drawHostAvatar(ctx, cx, cy, radius, image, "#F7EFE3", Math.max(3, size * 0.07));
  });
  return x + size + (images.length - 1) * (size - overlap);
}

async function drawSocialImage(
  canvas: HTMLCanvasElement,
  format: Format,
  attendeeName: string,
  organisation: string,
  photoImage: HTMLImageElement | null,
) {
  const { width, height } = FORMATS[format];
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await ensureFonts();
  const hostImages = await loadHostImages();

  const isStory = format === "instagram";
  const s = isStory ? 1.08 : 1;
  const pad = Math.round(72 * s);
  const contentW = Math.round(width * 0.56);
  const displayName = attendeeName.trim();
  const company = organisation.trim();

  const labelSize = Math.round(70 * s);
  const hostAvatarSize = Math.round(70 * s);
  const hostOverlap = Math.round(12 * s);
  const bylineSize = Math.round(30 * s);
  const nameMaxSize = Math.round(80 * s);
  const nameMinSize = Math.round(50 * s);
  const companySize = Math.round(35 * s);
  const dateSize = Math.round(60 * s);
  const locationSize = Math.round(50 * s);
  const hashtagSize = Math.round(70 * s);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const titleMaxSize = Math.round(150 * s);
  const titleMinSize = Math.round(100 * s);
  let titleSize = titleMaxSize;
  let titleTwoLine = false;

  while (titleSize >= titleMinSize) {
    ctx.font = `800 ${titleSize}px "Bricolage Grotesque", system-ui, sans-serif`;
    const titleWidth =
      ctx.measureText("AI Vibe Coding: The ").width +
      ctx.measureText("Right").width +
      ctx.measureText(" Way").width;
    if (titleWidth <= contentW) break;
    titleSize -= 2;
  }

  if (titleSize < titleMinSize) {
    titleSize = titleMinSize;
    titleTwoLine = true;
  }

  const titleHeight = titleTwoLine
    ? Math.round(titleSize * 2.15)
    : Math.round(titleSize * 1.15);

  const attendeeTextW = attendeeTextMaxWidth(width, height, s, pad);
  const companyLineHeight = Math.round(companySize * 1.28);

  const { size: nameSize, lines: nameLines, lineHeight: nameLineHeight } = fitWrappedName(
    ctx,
    displayName,
    attendeeTextW,
    nameMaxSize,
    nameMinSize,
  );

  ctx.font = `600 ${companySize}px "Inter Tight", system-ui, sans-serif`;
  const companyLines = company ? wrapText(ctx, company, attendeeTextW) : [];

  const nameBlockHeight = nameLines.length * nameLineHeight;
  const companyBlockHeight =
    companyLines.length > 0
      ? spacing(s, "sm") + companyLines.length * companyLineHeight
      : 0;
  const attendeeBlockHeight = nameBlockHeight + companyBlockHeight;

  let y = pad;

  const labelTop = y;
  y += labelSize + spacing(s, "md");

  const titleTop = y;
  y += titleHeight + spacing(s, "md");

  const hostsTop = y;
  const topBottom = hostsTop + hostAvatarSize;

  const hashtagsTop = height - pad - Math.round(hashtagSize * 1.15);
  const locationTop = hashtagsTop - spacing(s, "sm") - Math.round(locationSize * 1.15);
  const dateTop = locationTop - spacing(s, "sm") - Math.round(dateSize * 1.15);

  const middleZoneTop = topBottom + spacing(s, "lg");
  const middleZoneBottom = dateTop - spacing(s, "lg");
  const middleZoneHeight = Math.max(attendeeBlockHeight, middleZoneBottom - middleZoneTop);
  const nameTop = middleZoneTop + Math.round((middleZoneHeight - attendeeBlockHeight) / 2.5);

  let companyTop: number | null = null;
  if (companyLines.length > 0) {
    companyTop = nameTop + nameBlockHeight + spacing(s, "sm");
  }

  const avatarCx = bgX(950, width);
  const avatarCy = height / 2;

  drawPremiumBackground(ctx, width, height);
  drawAvatarCircle(ctx, width, height, photoImage, s, avatarCx, avatarCy);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = C.accent;
  ctx.font = `700 ${labelSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText("I'm attending", pad, labelTop);

  ctx.font = `800 ${titleSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  if (!titleTwoLine) {
    let titleX = pad;
    ctx.fillStyle = C.ink;
    ctx.fillText("AI Vibe Coding: The ", titleX, titleTop);
    titleX += ctx.measureText("AI Vibe Coding: The ").width;
    ctx.fillStyle = C.accent;
    ctx.fillText("Right", titleX, titleTop);
    titleX += ctx.measureText("Right").width;
    ctx.fillStyle = C.ink;
    ctx.fillText(" Way", titleX, titleTop);
  } else {
    ctx.fillStyle = C.ink;
    ctx.fillText("AI Vibe Coding:", pad, titleTop);
    const titleLine2Top = titleTop + Math.round(titleSize * 1.05);
    let titleX = pad;
    ctx.fillText("The ", titleX, titleLine2Top);
    titleX += ctx.measureText("The ").width;
    ctx.fillStyle = C.accent;
    ctx.fillText("Right", titleX, titleLine2Top);
    titleX += ctx.measureText("Right").width;
    ctx.fillStyle = C.ink;
    ctx.fillText(" Way", titleX, titleLine2Top);
  }

  const hostsEndX = drawHostAvatarStack(ctx, pad, hostsTop, hostAvatarSize, hostOverlap, hostImages);
  ctx.fillStyle = C.muted;
  ctx.font = `600 ${bylineSize}px "Inter Tight", system-ui, sans-serif`;
  const bylineTop = hostsTop + Math.round((hostAvatarSize - bylineSize) * 0.35);
  ctx.fillText("by Hameed, Leo and Hari", hostsEndX + Math.round(14 * s), bylineTop);

  ctx.fillStyle = C.ink;
  ctx.font = `800 ${nameSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  nameLines.forEach((line, index) => {
    ctx.fillText(line, pad, nameTop + index * nameLineHeight);
  });

  if (companyTop !== null) {
    ctx.fillStyle = C.muted;
    ctx.font = `600 ${companySize}px "Inter Tight", system-ui, sans-serif`;
    companyLines.forEach((line, index) => {
      ctx.fillText(line, pad, companyTop + index * companyLineHeight);
    });
  }

  ctx.fillStyle = C.ink;
  ctx.font = `700 ${dateSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  ctx.fillText("27th June 2026", pad, dateTop);

  ctx.fillStyle = C.muted;
  ctx.font = `600 ${locationSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText("Paperflite, Chennai", pad, locationTop);

  ctx.save();
  ctx.globalAlpha = 0.48;
  ctx.fillStyle = C.accent;
  ctx.font = `700 ${hashtagSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText("#builder #ai #vibe", pad, hashtagsTop);
  ctx.restore();
}

export function SocialImageGenerator({
  attendeeName,
  organisation,
  embedded = false,
}: SocialImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<Format>("linkedin");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const renderPreview = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    try {
      await drawSocialImage(canvas, format, attendeeName, organisation, photoImage);
    } finally {
      setIsDrawing(false);
    }
  }, [attendeeName, organisation, format, photoImage]);

  useEffect(() => {
    void renderPreview();
  }, [renderPreview]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (photoUrl) URL.revokeObjectURL(photoUrl);

    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl(nextUrl);
    const image = await loadImage(nextUrl);
    setPhotoImage(image);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const slug = getFirstName(attendeeName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vibe-coding-${format}-${slug || "share"}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const preview = FORMATS[format];
  const previewScale = Math.min(1, (embedded ? 360 : 560) / preview.width);

  if (embedded) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FORMATS) as Format[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormat(key)}
              className={
                format === key
                  ? "inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-vermillion)] bg-[color:var(--accent-vermillion)] px-3 py-1.5 text-xs font-semibold text-[color:var(--bg-card)]"
                  : "inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-muted)]"
              }
            >
              {key === "linkedin" ? (
                <Linkedin className="h-3.5 w-3.5" />
              ) : (
                <Instagram className="h-3.5 w-3.5" />
              )}
              {FORMATS[key].label}
            </button>
          ))}
        </div>

        <div className="flex justify-center rounded-xl bg-[color:var(--bg-section)] p-4">
          <div
            className="overflow-hidden rounded-lg ring-1 ring-[color:var(--border)]"
            style={{
              width: preview.width * previewScale,
              height: preview.height * previewScale,
            }}
          >
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              style={{
                width: preview.width * previewScale,
                height: preview.height * previewScale,
              }}
            />
          </div>
        </div>

        <p className="text-center text-xs text-[color:var(--text-soft)]">
          {isDrawing
            ? "Updating preview…"
            : `${preview.width} × ${preview.height}px · ${FORMATS[format].label}`}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 text-sm font-medium text-[color:var(--text-main)] transition hover:border-[color:var(--accent-vermillion)]/40">
            <ImagePlus className="h-4 w-4 accent-text" />
            Upload photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handlePhotoChange}
            />
          </label>
          <button
            type="button"
            className="btn-primary inline-flex flex-1 items-center justify-center gap-2 !px-4 !py-3 !text-sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download poster
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="editorial-label text-[color:var(--accent-vermillion)]">Share</div>
        <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.02em] max-w-3xl">
          Tell everyone you&apos;re <span className="accent-text">coming</span>
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[color:var(--text-muted)]">
          Upload a photo — it never leaves your browser. Download a share poster ready for LinkedIn
          or Instagram.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Reveal delay={0.05}>
          <div className="group relative overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-5 shadow-[0_24px_64px_oklch(0.18_0.008_60/0.12)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-[color:var(--accent-vermillion)]" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FORMATS) as Format[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormat(key)}
                    className={
                      format === key
                        ? "inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-vermillion)] bg-[color:var(--accent-vermillion)] px-4 py-2 text-sm font-semibold text-[color:var(--bg-card)]"
                        : "inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-2 text-sm font-semibold text-[color:var(--text-muted)] transition hover:border-[color:var(--accent-vermillion)]/40"
                    }
                  >
                    {key === "linkedin" ? (
                      <Linkedin className="h-4 w-4" />
                    ) : (
                      <Instagram className="h-4 w-4" />
                    )}
                    {FORMATS[key].label}
                  </button>
                ))}
              </div>
              <span className="editorial-label text-[color:var(--text-soft)]">
                For {attendeeName}
              </span>
            </div>

            <div className="flex justify-center rounded-2xl bg-[color:var(--bg-section)] p-6">
              <div
                className="overflow-hidden rounded-xl shadow-[0_16px_48px_oklch(0.18_0.008_60/0.15)] ring-1 ring-[color:var(--border)]"
                style={{
                  width: preview.width * previewScale,
                  height: preview.height * previewScale,
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="block h-full w-full"
                  style={{
                    width: preview.width * previewScale,
                    height: preview.height * previewScale,
                  }}
                />
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[color:var(--text-soft)]">
              {isDrawing
                ? "Updating preview…"
                : `${preview.width} × ${preview.height}px · ${FORMATS[format].label}`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4">
            <label className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-card)] p-8 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent-vermillion)]/40 hover:shadow-[0_16px_40px_oklch(0.18_0.008_60/0.08)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-section)] accent-text transition-colors group-hover:border-[color:var(--accent-vermillion)] group-hover:bg-[color:var(--accent-vermillion)] group-hover:text-[color:var(--bg-card)]">
                <ImagePlus className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-display text-lg font-extrabold text-[color:var(--text-main)]">
                  Upload your photo
                </span>
                <span className="mt-2 block text-sm text-[color:var(--text-muted)]">
                  JPG or PNG · stays on your device · shown in your poster
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>

            {photoImage ? (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-card)] px-5 py-4 text-sm text-[color:var(--text-muted)]">
                Photo added. Switch formats above to preview both sizes.
              </div>
            ) : null}

            <button
              type="button"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 !px-6 !py-4 !text-base"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
              Download poster
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
