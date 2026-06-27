import { SWAG_COLORS as C } from "./brand";
import { wrapText } from "./text";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawPolaroid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frameW: number,
  frameH: number,
  photo: HTMLImageElement | null,
  placeholderText = "Your photo",
) {
  const radius = Math.max(4, frameW * 0.02);
  const inset = frameW * 0.065;
  const bottomStrip = frameH * 0.2;
  const photoX = x + inset;
  const photoY = y + inset;
  const photoW = frameW - inset * 2;
  const photoH = frameH - inset - bottomStrip;

  ctx.save();
  ctx.shadowColor = "oklch(0.18 0.008 60 / 0.14)";
  ctx.shadowBlur = Math.round(frameW * 0.08);
  ctx.shadowOffsetY = Math.round(frameW * 0.04);
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, x, y, frameW, frameH, radius);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "oklch(0.18 0.008 60 / 10%)";
  ctx.lineWidth = Math.max(1, frameW * 0.004);
  roundRect(ctx, x, y, frameW, frameH, radius);
  ctx.stroke();

  ctx.fillStyle = "rgba(28, 25, 23, 0.04)";
  roundRect(ctx, photoX, photoY, photoW, photoH, Math.max(2, radius * 0.5));
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();

  if (photo) {
    const cover = Math.max(photoW / photo.width, photoH / photo.height);
    const drawW = photo.width * cover;
    const drawH = photo.height * cover;
    ctx.drawImage(
      photo,
      photoX + (photoW - drawW) / 2,
      photoY + (photoH - drawH) / 2,
      drawW,
      drawH,
    );
  } else {
    ctx.fillStyle = C.cream;
    ctx.fillRect(photoX, photoY, photoW, photoH);
    const fontSize = Math.round(frameW * 0.048);
    ctx.fillStyle = C.soft;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${fontSize}px "Inter Tight", system-ui, sans-serif`;
    const lines = wrapText(ctx, placeholderText, photoW * 0.88);
    const lineHeight = Math.round(fontSize * 1.35);
    const blockH = lines.length * lineHeight;
    let textY = photoY + photoH / 2 - blockH / 2 + lineHeight / 2;
    for (const line of lines) {
      ctx.fillText(line, photoX + photoW / 2, textY);
      textY += lineHeight;
    }
  }

  ctx.restore();

  return frameH;
}
