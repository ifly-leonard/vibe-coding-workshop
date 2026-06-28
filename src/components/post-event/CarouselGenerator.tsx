"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  CopyPlus,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";

import { CarouselAiModal } from "@/components/post-event/CarouselAiModal";
import { exportCarouselPdf, exportCarouselZip } from "@/lib/carousel/export";
import {
  CAROUSEL_HASHTAGS,
  CAROUSEL_TAG_ACCOUNTS,
  carouselShareCopyText,
} from "@/lib/carousel/share";
import { renderCarouselSlide } from "@/lib/carousel/render-slide";
import {
  CAROUSEL_SIZE,
  CERTIFICATE_ID_PREFIX,
  addCertificateSlide,
  addContentSlide,
  addSessionSlide,
  canDeleteSlide,
  createDefaultProfile,
  createDefaultSlides,
  deleteSlide,
  duplicateContentSlide,
  hasSessionSlide,
  isReorderableSlide,
  reorderSlide,
  slideLabel,
  slideTypeLabel,
  toggleSlideHidden,
  updateContentSlide,
  type CarouselProfile,
  type CarouselSlide,
  type SessionInstructor,
} from "@/lib/carousel/types";
import { loadBrandingLogo, loadImage, ACCENT_PRESETS, DEFAULT_ACCENT } from "@/lib/swag-canvas";

const THUMB_SIZE = 72;
const MAIN_PREVIEW_MAX = 420;
const CAROUSEL_DEMO_VIDEO_PATH = "/demo.mp4";

type LeftTabId = "branding" | "content" | "generate";

const LEFT_TABS: { id: LeftTabId; label: string }[] = [
  { id: "branding", label: "Branding" },
  { id: "content", label: "Content" },
  { id: "generate", label: "Generate" },
];

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

type UseAiButtonProps = {
  onClick: () => void;
};

function UseAiButton({ onClick }: UseAiButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="carousel-use-ai-btn group relative w-full overflow-hidden rounded-lg px-3 py-2.5 text-sm font-semibold text-[color:var(--text-main)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-vermillion)]/50"
    >
      <span className="relative z-[1] inline-flex items-center justify-center gap-1.5">
        <Zap className="h-4 w-4 text-[color:var(--accent-vermillion)]" aria-hidden />
        Use AI&apos;s help to generate
      </span>
    </button>
  );
}

type SlideCanvasProps = {
  slide: CarouselSlide;
  index: number;
  total: number;
  profile: CarouselProfile;
  brandingLogo: HTMLImageElement | null;
  accentColor: string;
  className?: string;
};

function SlideCanvas({
  slide,
  index,
  total,
  profile,
  brandingLogo,
  accentColor,
  className = "block aspect-square h-full w-full",
}: SlideCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    void renderCarouselSlide(slide, {
      slideIndex: index,
      totalSlides: total,
      brandingLogo,
      profile,
      accentColor,
    }).then((rendered) => {
      if (cancelled) return;
      canvas.width = CAROUSEL_SIZE;
      canvas.height = CAROUSEL_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(rendered, 0, 0);
    });

    return () => {
      cancelled = true;
    };
  }, [slide, index, total, profile, brandingLogo, accentColor]);

  return <canvas ref={canvasRef} className={className} />;
}

type SlideGalleryProps = {
  slides: CarouselSlide[];
  activeIndex: number;
  profile: CarouselProfile;
  brandingLogo: HTMLImageElement | null;
  accentColor: string;
  onSelect: (index: number) => void;
};

function SlideGallery({
  slides,
  activeIndex,
  profile,
  brandingLogo,
  accentColor,
  onSelect,
}: SlideGalleryProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeSlide = slides[activeIndex];
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < slides.length - 1;

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
            Preview
          </p>
          {activeSlide ? (
            <p className="mt-1 text-sm font-semibold text-[color:var(--text-main)]">
              Slide {activeIndex + 1} · {slideLabel(activeSlide, activeIndex, slides.length)}
              {activeSlide.hidden ? " · Hidden" : ""}
            </p>
          ) : null}
        </div>
        <p className="text-xs text-[color:var(--text-muted)]">
          {slides.length} slides · {CAROUSEL_SIZE}px
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="relative w-full" style={{ maxWidth: MAIN_PREVIEW_MAX }}>
          <div
            className={
              activeSlide?.hidden
                ? "aspect-square overflow-hidden rounded-2xl bg-[color:var(--bg-card)] opacity-50 ring-1 ring-dashed ring-[color:var(--border)]"
                : "aspect-square overflow-hidden rounded-2xl bg-[color:var(--bg-card)] shadow-[0_16px_48px_oklch(0.18_0.008_60/0.12)] ring-1 ring-[color:var(--border)]"
            }
          >
            {activeSlide ? (
              <SlideCanvas
                slide={activeSlide}
                index={activeIndex}
                total={slides.length}
                profile={profile}
                brandingLogo={brandingLogo}
                accentColor={accentColor}
              />
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Previous slide"
            disabled={!canGoPrev}
            onClick={() => onSelect(activeIndex - 1)}
            className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-card)] p-2.5 text-[color:var(--text-main)] shadow-sm transition hover:border-[color:var(--accent-vermillion)]/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={!canGoNext}
            onClick={() => onSelect(activeIndex + 1)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-card)] p-2.5 text-[color:var(--text-main)] shadow-sm transition hover:border-[color:var(--accent-vermillion)]/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex w-full items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={!canGoPrev}
            onClick={() => onSelect(activeIndex - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-main)] disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <span className="text-xs tabular-nums text-[color:var(--text-muted)]">
            {activeIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            aria-label="Next slide"
            disabled={!canGoNext}
            onClick={() => onSelect(activeIndex + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-main)] disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-6 shrink-0 border-t border-[color:var(--border)] pt-4">
        <div className="flex gap-2 overflow-x-auto px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            const isHidden = Boolean(slide.hidden);

            return (
              <button
                key={slide.id}
                ref={(node) => {
                  thumbRefs.current[index] = node;
                }}
                type="button"
                aria-label={`Slide ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(index)}
                className={
                  isActive
                    ? "shrink-0 rounded-lg border-2 border-[color:var(--accent-vermillion)] bg-[color:var(--bg-card)]"
                    : isHidden
                      ? "shrink-0 rounded-lg border-2 border-dashed border-[color:var(--border)] opacity-45"
                      : "shrink-0 rounded-lg border-2 border-[color:var(--border)] transition hover:border-[color:var(--accent-vermillion)]/40"
                }
                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
              >
                <div className="h-full w-full overflow-hidden rounded-[5px]">
                  <SlideCanvas
                    slide={slide}
                    index={index}
                    total={slides.length}
                    profile={profile}
                    brandingLogo={brandingLogo}
                    accentColor={accentColor}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type CarouselGeneratorProps = {
  initialName?: string;
  initialLinkedInId?: string;
};

export function CarouselGenerator({
  initialName = "",
  initialLinkedInId = "",
}: CarouselGeneratorProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(() => createDefaultSlides());
  const [activeIndex, setActiveIndex] = useState(0);
  const [profile, setProfile] = useState<CarouselProfile>(() =>
    createDefaultProfile(initialName, initialLinkedInId),
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [polaroidUrl, setPolaroidUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<"pdf" | "zip" | null>(null);
  const [brandingLogo, setBrandingLogo] = useState<HTMLImageElement | null>(null);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);
  const [leftTab, setLeftTab] = useState<LeftTabId>("branding");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(
    () => slides[0]?.id ?? null,
  );
  const [dragSlideId, setDragSlideId] = useState<string | null>(null);
  const [dropSlideId, setDropSlideId] = useState<string | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const hasCertificateSlide = slides.some((s) => s.type === "certificate");
  const reorderableSlideCount = slides.filter((s) => isReorderableSlide(s)).length;
  const missingSessionInstructors: SessionInstructor[] = (
    ["hameed", "leo", "hari"] as const
  ).filter((instructor) => !hasSessionSlide(slides, instructor));

  const markCopied = useCallback((key: string) => {
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 2000);
  }, []);

  const handleCopy = useCallback(
    async (key: string, text: string) => {
      await copyText(text);
      markCopied(key);
    },
    [markCopied],
  );

  const handleAiApply = useCallback((nextSlides: CarouselSlide[], nextProfile: CarouselProfile) => {
    setSlides(nextSlides);
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    void loadBrandingLogo().then(setBrandingLogo);
  }, []);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      if (polaroidUrl) URL.revokeObjectURL(polaroidUrl);
    };
  }, [photoUrl, polaroidUrl]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (photoUrl) URL.revokeObjectURL(photoUrl);

    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl(nextUrl);
    const image = await loadImage(nextUrl);
    setProfile((prev) => ({ ...prev, photo: image }));
  };

  const handlePolaroidChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (polaroidUrl) URL.revokeObjectURL(polaroidUrl);

    const nextUrl = URL.createObjectURL(file);
    setPolaroidUrl(nextUrl);
    const image = await loadImage(nextUrl);
    setProfile((prev) => ({ ...prev, polaroidPhoto: image }));
  };

  const handleAddSlide = () => {
    const next = addContentSlide(slides);
    const closingIndex = next.findIndex((s) => s.type === "certificate" || s.type === "outro");
    const newIndex = closingIndex === -1 ? next.length - 1 : Math.max(1, closingIndex - 1);
    const newSlide = next[newIndex];
    setSlides(next);
    setActiveIndex(newIndex);
    if (newSlide) setExpandedSlideId(newSlide.id);
  };

  const handleAddCertificateSlide = () => {
    const next = addCertificateSlide(slides);
    if (next === slides) return;
    const newIndex = next.findIndex((s) => s.type === "certificate");
    setSlides(next);
    setActiveIndex(newIndex);
    const newSlide = next[newIndex];
    if (newSlide) setExpandedSlideId(newSlide.id);
  };

  const handleAddSessionSlide = (instructor: SessionInstructor) => {
    const next = addSessionSlide(slides, instructor);
    if (next === slides) return;
    const newIndex = next.findIndex((s) => s.type === "content" && s.instructor === instructor);
    setSlides(next);
    setActiveIndex(newIndex);
    const newSlide = next[newIndex];
    if (newSlide) setExpandedSlideId(newSlide.id);
  };

  const handleDeleteSlide = (id: string) => {
    const slide = slides.find((s) => s.id === id);
    if (!slide || !canDeleteSlide(slide, slides)) return;

    const index = slides.findIndex((s) => s.id === id);
    setSlides((prev) => {
      const next = deleteSlide(prev, id);
      const nextIndex = Math.min(index, next.length - 1);
      setActiveIndex(nextIndex);
      setExpandedSlideId(next[nextIndex]?.id ?? null);
      return next;
    });
  };

  const handleDuplicateSlide = (id: string) => {
    const index = slides.findIndex((s) => s.id === id);
    const next = duplicateContentSlide(slides, id);
    if (next === slides) return;

    const newSlide = next[index + 1];
    setSlides(next);
    setActiveIndex(index + 1);
    if (newSlide) setExpandedSlideId(newSlide.id);
  };

  const handleToggleHide = (id: string) => {
    setSlides((prev) => toggleSlideHidden(prev, id));
  };

  const handleExpandSlide = (id: string, index: number) => {
    setExpandedSlideId((current) => (current === id ? null : id));
    setActiveIndex(index);
  };

  const handleDragStart = (id: string) => (event: React.DragEvent<HTMLButtonElement>) => {
    setDragSlideId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (id: string) => (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragSlideId || dragSlideId === id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropSlideId(id);
  };

  const handleDrop = (id: string) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!dragSlideId || dragSlideId === id) return;

    setSlides((prev) => {
      const next = reorderSlide(prev, dragSlideId, id);
      if (next === prev) return prev;
      const newIndex = next.findIndex((s) => s.id === dragSlideId);
      setActiveIndex(newIndex);
      setExpandedSlideId(dragSlideId);
      return next;
    });
    setDragSlideId(null);
    setDropSlideId(null);
  };

  const handleDragEnd = () => {
    setDragSlideId(null);
    setDropSlideId(null);
  };

  const handleTextChange = (id: string, text: string) => {
    setSlides((prev) => updateContentSlide(prev, id, { text }));
  };

  const handleTitleChange = (id: string, title: string) => {
    setSlides((prev) => updateContentSlide(prev, id, { title }));
  };

  const handleCertificateNumberChange = (value: string) => {
    const sanitized = value.replace(/[^\d]/g, "");
    setProfile((prev) => ({ ...prev, certificateNumber: sanitized }));
  };

  const handleExportPdf = useCallback(async () => {
    setIsExporting("pdf");
    try {
      await exportCarouselPdf(slides, profile, accentColor);
    } finally {
      setIsExporting(null);
    }
  }, [slides, profile, accentColor]);

  const handleExportZip = useCallback(async () => {
    setIsExporting("zip");
    try {
      await exportCarouselZip(slides, profile, accentColor);
    } finally {
      setIsExporting(null);
    }
  }, [slides, profile, accentColor]);

  const canDelete = (slide: CarouselSlide) => canDeleteSlide(slide, slides);
  const canDuplicate = (slide: CarouselSlide) => slide.type === "content";

  const selectSlide = useCallback(
    (index: number) => {
      const slide = slides[index];
      if (!slide) return;
      setActiveIndex(index);
      setExpandedSlideId(slide.id);
    },
    [slides],
  );

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-0 lg:grid-cols-2 lg:gap-px lg:bg-[color:var(--border)]">
      <aside className="flex min-h-0 flex-col bg-[color:var(--bg-card)] lg:max-h-[calc(100vh-8rem)]">
        <div className="shrink-0 border-b border-[color:var(--border)] px-5 py-4 lg:px-6">
          <p className="editorial-label text-[color:var(--accent-vermillion)]">Micro tool</p>
          <h1 className="mt-1 font-display text-xl font-bold tracking-tight text-[color:var(--text-main)]">
            Carousel builder
          </h1>
          <p className="mt-1 text-xs text-[color:var(--text-muted)]">
            Edit on the left. Preview every slide on the right.
          </p>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
              How it works
            </p>
            <div className="mt-2 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)]">
              <video
                src={CAROUSEL_DEMO_VIDEO_PATH}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full bg-black object-contain"
              >
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>

        <div
          className="shrink-0 border-b border-[color:var(--border)] px-2 py-2"
          role="tablist"
          aria-label="Carousel editor"
        >
          <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LEFT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={leftTab === tab.id}
                onClick={() => setLeftTab(tab.id)}
                className={
                  leftTab === tab.id
                    ? "shrink-0 rounded-lg bg-[color:var(--accent-vermillion)] px-4 py-2.5 text-sm font-semibold text-[color:var(--bg-card)]"
                    : "shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-section)] hover:text-[color:var(--text-main)]"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {leftTab === "branding" ? (
            <div role="tabpanel" className="space-y-5 px-5 py-5 lg:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                  Accent color
                </p>
                <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                  Updates highlights, footer ring, and background glow.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ACCENT_PRESETS.map((preset) => {
                    const selected = accentColor === preset.color;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        title={preset.label}
                        aria-label={preset.label}
                        aria-pressed={selected}
                        onClick={() => setAccentColor(preset.color)}
                        className={
                          selected
                            ? "h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-[color:var(--bg-card)] transition"
                            : "h-10 w-10 rounded-full ring-1 ring-[color:var(--border)] transition hover:scale-105"
                        }
                        style={{
                          backgroundColor: preset.color,
                          ...(selected ? { ringColor: preset.color } : {}),
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                  Your profile
                </p>

                <label className="mt-3 flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 transition hover:border-[color:var(--accent-vermillion)]/40">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-[color:var(--bg-card)]"
                    style={{ borderColor: accentColor }}
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-[color:var(--text-soft)]" />
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-[color:var(--text-main)]">
                      Upload photo
                    </span>
                    <span className="block text-xs text-[color:var(--text-muted)]">
                      Shown in every slide footer
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>

                <div className="mt-3 grid gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[color:var(--text-main)]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Leonard Selvaraja"
                      className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-2.5 text-sm text-[color:var(--text-main)] outline-none focus:border-[color:var(--accent-vermillion)]/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-[color:var(--text-main)]">
                      Account ID
                    </label>
                    <input
                      type="text"
                      value={profile.linkedInId}
                      onChange={(e) => setProfile((p) => ({ ...p, linkedInId: e.target.value }))}
                      placeholder="leonard-selvaraja"
                      className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-2.5 text-sm text-[color:var(--text-main)] outline-none focus:border-[color:var(--accent-vermillion)]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : leftTab === "content" ? (
            <div role="tabpanel" className="space-y-3 px-5 py-5 lg:px-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                  Slides
                </p>
                <div className="flex flex-wrap justify-end gap-2">
                  {missingSessionInstructors.map((instructor) => (
                    <button
                      key={instructor}
                      type="button"
                      onClick={() => handleAddSessionSlide(instructor)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--text-main)]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {instructor.charAt(0).toUpperCase() + instructor.slice(1)}
                    </button>
                  ))}
                  {!hasCertificateSlide ? (
                    <button
                      type="button"
                      onClick={handleAddCertificateSlide}
                      className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--text-main)]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Certificate
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--text-main)]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add slide
                  </button>
                </div>
              </div>

              <UseAiButton onClick={() => setAiModalOpen(true)} />

              <CarouselAiModal
                open={aiModalOpen}
                onOpenChange={setAiModalOpen}
                slides={slides}
                profile={profile}
                onApply={handleAiApply}
              />

              {reorderableSlideCount > 1 ? (
                <p className="text-xs text-[color:var(--text-muted)]">
                  Drag middle slides to reorder. Intro and outro stay fixed.
                </p>
              ) : null}

              <div className="space-y-2">
                {slides.map((slide, index) => {
                  const expanded = expandedSlideId === slide.id;
                  const isHidden = Boolean(slide.hidden);
                  const reorderable = isReorderableSlide(slide);
                  const isDragging = dragSlideId === slide.id;
                  const isDropTarget = dropSlideId === slide.id && dragSlideId !== slide.id;

                  return (
                    <div
                      key={slide.id}
                      onDragOver={reorderable ? handleDragOver(slide.id) : undefined}
                      onDrop={reorderable ? handleDrop(slide.id) : undefined}
                      className={
                        isHidden
                          ? "overflow-hidden rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-section)]/60"
                          : isDropTarget
                            ? "overflow-hidden rounded-xl border-2 border-[color:var(--accent-vermillion)] bg-[color:var(--bg-section)]"
                            : isDragging
                              ? "overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] opacity-50"
                              : "overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)]"
                      }
                    >
                      <div className="flex items-center gap-1 px-2 py-2">
                        {reorderable ? (
                          <button
                            type="button"
                            draggable
                            onDragStart={handleDragStart(slide.id)}
                            onDragEnd={handleDragEnd}
                            title="Drag to reorder"
                            aria-label="Drag to reorder slide"
                            className="cursor-grab rounded-lg p-2 text-[color:var(--text-soft)] transition hover:bg-[color:var(--bg-card)] hover:text-[color:var(--text-main)] active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="w-8 shrink-0" aria-hidden />
                        )}
                        <button
                          type="button"
                          onClick={() => handleExpandSlide(slide.id, index)}
                          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-[color:var(--bg-card)]"
                        >
                          <ChevronDown
                            className={
                              expanded
                                ? "h-4 w-4 shrink-0 text-[color:var(--text-soft)]"
                                : "h-4 w-4 shrink-0 -rotate-90 text-[color:var(--text-soft)]"
                            }
                            aria-hidden
                          />
                          <span className="text-sm font-semibold text-[color:var(--text-main)]">
                            Slide {index + 1}
                          </span>
                          <span className="truncate text-xs text-[color:var(--text-muted)]">
                            {slideTypeLabel(slide)}
                            {isHidden ? " · Hidden" : ""}
                          </span>
                        </button>

                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            title={isHidden ? "Show slide" : "Hide slide"}
                            aria-label={isHidden ? "Show slide" : "Hide slide"}
                            onClick={() => handleToggleHide(slide.id)}
                            className="rounded-lg p-2 text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-card)] hover:text-[color:var(--text-main)]"
                          >
                            {isHidden ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            title="Duplicate slide"
                            aria-label="Duplicate slide"
                            disabled={!canDuplicate(slide)}
                            onClick={() => handleDuplicateSlide(slide.id)}
                            className="rounded-lg p-2 text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-card)] hover:text-[color:var(--text-main)] disabled:opacity-30"
                          >
                            <CopyPlus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Delete slide"
                            aria-label="Delete slide"
                            disabled={!canDelete(slide)}
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="rounded-lg p-2 text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-card)] hover:text-[color:var(--text-main)] disabled:opacity-30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {expanded ? (
                        <div className="border-t border-[color:var(--border)] px-4 py-3">
                          {slide.type === "content" ? (
                            <div className="space-y-3">
                              <label className="block">
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                                  Slide title
                                </span>
                                <input
                                  type="text"
                                  value={slide.title ?? ""}
                                  onChange={(e) => handleTitleChange(slide.id, e.target.value)}
                                  placeholder="Optional headline for this slide"
                                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-card)] px-4 py-2.5 text-sm text-[color:var(--text-main)] outline-none focus:border-[color:var(--accent-vermillion)]/50"
                                />
                              </label>
                              <textarea
                                value={slide.text}
                                onChange={(e) => handleTextChange(slide.id, e.target.value)}
                                rows={6}
                                placeholder="Write this slide's message…"
                                className="min-h-[140px] w-full resize-y rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-card)] px-4 py-3 text-sm leading-relaxed text-[color:var(--text-main)] outline-none focus:border-[color:var(--accent-vermillion)]/50"
                              />
                            </div>
                          ) : slide.type === "certificate" ? (
                            <div className="space-y-3">
                              <p className="text-sm text-[color:var(--text-muted)]">
                                Upload a photo for the polaroid and enter your certificate ID. You
                                can hide or delete this slide if you do not need it.
                              </p>
                              <label className="block">
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                                  Certificate ID
                                </span>
                                <div className="flex overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-card)] focus-within:border-[color:var(--accent-vermillion)]/50">
                                  <span className="flex shrink-0 items-center border-r border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-2.5 font-mono text-xs text-[color:var(--text-muted)] sm:text-sm">
                                    {CERTIFICATE_ID_PREFIX}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={profile.certificateNumber}
                                    onChange={(e) => handleCertificateNumberChange(e.target.value)}
                                    placeholder="001"
                                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-sm text-[color:var(--text-main)] outline-none"
                                  />
                                </div>
                              </label>
                              <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-card)] px-4 py-3 transition hover:border-[color:var(--accent-vermillion)]/40">
                                <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[color:var(--border)] bg-white shadow-sm">
                                  {polaroidUrl ? (
                                    <img
                                      src={polaroidUrl}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImagePlus className="h-5 w-5 text-[color:var(--text-soft)]" />
                                  )}
                                </div>
                                <div>
                                  <span className="block text-sm font-semibold text-[color:var(--text-main)]">
                                    Upload polaroid photo
                                  </span>
                                  <span className="block text-xs text-[color:var(--text-muted)]">
                                    Certificate, badge, or any image you want to showcase
                                  </span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="sr-only"
                                  onChange={handlePolaroidChange}
                                />
                              </label>
                            </div>
                          ) : slide.type === "outro" ? (
                            <p className="text-sm text-[color:var(--text-muted)]">
                              Outro uses your profile photo, name, account ID, and hashtags from the
                              Generate tab.
                            </p>
                          ) : (
                            <p className="text-sm text-[color:var(--text-muted)]">
                              Intro copy is fixed. Your name and photo appear in the footer.
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div role="tabpanel" className="space-y-6 px-5 py-5 lg:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                  Download
                </p>
                <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                  Export your carousel, then post with the tags below.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    disabled={isExporting !== null}
                    className="flex flex-col items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-5 text-center transition hover:border-[#0A66C2]/40 disabled:opacity-50"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A66C2] text-white">
                      <Linkedin className="h-6 w-6" />
                    </span>
                    <span className="block text-sm font-semibold text-[color:var(--text-main)]">
                      {isExporting === "pdf" ? "Exporting…" : "LinkedIn"}
                    </span>
                    <span className="block text-xs text-[color:var(--text-muted)]">
                      PDF carousel
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportZip}
                    disabled={isExporting !== null}
                    className="flex flex-col items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-5 text-center transition hover:border-[#E4405F]/40 disabled:opacity-50"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                      <Instagram className="h-6 w-6" />
                    </span>
                    <span className="block text-sm font-semibold text-[color:var(--text-main)]">
                      {isExporting === "zip" ? "Exporting…" : "Instagram"}
                    </span>
                    <span className="block text-xs text-[color:var(--text-muted)]">PNG zip</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                    Hashtags &amp; tags
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleCopy("share-all", carouselShareCopyText())}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--accent-vermillion)] hover:underline"
                  >
                    {copiedKey === "share-all" ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        Copy all
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                  Paste into your post caption in one go.
                </p>
                <button
                  type="button"
                  onClick={() => void handleCopy("share-all", carouselShareCopyText())}
                  className="mt-3 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-3 text-left text-sm leading-relaxed text-[color:var(--text-main)] transition hover:border-[color:var(--accent-vermillion)]/40"
                >
                  {carouselShareCopyText()}
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CAROUSEL_HASHTAGS.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                  {CAROUSEL_TAG_ACCOUNTS.map((account) => (
                    <span
                      key={account}
                      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-muted)]"
                    >
                      {account}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col bg-[color:var(--bg-section)] px-4 py-5 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:px-6 lg:py-6">
        <SlideGallery
          slides={slides}
          activeIndex={activeIndex}
          profile={profile}
          brandingLogo={brandingLogo}
          accentColor={accentColor}
          onSelect={selectSlide}
        />
      </section>
    </div>
  );
}
