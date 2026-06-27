import { DEFAULT_ACCENT, bgSize, bgX, bgY, hexToRgb } from "./brand";

function accentSphereStops(accent: string): [number, string][] {
  const { r, g, b } = hexToRgb(accent);
  const light = (channel: number) => Math.round(channel + (255 - channel) * 0.72);
  return [
    [0, `rgba(${light(r)}, ${light(g)}, ${light(b)}, 0.45)`],
    [0.55, `rgba(${r}, ${g}, ${b}, 0.50)`],
    [1, `rgba(${r}, ${g}, ${b}, 0.75)`],
  ];
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

export function drawPremiumBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  accentColor: string = DEFAULT_ACCENT,
) {
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
    accentSphereStops(accentColor),
    bgSize(200, width, height),
    0.85,
  );

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
