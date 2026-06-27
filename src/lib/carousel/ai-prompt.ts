import {
  createSlideId,
  insertBeforeClosingSlides,
  SESSION_SLIDE_TITLES,
  type CarouselProfile,
  type CarouselSlide,
  type SessionInstructor,
} from "@/lib/carousel/types";

export const CHATGPT_BASE_URL = "https://chatgpt.com/";

export type CarouselAiSlideDescriptor = {
  key: string;
  label: string;
  hint: string;
  currentText?: string;
};

export type CarouselAiNewSlide = {
  key: string;
  title: string;
  text: string;
};

export type CarouselAiResponse = {
  slides: { key: string; text: string }[];
  newSlides?: CarouselAiNewSlide[];
  certificateNumber?: string;
};

export type CarouselAiApplyStats = {
  updated: number;
  added: number;
};

export type ParseCarouselAiResult =
  | { ok: true; data: CarouselAiResponse }
  | { ok: false; error: string };

const SESSION_HINTS: Record<SessionInstructor, string> = {
  hameed: "Problem-first thinking, scoping, and deciding what to build",
  leo: "Building it the right way — tools, workflow, and hands-on builds",
  hari: "Taking it to the right people — distribution, positioning, and launch",
};

export function getSlideAiKey(slide: CarouselSlide): string | null {
  if (slide.type === "intro" || slide.type === "outro") return null;
  if (slide.type === "certificate") return "certificate";
  if (slide.type === "content" && slide.aiKey) return slide.aiKey;
  if (slide.type === "content" && slide.instructor) return `session-${slide.instructor}`;
  if (slide.type === "content") return `content-${slide.id}`;
  return null;
}

export function getTemplateSlideDescriptors(slides: CarouselSlide[]): CarouselAiSlideDescriptor[] {
  return slides.flatMap((slide) => {
    if (slide.hidden || slide.type !== "content" || !slide.instructor) return [];

    const key = `session-${slide.instructor}`;
    const label = slide.title?.trim() || SESSION_SLIDE_TITLES[slide.instructor];
    const currentText = slide.text.trim() ? slide.text.trim() : undefined;

    return [
      {
        key,
        label,
        hint: SESSION_HINTS[slide.instructor],
        currentText,
      },
    ];
  });
}

export function getEditableSlideDescriptors(slides: CarouselSlide[]): CarouselAiSlideDescriptor[] {
  return slides.flatMap((slide) => {
    if (slide.hidden) return [];

    const key = getSlideAiKey(slide);
    if (!key || key === "certificate" || slide.type !== "content") return [];

    const label =
      slide.type === "content" ? slide.title?.trim() || "Content slide" : "Content slide";

    const hint =
      slide.instructor && slide.instructor in SESSION_HINTS
        ? SESSION_HINTS[slide.instructor]
        : "Any takeaway, story, or lesson from the workshop";

    const currentText = slide.text.trim() ? slide.text.trim() : undefined;

    return [{ key, label, hint, currentText }];
  });
}

export function buildCarouselAiPrompt(slides: CarouselSlide[], profile: CarouselProfile): string {
  const templates = getTemplateSlideDescriptors(slides);
  const hasCertificate = slides.some((s) => s.type === "certificate" && !s.hidden);
  const attendeeName = profile.name.trim() || "the attendee";

  const templateBlock = templates
    .map(
      (item) =>
        `- key: "${item.key}" · ${item.label} (${item.hint})${
          item.currentText ? ` · current draft: "${item.currentText}"` : ""
        }`,
    )
    .join("\n");

  const jsonExample = {
    slides: templates.map((item) => ({ key: item.key, text: "…" })),
    newSlides: [
      {
        key: "extra-funny-moment",
        title: "The funniest thing that happened",
        text: "…",
      },
      {
        key: "extra-new-tool",
        title: "One thing I had never tried before",
        text: "…",
      },
    ],
    ...(hasCertificate ? { certificateNumber: "001" } : {}),
  };

  return `You are helping ${attendeeName} write a LinkedIn/Instagram carousel about the "AI Vibe Coding" workshop — a 4-hour, hands-on session with Hameed, Leo, and Hari in Chennai.

FIXED SLIDES (already designed — do NOT write copy for these):
- Intro: workshop recap with attendee photo and event details
- Outro: attendee profile photo, name, account ID, and hashtags
${hasCertificate ? "- Certificate: fixed layout with verification link\n" : ""}
${
  templates.length
    ? `OPTIONAL TEMPLATE SLIDES (fill when their story clearly maps to a session):
${templateBlock}
`
    : ""
}YOUR GOAL:
Turn a messy, honest brain-dump into a carousel with as many content slides as the material deserves — not just three. One idea per slide. First person. No hashtags in slide body. Each slide: 2–4 short lines for a 1080×1080 canvas.

CONVERSATION FLOW:
1. Warm intro. Tell them they can tap the microphone and ramble out loud — rough is perfect. No need for polished answers.
2. Open ramble (one invitation, not a checklist). Ask them to talk freely about:
   - What they actually learned today (big and small)
   - What surprised them, made them laugh, or felt memorable
   - One completely new thing they picked up — a tool, mindset, or technique
   - Any builds, breakthroughs, conversations, or "aha" moments worth sharing
   Encourage them to keep going until they've emptied their head. Follow up only if something great was hinted at but not explained.
3. When they seem done, synthesize:
   - Fill template keys (session-hameed, session-leo, session-hari) only when their ramble clearly maps to that instructor's session. Omit a template key if nothing fits — do not force it.
   - Create additional slides in "newSlides" for every distinct story, joke, insight, tool, or moment that deserves its own slide. Use short punchy titles. Aim for 2–6 extra slides when they shared enough; more is fine if the ramble was rich.
   - Split crowded ideas across slides rather than cramming one slide.
   - Use their words and tone — light edits for clarity only.
${
  hasCertificate
    ? '4. If they mention a certificate number, include certificateNumber in the JSON (digits only, e.g. "001").\n'
    : ""
}${hasCertificate ? "5" : "4"}. Output ONLY valid JSON — no markdown fences, no commentary — in exactly this shape:
${JSON.stringify(jsonExample, null, 2)}

Keys in "slides" must match existing template keys. Keys in "newSlides" must be unique snake-case ids (e.g. extra-funny-moment, extra-shipped-mvp).

Start now with a warm one-line intro, invite them to use voice, then ask them to ramble about what they learned and what stood out.`;
}

export function buildChatGptPromptUrl(prompt: string): string {
  const url = new URL(CHATGPT_BASE_URL);
  url.searchParams.set("q", prompt);
  return url.toString();
}

function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

function parseNewSlides(raw: unknown): CarouselAiNewSlide[] | ParseCarouselAiResult {
  if (raw === undefined) return [];

  if (!Array.isArray(raw)) {
    return { ok: false, error: '"newSlides" must be an array when provided.' };
  }

  const newSlides: CarouselAiNewSlide[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") {
      return {
        ok: false,
        error: "Each newSlides entry must be an object with key, title, and text.",
      };
    }
    const item = entry as Record<string, unknown>;
    if (
      typeof item.key !== "string" ||
      typeof item.title !== "string" ||
      typeof item.text !== "string"
    ) {
      return {
        ok: false,
        error: 'Each newSlides entry needs string "key", "title", and "text" fields.',
      };
    }
    newSlides.push({
      key: item.key.trim(),
      title: item.title.trim(),
      text: item.text.trim(),
    });
  }

  return newSlides;
}

export function parseCarouselAiResponse(raw: string): ParseCarouselAiResult {
  if (!raw.trim()) {
    return { ok: false, error: "Paste the JSON from ChatGPT first." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonObject(raw));
  } catch {
    return { ok: false, error: "Invalid JSON. Copy only the JSON object ChatGPT returned." };
  }

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "JSON must be an object." };
  }

  const record = parsed as Record<string, unknown>;

  if (!("slides" in record) && !("newSlides" in record)) {
    return { ok: false, error: 'JSON must include a "slides" and/or "newSlides" array.' };
  }

  const slides: { key: string; text: string }[] = [];
  if (record.slides !== undefined) {
    if (!Array.isArray(record.slides)) {
      return { ok: false, error: '"slides" must be an array.' };
    }
    for (const entry of record.slides) {
      if (!entry || typeof entry !== "object") {
        return { ok: false, error: "Each slide entry must be an object with key and text." };
      }
      const item = entry as Record<string, unknown>;
      if (typeof item.key !== "string" || typeof item.text !== "string") {
        return { ok: false, error: 'Each slide needs string "key" and "text" fields.' };
      }
      slides.push({ key: item.key.trim(), text: item.text.trim() });
    }
  }

  const newSlidesResult = parseNewSlides(record.newSlides);
  if (!Array.isArray(newSlidesResult)) return newSlidesResult;

  if (slides.length === 0 && newSlidesResult.length === 0) {
    return { ok: false, error: "JSON must include at least one slide or newSlides entry." };
  }

  let certificateNumber: string | undefined;
  if (record.certificateNumber !== undefined) {
    if (typeof record.certificateNumber !== "string") {
      return { ok: false, error: '"certificateNumber" must be a string of digits.' };
    }
    certificateNumber = record.certificateNumber.replace(/[^\d]/g, "");
  }

  return { ok: true, data: { slides, newSlides: newSlidesResult, certificateNumber } };
}

export function applyCarouselAiResponse(
  slides: CarouselSlide[],
  profile: CarouselProfile,
  data: CarouselAiResponse,
): { slides: CarouselSlide[]; profile: CarouselProfile; stats: CarouselAiApplyStats } {
  const textByKey = new Map(data.slides.map((item) => [item.key, item.text]));
  let updated = 0;

  let nextSlides = slides.map((slide) => {
    const key = getSlideAiKey(slide);
    if (!key || key === "certificate" || slide.type !== "content") return slide;

    const text = textByKey.get(key);
    if (text === undefined) return slide;

    updated += 1;
    return { ...slide, text };
  });

  let added = 0;
  for (const newSlide of data.newSlides ?? []) {
    const existingIndex = nextSlides.findIndex(
      (slide) => slide.type === "content" && slide.aiKey === newSlide.key,
    );

    if (existingIndex !== -1) {
      const existing = nextSlides[existingIndex];
      if (existing?.type === "content") {
        nextSlides[existingIndex] = {
          ...existing,
          title: newSlide.title,
          text: newSlide.text,
        };
        updated += 1;
      }
      continue;
    }

    const insertAt = insertBeforeClosingSlides(nextSlides);
    nextSlides = [
      ...nextSlides.slice(0, insertAt),
      {
        id: createSlideId(),
        type: "content",
        title: newSlide.title,
        text: newSlide.text,
        aiKey: newSlide.key,
      },
      ...nextSlides.slice(insertAt),
    ];
    added += 1;
  }

  const nextProfile =
    data.certificateNumber !== undefined
      ? { ...profile, certificateNumber: data.certificateNumber }
      : profile;

  return { slides: nextSlides, profile: nextProfile, stats: { updated, added } };
}

export function formatCarouselAiApplyStatus(stats: CarouselAiApplyStats): string {
  const parts: string[] = [];
  if (stats.updated > 0) {
    parts.push(`Updated ${stats.updated} slide${stats.updated === 1 ? "" : "s"}`);
  }
  if (stats.added > 0) {
    parts.push(`added ${stats.added} new slide${stats.added === 1 ? "" : "s"}`);
  }
  return parts.length ? `${parts.join(", ")}.` : "No changes applied.";
}
