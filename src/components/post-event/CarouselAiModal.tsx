"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  applyCarouselAiResponse,
  buildCarouselAiPrompt,
  buildChatGptPromptUrl,
  formatCarouselAiApplyStatus,
  getTemplateSlideDescriptors,
  parseCarouselAiResponse,
} from "@/lib/carousel/ai-prompt";
import type { CarouselProfile, CarouselSlide } from "@/lib/carousel/types";

type CarouselAiModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: CarouselSlide[];
  profile: CarouselProfile;
  onApply: (slides: CarouselSlide[], profile: CarouselProfile) => void;
};

export function CarouselAiModal({
  open,
  onOpenChange,
  slides,
  profile,
  onApply,
}: CarouselAiModalProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const templates = useMemo(() => getTemplateSlideDescriptors(slides), [slides]);
  const prompt = useMemo(() => buildCarouselAiPrompt(slides, profile), [slides, profile]);
  const chatGptUrl = useMemo(() => buildChatGptPromptUrl(prompt), [prompt]);

  const handleOpenChatGpt = () => {
    window.open(chatGptUrl, "_blank", "noopener,noreferrer");
  };

  const applyJson = (value: string) => {
    const result = parseCarouselAiResponse(value);
    if (!result.ok) {
      setError(result.error);
      setStatus(null);
      return;
    }

    const applied = applyCarouselAiResponse(slides, profile, result.data);
    onApply(applied.slides, applied.profile);
    setError(null);
    setStatus(formatCarouselAiApplyStatus(applied.stats));
  };

  const handleApplyJson = () => applyJson(jsonInput);

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    setStatus(null);
    if (!value.trim()) {
      setError(null);
      return;
    }

    const result = parseCarouselAiResponse(value);
    if (result.ok) {
      const applied = applyCarouselAiResponse(slides, profile, result.data);
      onApply(applied.slides, applied.profile);
      setError(null);
      setStatus(formatCarouselAiApplyStatus(applied.stats));
    } else {
      setError(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[color:var(--border)] bg-[color:var(--bg-card)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-[color:var(--text-main)]">
            Generate slide copy with AI
          </DialogTitle>
          <DialogDescription className="text-[color:var(--text-muted)]">
            ChatGPT will invite you to ramble (voice works great) about what you learned, then turn
            that into slide copy — including extra slides beyond the session templates. Paste the
            JSON back here to auto-fill.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ul className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-2.5 text-xs text-[color:var(--text-muted)]">
            <li className="py-0.5 font-medium text-[color:var(--text-main)]">
              Fixed: intro, outro
              {slides.some((s) => s.type === "certificate") ? ", certificate" : ""}
            </li>
            {templates.map((item) => (
              <li key={item.key} className="py-0.5">
                Template:{" "}
                <span className="font-medium text-[color:var(--text-main)]">{item.label}</span>
              </li>
            ))}
            <li className="py-0.5 italic">+ AI may add extra slides from your ramble</li>
          </ul>

          <button
            type="button"
            onClick={handleOpenChatGpt}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--accent-vermillion)] px-4 py-3 text-sm font-semibold text-[color:var(--bg-card)] transition hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Open prompt in ChatGPT
          </button>

          <div>
            <label
              htmlFor="carousel-ai-json"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Paste JSON response
            </label>
            <textarea
              id="carousel-ai-json"
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              rows={12}
              placeholder={`{\n  "slides": [\n    { "key": "session-hameed", "text": "..." }\n  ],\n  "newSlides": [\n    { "key": "extra-funny-moment", "title": "...", "text": "..." }\n  ]\n}`}
              className="min-h-[200px] w-full resize-y rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-2.5 font-mono text-xs leading-relaxed text-[color:var(--text-main)] outline-none focus:border-[color:var(--accent-vermillion)]/50"
            />
            {error ? (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            ) : status ? (
              <p className="mt-2 text-xs font-medium text-[color:var(--accent-vermillion)]">
                {status}
              </p>
            ) : (
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">
                Slides auto-fill when the JSON is valid. New slides are inserted before certificate
                and outro.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyJson}
            disabled={!jsonInput.trim()}
            className="inline-flex w-full items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-2.5 text-sm font-semibold text-[color:var(--text-main)] transition hover:border-[color:var(--accent-vermillion)]/40 disabled:opacity-40"
          >
            Apply JSON to slides
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
