import {
  contentAreaHeight,
  drawHeroProfileAvatar,
  drawProfileAvatar,
  drawSlideFooter,
  heroAvatarTextMaxWidth,
} from "@/lib/carousel/footer";
import { CAROUSEL_HASHTAGS } from "@/lib/carousel/share";
import {
  CAROUSEL_COPY,
  CAROUSEL_PAD,
  CAROUSEL_SIZE,
  formatCertificateId,
  CERTIFICATE_VERIFY_URL,
  type CarouselProfile,
  type CarouselSlide,
  type RenderContext,
  type SessionInstructor,
} from "@/lib/carousel/types";
import {
  SWAG_COLORS as C,
  accentTextColor,
  drawBrandingLogo,
  drawDateStamp,
  drawInstructorAvatarStack,
  drawPolaroid,
  drawPremiumBackground,
  drawSingleInstructorAvatar,
  ensureSwagFonts,
  getInstructorImage,
  hexToRgb,
  loadInstructorImages,
  spacing,
  wrapText,
} from "@/lib/swag-canvas";

type TextSegment = { text: string; bold?: boolean };

const INTRO_BYLINE_SEGMENTS: TextSegment[] = [
  { text: "A " },
  { text: "4-hour, hands-on workshop", bold: true },
  { text: " by " },
  { text: "Hameed", bold: true },
  { text: ", " },
  { text: "Leo", bold: true },
  { text: " and " },
  { text: "Hari", bold: true },
  { text: "." },
];

function scaleFont(size: number, width: number) {
  return Math.round(size * (width / CAROUSEL_SIZE));
}

function drawEditorialLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  accentColor: string,
  width: number,
) {
  const size = scaleFont(22, width);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = accentTextColor(accentColor);
  ctx.font = `700 ${size}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText(text.toUpperCase(), x, y);
  return size + scaleFont(10, width);
}

function drawAccentRule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  accentColor: string,
  width: number,
) {
  const ruleW = scaleFont(56, width);
  const ruleH = Math.max(3, scaleFont(4, width));
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, ruleW, ruleH);
  return ruleH + scaleFont(12, width);
}

function drawWorkshopTitle(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  maxWidth: number,
  accentColor: string,
  width: number,
) {
  const highlightColor = accentTextColor(accentColor);
  const maxSize = scaleFont(58, width);
  const minSize = scaleFont(44, width);
  let size = maxSize;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const line1 = CAROUSEL_COPY.workshopTitleLine1;
  const prefix = CAROUSEL_COPY.workshopTitlePrefix;
  const accent = CAROUSEL_COPY.workshopTitleAccent;
  const suffix = CAROUSEL_COPY.workshopTitleSuffix;

  while (size >= minSize) {
    ctx.font = `800 ${size}px "Bricolage Grotesque", system-ui, sans-serif`;
    const line1W = ctx.measureText(line1).width;
    const line2W =
      ctx.measureText(prefix).width + ctx.measureText(accent).width + ctx.measureText(suffix).width;

    if (line1W <= maxWidth && line2W <= maxWidth) {
      const lineGap = Math.round(size * 0.14);
      let y = topY;

      ctx.fillStyle = C.ink;
      ctx.fillText(line1, x, y);
      y += size + lineGap;

      let cx = x;
      ctx.fillText(prefix, cx, y);
      cx += ctx.measureText(prefix).width;
      ctx.fillStyle = highlightColor;
      ctx.fillText(accent, cx, y);
      cx += ctx.measureText(accent).width;
      ctx.fillStyle = C.ink;
      ctx.fillText(suffix, cx, y);

      return size + lineGap + size;
    }

    size -= 2;
  }

  ctx.font = `800 ${minSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  const lineGap = Math.round(minSize * 0.14);
  let y = topY;

  ctx.fillStyle = C.ink;
  ctx.fillText(line1, x, y);
  y += minSize + lineGap;

  let cx = x;
  ctx.fillText(prefix, cx, y);
  cx += ctx.measureText(prefix).width;
  ctx.fillStyle = highlightColor;
  ctx.fillText(accent, cx, y);
  cx += ctx.measureText(accent).width;
  ctx.fillStyle = C.ink;
  ctx.fillText(suffix, cx, y);

  return minSize + lineGap + minSize;
}

function instructorAccentName(instructor: SessionInstructor) {
  const name = instructor.charAt(0).toUpperCase() + instructor.slice(1);
  return `${name}'s`;
}

function fitCarouselTitleSize(
  ctx: CanvasRenderingContext2D,
  title: string,
  maxWidth: number,
  width: number,
) {
  const maxSize = scaleFont(58, width);
  const minSize = scaleFont(44, width);
  let size = maxSize;

  while (size >= minSize) {
    ctx.font = `800 ${size}px "Bricolage Grotesque", system-ui, sans-serif`;
    const lines = wrapText(ctx, title, maxWidth);
    if (lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      return { size, lines, lineHeight: Math.round(size * 1.14) };
    }
    size -= 2;
  }

  ctx.font = `800 ${minSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  return {
    size: minSize,
    lines: wrapText(ctx, title, maxWidth),
    lineHeight: Math.round(minSize * 1.14),
  };
}

function drawTitleLineWithAccent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  line: string,
  accentWord: string | undefined,
  highlightColor: string,
) {
  if (!accentWord || !line.includes(accentWord)) {
    ctx.fillStyle = C.ink;
    ctx.fillText(line, x, y);
    return;
  }

  const idx = line.indexOf(accentWord);
  const before = line.slice(0, idx);
  const after = line.slice(idx + accentWord.length);
  let cx = x;

  ctx.fillStyle = C.ink;
  if (before) {
    ctx.fillText(before, cx, y);
    cx += ctx.measureText(before).width;
  }
  ctx.fillStyle = highlightColor;
  ctx.fillText(accentWord, cx, y);
  cx += ctx.measureText(accentWord).width;
  if (after) {
    ctx.fillStyle = C.ink;
    ctx.fillText(after, cx, y);
  }
}

function drawCarouselTitle(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  maxWidth: number,
  title: string,
  accentColor: string,
  width: number,
  accentWord?: string,
) {
  const highlightColor = accentTextColor(accentColor);
  const { size, lines, lineHeight } = fitCarouselTitleSize(ctx, title, maxWidth, width);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `800 ${size}px "Bricolage Grotesque", system-ui, sans-serif`;

  let y = topY;
  lines.forEach((line) => {
    drawTitleLineWithAccent(ctx, x, y, line, accentWord, highlightColor);
    y += lineHeight;
  });

  return y - topY;
}

function drawSegmentedText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  segments: TextSegment[],
  size: number,
) {
  const lineHeight = Math.round(size * 1.45);
  let cx = x;
  let cy = y;

  segments.forEach((segment) => {
    ctx.font = `${segment.bold ? 700 : 600} ${size}px "Inter Tight", system-ui, sans-serif`;
    ctx.fillStyle = segment.bold ? C.ink : C.muted;

    for (const char of segment.text) {
      const charW = ctx.measureText(char).width;
      if (cx + charW > x + maxWidth && cx > x) {
        cx = x;
        cy += lineHeight;
      }
      ctx.fillText(char, cx, cy);
      cx += charW;
    }
  });

  return cy + lineHeight - y;
}

function getIntroLayout(width: number, height: number) {
  const pad = CAROUSEL_PAD;
  const stampW = scaleFont(240, width);
  const stampH = scaleFont(272, width);
  const columnGap = scaleFont(28, width);
  const heroMaxW = heroAvatarTextMaxWidth(width, height, pad);
  const contentW = Math.min(width - pad * 2 - stampW - columnGap, heroMaxW);
  const stampX = width - pad - stampW;
  const stampY = pad;

  return { pad, contentW, stampW, stampH, stampX, stampY };
}

function drawIntroSlide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  renderCtx: RenderContext,
  instructorImages: HTMLImageElement[],
) {
  const { pad, contentW, stampW, stampH, stampX, stampY } = getIntroLayout(width, height);
  const leadSize = scaleFont(38, width);
  const leadLineHeight = Math.round(leadSize * 1.25);
  const bylineSize = scaleFont(24, width);
  const hostSize = scaleFont(58, width);
  const hostOverlap = scaleFont(10, width);

  drawHeroProfileAvatar(ctx, width, height, renderCtx);

  drawDateStamp(
    ctx,
    stampX,
    stampY,
    stampW,
    stampH,
    CAROUSEL_COPY.dateStamp,
    renderCtx.accentColor,
  );

  let y = pad + spacing(1, "lg");

  y += drawEditorialLabel(ctx, pad, y, CAROUSEL_COPY.introLabel, renderCtx.accentColor, width);
  y += drawAccentRule(ctx, pad, y, renderCtx.accentColor, width);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = C.muted;
  ctx.font = `600 ${leadSize}px "Inter Tight", system-ui, sans-serif`;

  wrapText(ctx, CAROUSEL_COPY.introLead, contentW).forEach((line) => {
    ctx.fillText(line, pad, y);
    y += leadLineHeight;
  });

  y += spacing(1, "lg");
  y += drawWorkshopTitle(ctx, pad, y, contentW, renderCtx.accentColor, width);

  y += spacing(1, "md");
  y += drawSegmentedText(ctx, pad, y, contentW, INTRO_BYLINE_SEGMENTS, bylineSize);

  y += spacing(1, "sm");
  drawInstructorAvatarStack(ctx, pad, y, hostSize, hostOverlap, instructorImages);

  drawSlideFooter(ctx, width, height, renderCtx, { showDivider: true });
}

function drawContentSlide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  renderCtx: RenderContext,
  title?: string,
  instructor?: SessionInstructor,
  instructorImage?: HTMLImageElement | null,
) {
  const pad = CAROUSEL_PAD;
  const contentW = width - pad * 2;
  const avatarSize = scaleFont(96, width);
  const bodySize = scaleFont(36, width);
  const bodyLineHeight = Math.round(bodySize * 1.35);
  const areaH = contentAreaHeight(height);
  const titleText = title?.trim();
  const showAvatar = Boolean(instructorImage);
  const accentWord = instructor ? instructorAccentName(instructor) : undefined;

  drawBrandingLogo(ctx, renderCtx.brandingLogo, width, height);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  let blockHeight = 0;
  let titleBlockHeight = 0;
  let bodyLines: string[] = [];

  if (showAvatar && instructorImage) {
    blockHeight += avatarSize + spacing(1, "md");
  }

  if (titleText) {
    const { lines, lineHeight } = fitCarouselTitleSize(ctx, titleText, contentW, width);
    titleBlockHeight = lines.length * lineHeight;
    blockHeight += titleBlockHeight + spacing(1, "md");
  }

  ctx.font = `600 ${bodySize}px "Inter Tight", system-ui, sans-serif`;
  bodyLines = wrapText(ctx, text.trim() || "Add your message here…", contentW);
  blockHeight += bodyLines.length * bodyLineHeight;

  let y = pad + Math.max(spacing(1, "sm"), Math.round((areaH - pad - blockHeight) / 2));

  if (showAvatar && instructorImage) {
    drawSingleInstructorAvatar(ctx, pad, y, avatarSize, instructorImage);
    y += avatarSize + spacing(1, "md");
  }

  if (titleText) {
    drawCarouselTitle(ctx, pad, y, contentW, titleText, renderCtx.accentColor, width, accentWord);
    y += titleBlockHeight + spacing(1, "md");
  }

  ctx.font = `600 ${bodySize}px "Inter Tight", system-ui, sans-serif`;
  bodyLines.forEach((line) => {
    ctx.fillStyle = text.trim() ? C.ink : C.muted;
    ctx.fillText(line, pad, y);
    y += bodyLineHeight;
  });

  drawSlideFooter(ctx, width, height, renderCtx);
}

function drawAlertBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  text: string,
  accentColor: string,
  width: number,
) {
  const fontSize = scaleFont(22, width);
  const padX = scaleFont(18, width);
  const padY = scaleFont(14, width);
  const radius = scaleFont(12, width);
  const textMaxW = maxWidth - padX * 2;
  const highlight = accentTextColor(accentColor);

  ctx.font = `600 ${fontSize}px "Inter Tight", system-ui, sans-serif`;
  const lines = wrapText(ctx, text, textMaxW);
  const lineHeight = Math.round(fontSize * 1.35);
  const textBlockH = lines.length * lineHeight;
  const boxH = textBlockH + padY * 2;

  const { r, g, b } = hexToRgb(accentColor);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
  roundRect(ctx, x, y, maxWidth, boxH, radius);
  ctx.fill();

  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.35)`;
  ctx.lineWidth = Math.max(1, scaleFont(2, width));
  roundRect(ctx, x, y, maxWidth, boxH, radius);
  ctx.stroke();

  ctx.fillStyle = highlight;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((line, index) => {
    ctx.fillText(line, x + padX, y + padY + index * lineHeight);
  });

  return boxH;
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

function getCertificatePolaroidSize(width: number) {
  return {
    polaroidW: scaleFont(360, width),
    polaroidH: scaleFont(440, width),
  };
}

function measureCertificateBlock(
  ctx: CanvasRenderingContext2D,
  contentW: number,
  width: number,
  certificateId: string,
  verificationUrl: string,
) {
  const { polaroidH } = getCertificatePolaroidSize(width);
  const labelH = scaleFont(22, width) + scaleFont(10, width);
  const ruleH = Math.max(3, scaleFont(4, width)) + scaleFont(12, width);
  const headlineSize = scaleFont(36, width);
  const ctaSize = scaleFont(26, width);
  const idSize = scaleFont(26, width);
  const verifyUrlSize = scaleFont(22, width);
  const boxPadY = scaleFont(14, width);

  ctx.font = `600 ${headlineSize}px "Inter Tight", system-ui, sans-serif`;
  const headlineLines = wrapText(ctx, CAROUSEL_COPY.certificateHeadline, contentW);
  ctx.font = `600 ${ctaSize}px "Inter Tight", system-ui, sans-serif`;
  const ctaLines = wrapText(ctx, CAROUSEL_COPY.certificateCta, contentW);
  ctx.font = `600 ${verifyUrlSize}px "Inter Tight", system-ui, sans-serif`;
  const verifyLines = wrapText(ctx, verificationUrl, contentW - scaleFont(36, width));
  const verifyBlockH = verifyLines.length * Math.round(verifyUrlSize * 1.35) + boxPadY * 2;
  ctx.font = `600 ${idSize}px "Inter Tight", system-ui, sans-serif`;
  const idLines = wrapText(ctx, certificateId, contentW);
  const idBlockH = idLines.length * Math.round(idSize * 1.3);

  const textBlockH =
    labelH +
    ruleH +
    headlineLines.length * Math.round(headlineSize * 1.35) +
    spacing(1, "md") +
    ctaLines.length * Math.round(ctaSize * 1.3) +
    spacing(1, "sm") +
    verifyBlockH +
    spacing(1, "sm") +
    idBlockH;

  return polaroidH + spacing(1, "lg") + textBlockH;
}

function drawCertificateSlide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  renderCtx: RenderContext,
) {
  const pad = CAROUSEL_PAD;
  const contentW = width - pad * 2;
  const areaH = contentAreaHeight(height);
  const { polaroidW, polaroidH } = getCertificatePolaroidSize(width);
  const polaroidX = Math.round((width - polaroidW) / 2);
  const headlineSize = scaleFont(36, width);
  const headlineLineHeight = Math.round(headlineSize * 1.35);
  const ctaSize = scaleFont(26, width);
  const ctaLineHeight = Math.round(ctaSize * 1.3);

  const certificateId = formatCertificateId(renderCtx.profile.certificateNumber);
  const blockHeight = measureCertificateBlock(
    ctx,
    contentW,
    width,
    certificateId,
    CERTIFICATE_VERIFY_URL,
  );
  let y = pad + Math.max(spacing(1, "sm"), Math.round((areaH - blockHeight) / 2));

  drawPolaroid(
    ctx,
    polaroidX,
    y,
    polaroidW,
    polaroidH,
    renderCtx.profile.polaroidPhoto,
    "Add picture of you receiving the certificate",
  );
  y += polaroidH + spacing(1, "lg");

  y += drawEditorialLabel(
    ctx,
    pad,
    y,
    CAROUSEL_COPY.certificateLabel,
    renderCtx.accentColor,
    width,
  );
  y += drawAccentRule(ctx, pad, y, renderCtx.accentColor, width);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `600 ${headlineSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillStyle = C.ink;

  wrapText(ctx, CAROUSEL_COPY.certificateHeadline, contentW).forEach((line) => {
    ctx.fillText(line, pad, y);
    y += headlineLineHeight;
  });

  y += spacing(1, "md");

  ctx.fillStyle = C.muted;
  ctx.font = `600 ${ctaSize}px "Inter Tight", system-ui, sans-serif`;
  wrapText(ctx, CAROUSEL_COPY.certificateCta, contentW).forEach((line) => {
    ctx.fillText(line, pad, y);
    y += ctaLineHeight;
  });

  y += spacing(1, "sm");
  const urlBlockH = drawAlertBox(
    ctx,
    pad,
    y,
    contentW,
    CERTIFICATE_VERIFY_URL,
    renderCtx.accentColor,
    width,
  );
  y += urlBlockH + spacing(1, "sm");

  const idSize = scaleFont(26, width);
  const idLineHeight = Math.round(idSize * 1.3);
  ctx.fillStyle = C.ink;
  ctx.font = `600 ${idSize}px "Inter Tight", system-ui, sans-serif`;
  wrapText(ctx, certificateId, contentW).forEach((line) => {
    ctx.fillText(line, pad, y);
    y += idLineHeight;
  });

  drawSlideFooter(ctx, width, height, renderCtx, { showArrow: false, showDivider: true });
}

function measureOutroBlock(width: number) {
  const avatarR = scaleFont(88, width);
  const nameSize = scaleFont(52, width);
  const idSize = scaleFont(34, width);
  const hashtagSize = scaleFont(34, width);

  return (
    avatarR * 2 +
    spacing(1, "md") +
    Math.round(nameSize * 1.15) +
    spacing(1, "sm") +
    Math.round(idSize * 1.2) +
    spacing(1, "lg") +
    Math.round(hashtagSize * 1.3)
  );
}

function drawOutroSlide(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  renderCtx: RenderContext,
) {
  const pad = CAROUSEL_PAD;
  const centerX = width / 2;
  const areaTop = pad;
  const areaBottom = height - pad;
  const areaH = areaBottom - areaTop;

  const avatarR = scaleFont(88, width);
  const nameSize = scaleFont(52, width);
  const idSize = scaleFont(34, width);
  const hashtagSize = scaleFont(34, width);
  const nameLineHeight = Math.round(nameSize * 1.15);
  const idLineHeight = Math.round(idSize * 1.2);
  const hashtagLineHeight = Math.round(hashtagSize * 1.3);

  const name = renderCtx.profile.name.trim() || "Your name";
  const linkedInRaw = renderCtx.profile.linkedInId.trim();
  const linkedInLabel = linkedInRaw
    ? linkedInRaw.startsWith("@")
      ? linkedInRaw
      : `@${linkedInRaw}`
    : "@your-id";
  const hashtagText = CAROUSEL_HASHTAGS.join("  ");

  const blockHeight = measureOutroBlock(width);
  let y = areaTop + Math.round((areaH - blockHeight) / 2);

  drawProfileAvatar(ctx, centerX, y + avatarR, avatarR, renderCtx);
  y += avatarR * 2 + spacing(1, "md");

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = C.ink;
  ctx.font = `800 ${nameSize}px "Bricolage Grotesque", system-ui, sans-serif`;
  ctx.fillText(name, centerX, y);
  y += nameLineHeight + spacing(1, "sm");

  ctx.fillStyle = C.muted;
  ctx.font = `600 ${idSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText(linkedInLabel, centerX, y);
  y += idLineHeight + spacing(1, "lg");

  ctx.fillStyle = accentTextColor(renderCtx.accentColor);
  ctx.font = `700 ${hashtagSize}px "Inter Tight", system-ui, sans-serif`;
  ctx.fillText(hashtagText, centerX, y);
}

export async function renderCarouselSlide(
  slide: CarouselSlide,
  renderCtx: RenderContext,
  width = CAROUSEL_SIZE,
  height = CAROUSEL_SIZE,
): Promise<HTMLCanvasElement> {
  await ensureSwagFonts();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  drawPremiumBackground(ctx, width, height, renderCtx.accentColor);

  if (slide.type === "intro") {
    const instructorImages = await loadInstructorImages();
    drawIntroSlide(ctx, width, height, renderCtx, instructorImages);
  } else if (slide.type === "content") {
    let instructorImage: HTMLImageElement | null = null;
    if (slide.instructor) {
      const instructorImages = await loadInstructorImages();
      instructorImage = getInstructorImage(slide.instructor, instructorImages);
    }
    drawContentSlide(
      ctx,
      width,
      height,
      slide.text,
      renderCtx,
      slide.title,
      slide.instructor,
      instructorImage,
    );
  } else if (slide.type === "certificate") {
    drawCertificateSlide(ctx, width, height, renderCtx);
  } else {
    drawOutroSlide(ctx, width, height, renderCtx);
  }

  return canvas;
}

export async function renderAllCarouselSlides(
  slides: CarouselSlide[],
  brandingLogo: HTMLImageElement | null,
  profile: CarouselProfile,
  accentColor: string,
): Promise<HTMLCanvasElement[]> {
  const total = slides.length;
  return Promise.all(
    slides.map((slide, slideIndex) =>
      renderCarouselSlide(slide, {
        slideIndex,
        totalSlides: total,
        brandingLogo,
        profile,
        accentColor,
      }),
    ),
  );
}
