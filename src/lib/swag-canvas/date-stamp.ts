import { SWAG_COLORS as C, accentTextColor } from "./brand";

type DateStampCopy = {
  label: string;
  day: string;
  month: string;
  meta: string;
};

export function drawDateStamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  copy: DateStampCopy,
  accentColor: string,
) {
  const radius = Math.round(width * 0.08);
  const pad = Math.round(width * 0.11);

  ctx.save();

  ctx.shadowColor = "oklch(0.58 0.2 32 / 0.16)";
  ctx.shadowBlur = Math.round(width * 0.12);
  ctx.shadowOffsetY = Math.round(width * 0.05);

  ctx.fillStyle = C.cream;
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "oklch(0.18 0.008 60 / 18%)";
  ctx.lineWidth = Math.max(1.5, width * 0.006);
  roundRect(ctx, x, y, width, height, radius);
  ctx.stroke();

  const dotSize = Math.max(8, Math.round(width * 0.04));
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(x + width - pad * 0.75, y + pad * 0.75, dotSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const labelSize = Math.round(width * 0.08);
  ctx.fillStyle = accentTextColor(accentColor);
  ctx.font = `700 ${labelSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText(copy.label.toUpperCase(), x + width / 2, y + pad);

  const daySize = Math.round(width * 0.34);
  ctx.fillStyle = C.ink;
  ctx.font = `800 ${daySize}px "Bricolage Grotesque", system-ui, sans-serif`;
  ctx.fillText(copy.day, x + width / 2, y + pad + labelSize + Math.round(width * 0.05));

  const monthSize = Math.round(width * 0.11);
  ctx.font = `700 ${monthSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  ctx.fillText(copy.month, x + width / 2, y + pad + labelSize + daySize + Math.round(width * 0.02));

  const dividerY = y + height - pad - Math.round(width * 0.12);
  ctx.strokeStyle = "oklch(0.18 0.008 60 / 12%)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + pad, dividerY);
  ctx.lineTo(x + width - pad, dividerY);
  ctx.stroke();

  const metaSize = Math.round(width * 0.065);
  ctx.fillStyle = C.soft;
  ctx.font = `700 ${metaSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText(copy.meta.toUpperCase(), x + width / 2, dividerY + Math.round(width * 0.045));

  ctx.restore();
}

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
