import hameedPhoto from "@/assets/hameed.jpeg";
import hariPhoto from "@/assets/hari.png";
import leoPhoto from "@/assets/leo.jpeg";

import { loadImage } from "./images";

const INSTRUCTOR_PHOTO_URLS = [hameedPhoto.src, leoPhoto.src, hariPhoto.src] as const;

let instructorImagesCache: HTMLImageElement[] | null = null;

export async function loadInstructorImages() {
  if (instructorImagesCache) return instructorImagesCache;
  instructorImagesCache = await Promise.all(INSTRUCTOR_PHOTO_URLS.map((src) => loadImage(src)));
  return instructorImagesCache;
}

function drawInstructorAvatar(
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

export function drawSingleInstructorAvatar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  image: HTMLImageElement,
  borderColor = "#F7EFE3",
) {
  const radius = size / 2;
  drawInstructorAvatar(
    ctx,
    x + radius,
    y + radius,
    radius,
    image,
    borderColor,
    Math.max(3, size * 0.07),
  );
  return size;
}

export function getInstructorImage(
  instructor: "hameed" | "leo" | "hari",
  images: HTMLImageElement[],
) {
  const index = { hameed: 0, leo: 1, hari: 2 }[instructor];
  return images[index] ?? images[0];
}

export function drawInstructorAvatarStack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  overlap: number,
  images: HTMLImageElement[],
  borderColor = "#F7EFE3",
) {
  const radius = size / 2;
  const cy = y + radius;

  images.forEach((image, index) => {
    const cx = x + radius + index * (size - overlap);
    drawInstructorAvatar(ctx, cx, cy, radius, image, borderColor, Math.max(3, size * 0.07));
  });

  return x + size + (images.length - 1) * (size - overlap);
}
