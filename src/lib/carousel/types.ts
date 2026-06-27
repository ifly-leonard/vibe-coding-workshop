export const CAROUSEL_SIZE = 1080;
export const CAROUSEL_PAD = 72;

export const BRANDING_LOGO_PATH = "/post-event/branding-logo.png";

export type CarouselSlide =
  | { id: string; type: "intro"; hidden?: boolean }
  | {
      id: string;
      type: "content";
      text: string;
      title?: string;
      instructor?: SessionInstructor;
      aiKey?: string;
      hidden?: boolean;
    }
  | { id: string; type: "certificate"; hidden?: boolean }
  | { id: string; type: "outro"; hidden?: boolean };

export type CarouselProfile = {
  name: string;
  linkedInId: string;
  certificateNumber: string;
  photo: HTMLImageElement | null;
  polaroidPhoto: HTMLImageElement | null;
};

export const CERTIFICATE_ID_PREFIX = "CERT/AIBN/2026/W01/";

export const SESSION_SLIDE_TITLES = {
  hameed: "What I learnt in Hameed's session",
  leo: "What I learnt in Leo's session",
  hari: "What I learnt in Hari's session",
} as const;

export type SessionInstructor = keyof typeof SESSION_SLIDE_TITLES;

export function formatCertificateId(number: string): string {
  const trimmed = number.trim();
  return trimmed ? `${CERTIFICATE_ID_PREFIX}${trimmed}` : `${CERTIFICATE_ID_PREFIX}…`;
}

export const CERTIFICATE_VERIFY_URL = "aibuildersnetwork.in/certificate";

export type RenderContext = {
  slideIndex: number;
  totalSlides: number;
  brandingLogo: HTMLImageElement | null;
  profile: CarouselProfile;
  accentColor: string;
};

export const CAROUSEL_FOOTER_HEIGHT = 120;

export function createDefaultProfile(name = "", linkedInId = ""): CarouselProfile {
  return { name, linkedInId, certificateNumber: "", photo: null, polaroidPhoto: null };
}

export function createSlideId() {
  return crypto.randomUUID();
}

export function createDefaultSlides(): CarouselSlide[] {
  return [
    { id: createSlideId(), type: "intro" },
    {
      id: createSlideId(),
      type: "content",
      title: SESSION_SLIDE_TITLES.hameed,
      instructor: "hameed",
      text: "",
    },
    {
      id: createSlideId(),
      type: "content",
      title: SESSION_SLIDE_TITLES.leo,
      instructor: "leo",
      text: "",
    },
    {
      id: createSlideId(),
      type: "content",
      title: SESSION_SLIDE_TITLES.hari,
      instructor: "hari",
      text: "",
    },
    { id: createSlideId(), type: "certificate" },
    { id: createSlideId(), type: "outro" },
  ];
}

export function insertBeforeClosingSlides(slides: CarouselSlide[]) {
  const insertAt = slides.findIndex((s) => s.type === "certificate" || s.type === "outro");
  return insertAt === -1 ? slides.length : insertAt;
}

export function addContentSlide(slides: CarouselSlide[]): CarouselSlide[] {
  const next = [...slides];
  next.splice(insertBeforeClosingSlides(slides), 0, {
    id: createSlideId(),
    type: "content",
    text: "",
  });
  return next;
}

export function hasSessionSlide(slides: CarouselSlide[], instructor: SessionInstructor): boolean {
  return slides.some((s) => s.type === "content" && s.instructor === instructor);
}

export function createSessionSlide(instructor: SessionInstructor): CarouselSlide {
  return {
    id: createSlideId(),
    type: "content",
    title: SESSION_SLIDE_TITLES[instructor],
    instructor,
    text: "",
  };
}

const SESSION_INSTRUCTOR_ORDER: SessionInstructor[] = ["hameed", "leo", "hari"];

export function addSessionSlide(
  slides: CarouselSlide[],
  instructor: SessionInstructor,
): CarouselSlide[] {
  if (hasSessionSlide(slides, instructor)) return slides;

  const next = [...slides];
  const newSlide = createSessionSlide(instructor);
  const targetIndex = SESSION_INSTRUCTOR_ORDER.indexOf(instructor);

  let insertAt = Math.max(0, next.findIndex((s) => s.type === "intro") + 1);

  for (let i = targetIndex - 1; i >= 0; i--) {
    const previousInstructor = SESSION_INSTRUCTOR_ORDER[i];
    const previousIndex = next.findIndex(
      (s) => s.type === "content" && s.instructor === previousInstructor,
    );
    if (previousIndex !== -1) {
      insertAt = previousIndex + 1;
      break;
    }
  }

  for (let i = targetIndex + 1; i < SESSION_INSTRUCTOR_ORDER.length; i++) {
    const nextInstructor = SESSION_INSTRUCTOR_ORDER[i];
    const nextIndex = next.findIndex(
      (s) => s.type === "content" && s.instructor === nextInstructor,
    );
    if (nextIndex !== -1) {
      insertAt = Math.min(insertAt, nextIndex);
      break;
    }
  }

  const closingIndex = next.findIndex((s) => s.type === "certificate" || s.type === "outro");
  if (closingIndex !== -1 && insertAt > closingIndex) insertAt = closingIndex;

  next.splice(insertAt, 0, newSlide);
  return next;
}

export function addCertificateSlide(slides: CarouselSlide[]): CarouselSlide[] {
  if (slides.some((s) => s.type === "certificate")) return slides;

  const outroIndex = slides.findIndex((s) => s.type === "outro");
  const insertAt = outroIndex === -1 ? slides.length : outroIndex;
  const next = [...slides];
  next.splice(insertAt, 0, { id: createSlideId(), type: "certificate" });
  return next;
}

export function deleteContentSlide(slides: CarouselSlide[], id: string): CarouselSlide[] {
  const slide = slides.find((s) => s.id === id);
  if (!slide || slide.type !== "content") return slides;
  const contentCount = slides.filter((s) => s.type === "content").length;
  if (contentCount <= 1) return slides;
  return slides.filter((s) => s.id !== id);
}

export function deleteCertificateSlide(slides: CarouselSlide[], id: string): CarouselSlide[] {
  const slide = slides.find((s) => s.id === id);
  if (!slide || slide.type !== "certificate") return slides;
  return slides.filter((s) => s.id !== id);
}

export function deleteSlide(slides: CarouselSlide[], id: string): CarouselSlide[] {
  const slide = slides.find((s) => s.id === id);
  if (!slide) return slides;
  if (slide.type === "content") return deleteContentSlide(slides, id);
  if (slide.type === "certificate") return deleteCertificateSlide(slides, id);
  return slides;
}

export function updateContentSlide(
  slides: CarouselSlide[],
  id: string,
  patch: { text?: string; title?: string },
): CarouselSlide[] {
  return slides.map((s) => (s.id === id && s.type === "content" ? { ...s, ...patch } : s));
}

export function duplicateContentSlide(slides: CarouselSlide[], id: string): CarouselSlide[] {
  const index = slides.findIndex((s) => s.id === id);
  const slide = slides[index];
  if (!slide || slide.type !== "content") return slides;

  const duplicate: CarouselSlide = {
    id: createSlideId(),
    type: "content",
    text: slide.text,
    title: slide.title,
    instructor: slide.instructor,
    hidden: slide.hidden,
  };

  const next = [...slides];
  next.splice(index + 1, 0, duplicate);
  return next;
}

export function toggleSlideHidden(slides: CarouselSlide[], id: string): CarouselSlide[] {
  return slides.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s));
}

export function getVisibleSlides(slides: CarouselSlide[]): CarouselSlide[] {
  return slides.filter((s) => !s.hidden);
}

export function slideTypeLabel(slide: CarouselSlide): string {
  if (slide.type === "intro") return "Intro";
  if (slide.type === "certificate") return "Certificate";
  if (slide.type === "outro") return "Outro";
  if (slide.title) return slide.title;
  return "Content";
}

export function slideLabel(slide: CarouselSlide, index: number, total: number): string {
  if (slide.type === "intro") return "Intro";
  if (slide.type === "certificate") return "Certificate";
  if (slide.type === "outro") return "Outro";
  return `${index + 1} / ${total}`;
}

export function canDeleteSlide(slide: CarouselSlide, slides: CarouselSlide[]): boolean {
  if (slide.type === "certificate") return true;
  if (slide.type === "content" && slide.instructor) return true;
  if (slide.type === "content") return slides.filter((s) => s.type === "content").length > 1;
  return false;
}

export function isFixedSlide(slide: CarouselSlide): boolean {
  return slide.type === "intro" || slide.type === "outro";
}

export function isReorderableSlide(slide: CarouselSlide): boolean {
  return !isFixedSlide(slide);
}

function reorderableIndexRange(slides: CarouselSlide[]) {
  return { start: 1, end: Math.max(1, slides.length - 1) };
}

export function canMoveSlide(
  slides: CarouselSlide[],
  id: string,
  direction: "up" | "down",
): boolean {
  const index = slides.findIndex((s) => s.id === id);
  const slide = slides[index];
  if (!slide || !isReorderableSlide(slide)) return false;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  const { start, end } = reorderableIndexRange(slides);
  if (targetIndex < start || targetIndex >= end) return false;

  return isReorderableSlide(slides[targetIndex]!);
}

export function moveSlide(
  slides: CarouselSlide[],
  id: string,
  direction: "up" | "down",
): CarouselSlide[] {
  if (!canMoveSlide(slides, id, direction)) return slides;

  const index = slides.findIndex((s) => s.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  const next = [...slides];
  [next[index], next[targetIndex]] = [next[targetIndex]!, next[index]!];
  return next;
}

export function reorderSlide(
  slides: CarouselSlide[],
  activeId: string,
  overId: string,
): CarouselSlide[] {
  const fromIndex = slides.findIndex((s) => s.id === activeId);
  const toIndex = slides.findIndex((s) => s.id === overId);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return slides;

  const activeSlide = slides[fromIndex];
  const overSlide = slides[toIndex];
  if (!activeSlide || !overSlide) return slides;
  if (!isReorderableSlide(activeSlide) || !isReorderableSlide(overSlide)) return slides;

  const { start, end } = reorderableIndexRange(slides);
  if (fromIndex < start || fromIndex >= end || toIndex < start || toIndex >= end) return slides;

  const next = [...slides];
  const [removed] = next.splice(fromIndex, 1);
  let insertAt = toIndex;
  if (fromIndex < toIndex) insertAt = toIndex - 1;
  next.splice(insertAt, 0, removed);
  return next;
}

export const CAROUSEL_COPY = {
  introLabel: "Workshop recap",
  introLead: "What I learnt at",
  workshopTitleLine1: "AI Vibe Coding:",
  workshopTitlePrefix: "The ",
  workshopTitleAccent: "right",
  workshopTitleSuffix: " way",
  introByline: "A 4-hour, hands-on workshop by Hameed, Leo and Hari.",
  dateStamp: {
    label: "Saturday",
    day: "27",
    month: "June 2026",
    meta: "4 Hours",
  },
  certificateLabel: "Certified",
  certificateHeadline: "By the way, I'm a certified vibe coder now.",
  certificateCta: "Verify my credentials at",
  certificateUrl: CERTIFICATE_VERIFY_URL,
} as const;
