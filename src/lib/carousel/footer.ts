import { CAROUSEL_FOOTER_HEIGHT, CAROUSEL_PAD, type RenderContext } from "@/lib/carousel/types";
import { SWAG_COLORS as C, bgSize, bgX } from "@/lib/swag-canvas";

export function drawHeroProfileAvatar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  renderCtx: RenderContext,
) {
  const cx = bgX(950, width);
  const cy = CAROUSEL_PAD + contentAreaHeight(height) / 2 + bgSize(72, width, height);
  const radius = bgSize(280, width, height);
  const ring = Math.max(8, bgSize(6, width, height));
  const photo = renderCtx.profile.photo;

  ctx.save();
  ctx.strokeStyle = renderCtx.accentColor;
  ctx.lineWidth = ring;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + ring * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = "#FFEB3B";
  ctx.beginPath();
  ctx.ellipse(
    cx - radius * 0.08,
    cy - radius * 0.12,
    radius * 0.52,
    radius * 0.42,
    -0.35,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  if (photo) {
    const cover = Math.max((radius * 2) / photo.width, (radius * 2) / photo.height);
    const drawW = photo.width * cover;
    const drawH = photo.height * cover;
    ctx.drawImage(photo, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  } else {
    ctx.fillStyle = "rgba(255, 247, 235, 0.95)";
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.fillStyle = C.soft;
    ctx.beginPath();
    ctx.arc(cx, cy - radius * 0.12, radius * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + radius * 0.35, radius * 0.55, Math.PI, 0);
    ctx.fill();
  }

  ctx.restore();
}

export function heroAvatarTextMaxWidth(width: number, height: number, pad: number) {
  const cx = bgX(950, width);
  const radius = bgSize(280, width, height);
  const ring = Math.max(8, bgSize(6, width, height));
  const gap = Math.round(28 * (width / 1080));
  return Math.max(Math.round(width * 0.42), Math.round(cx - radius - ring - pad - gap));
}

export function drawProfileAvatar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  renderCtx: RenderContext,
) {
  const photo = renderCtx.profile.photo;

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
    ctx.fillStyle = C.soft;
    ctx.beginPath();
    ctx.arc(cx, cy - radius * 0.12, radius * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + radius * 0.35, radius * 0.55, Math.PI, 0);
    ctx.fill();
  }

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = renderCtx.accentColor;
  ctx.lineWidth = Math.max(2, radius * 0.08);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawFooterArrow(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const arrow = size * 0.35;
  ctx.beginPath();
  ctx.moveTo(cx - arrow * 0.35, cy);
  ctx.lineTo(cx + arrow * 0.45, cy);
  ctx.moveTo(cx + arrow * 0.1, cy - arrow * 0.55);
  ctx.lineTo(cx + arrow * 0.45, cy);
  ctx.lineTo(cx + arrow * 0.1, cy + arrow * 0.55);
  ctx.stroke();
  ctx.restore();
}

export function drawSlideFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  renderCtx: RenderContext,
  options?: { showArrow?: boolean; showDivider?: boolean },
) {
  const pad = CAROUSEL_PAD;
  const footerTop = height - CAROUSEL_FOOTER_HEIGHT;
  const showArrow = options?.showArrow ?? renderCtx.slideIndex < renderCtx.totalSlides - 1;
  const showDivider = options?.showDivider ?? false;

  if (showDivider) {
    ctx.save();
    ctx.strokeStyle = "rgba(28, 25, 23, 0.08)";
    ctx.lineWidth = Math.max(1, bgSize(1, width, height));
    ctx.beginPath();
    ctx.moveTo(pad, footerTop);
    ctx.lineTo(width - pad, footerTop);
    ctx.stroke();
    ctx.restore();
  }
  const avatarR = Math.round(bgSize(36, width, height));
  const avatarCx = pad + avatarR;
  const avatarCy = footerTop + CAROUSEL_FOOTER_HEIGHT / 2;
  const textX = avatarCx + avatarR + Math.round(16 * (width / 1080));

  drawProfileAvatar(ctx, avatarCx, avatarCy, avatarR, renderCtx);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const name = renderCtx.profile.name.trim() || "Your name";
  const linkedInRaw = renderCtx.profile.linkedInId.trim();
  const linkedInLabel = linkedInRaw
    ? linkedInRaw.startsWith("@")
      ? linkedInRaw
      : `@${linkedInRaw}`
    : "";

  ctx.fillStyle = C.ink;
  ctx.font = `700 ${Math.round(28 * (width / 1080))}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText(name, textX, footerTop + (linkedInLabel ? 28 : 38));

  if (linkedInLabel) {
    ctx.fillStyle = C.muted;
    ctx.font = `600 ${Math.round(20 * (width / 1080))}px "Inter Tight", system-ui, sans-serif`;
    ctx.fillText(linkedInLabel, textX, footerTop + 62);
  }

  if (showArrow) {
    const arrowSize = Math.round(bgSize(32, width, height));
    drawFooterArrow(
      ctx,
      width - pad - arrowSize,
      footerTop + CAROUSEL_FOOTER_HEIGHT / 2,
      arrowSize,
    );
  }
}

export function contentAreaHeight(height: number) {
  return height - CAROUSEL_FOOTER_HEIGHT - CAROUSEL_PAD;
}
