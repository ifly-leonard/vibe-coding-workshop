import { getVisibleSlides, type CarouselProfile, type CarouselSlide } from "@/lib/carousel/types";
import { renderAllCarouselSlides } from "@/lib/carousel/render-slide";
import { loadBrandingLogo } from "@/lib/swag-canvas";

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function slideFilename(slide: CarouselSlide, index: number): string {
  const num = String(index + 1).padStart(2, "0");
  if (slide.type === "intro") return `slide-${num}-intro.png`;
  if (slide.type === "certificate") return `slide-${num}-certificate.png`;
  if (slide.type === "outro") return `slide-${num}-outro.png`;
  return `slide-${num}.png`;
}

export async function exportCarouselPdf(
  slides: CarouselSlide[],
  profile: CarouselProfile,
  accentColor: string,
) {
  const brandingLogo = await loadBrandingLogo();
  const visibleSlides = getVisibleSlides(slides);
  const canvases = await renderAllCarouselSlides(visibleSlides, brandingLogo, profile, accentColor);
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF({
    unit: "px",
    format: [1080, 1080],
    compress: true,
  });

  for (let i = 0; i < canvases.length; i += 1) {
    if (i > 0) pdf.addPage([1080, 1080], "p");
    pdf.addImage(canvases[i].toDataURL("image/png"), "PNG", 0, 0, 1080, 1080);
  }

  pdf.save("vibe-coding-carousel-linkedin.pdf");
}

export async function exportCarouselZip(
  slides: CarouselSlide[],
  profile: CarouselProfile,
  accentColor: string,
) {
  const brandingLogo = await loadBrandingLogo();
  const visibleSlides = getVisibleSlides(slides);
  const canvases = await renderAllCarouselSlides(visibleSlides, brandingLogo, profile, accentColor);
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  await Promise.all(
    canvases.map(async (canvas, index) => {
      const blob = await canvasToBlob(canvas);
      if (!blob) return;
      const slide = visibleSlides[index];
      if (!slide) return;
      zip.file(slideFilename(slide, index), blob);
    }),
  );

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, "vibe-coding-carousel-instagram.zip");
}
