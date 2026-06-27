"use client";

import { useEffect, useState } from "react";
import { BatteryCharging, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import { RECAP_RECHARGE_STEPS } from "@/lib/thank-you-for-coming/constants";

const LAST_STEP_INDEX = RECAP_RECHARGE_STEPS.length - 1;
const AUTO_ADVANCE_MS = 3200;

export function WorkshopTimeWizard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeStep = RECAP_RECHARGE_STEPS[activeIndex] ?? RECAP_RECHARGE_STEPS[LAST_STEP_INDEX]!;

  useEffect(() => {
    if (paused || activeIndex >= LAST_STEP_INDEX) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((index) => Math.min(index + 1, LAST_STEP_INDEX));
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, paused]);

  const goTo = (index: number) => {
    setPaused(true);
    setActiveIndex(index);
  };

  const goPrev = () => goTo(Math.max(0, activeIndex - 1));
  const goNext = () => goTo(Math.min(LAST_STEP_INDEX, activeIndex + 1));

  return (
    <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--accent-vermillion)]">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Recap &amp; recharge
          </p>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Reflect on the workshop, then channel that energy into your carousel.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text-main)] transition hover:border-[color:var(--accent-vermillion)]/40 disabled:opacity-30"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === LAST_STEP_INDEX}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text-main)] transition hover:border-[color:var(--accent-vermillion)]/40 disabled:opacity-30"
            aria-label="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative mt-5">
        <div
          className="absolute left-4 right-4 top-[1.125rem] h-0.5 rounded-full bg-[color:var(--border)]"
          aria-hidden
        />
        <div
          className="absolute left-4 top-[1.125rem] h-0.5 rounded-full bg-gradient-to-r from-[color:var(--text-soft)] via-[color:var(--accent-vermillion)] to-[color:var(--accent-vermillion)] transition-[width] duration-500 ease-out"
          style={{
            width:
              activeIndex === 0 ? "0%" : `calc(${(activeIndex / LAST_STEP_INDEX) * 100}% - 2rem)`,
          }}
          aria-hidden
        />

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RECAP_RECHARGE_STEPS.map((step, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isRecharge = step.kind === "recharge";

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goTo(index)}
                className="group flex min-w-[6rem] shrink-0 flex-col items-center gap-2 sm:min-w-[7rem]"
              >
                <span
                  className={`relative z-[1] flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                    isActive
                      ? isRecharge
                        ? "border-[color:var(--accent-vermillion)] bg-[color:var(--accent-vermillion)] text-[color:var(--bg-card)] shadow-[0_0_0_4px_oklch(0.62_0.19_35/0.15)]"
                        : "border-[color:var(--text-main)] bg-[color:var(--text-main)] text-[color:var(--bg-card)] shadow-[0_0_0_4px_oklch(0.18_0.008_60/0.12)]"
                      : isPast
                        ? isRecharge
                          ? "border-[color:var(--accent-vermillion)] bg-[color:var(--bg-card)] text-[color:var(--accent-vermillion)]"
                          : "border-[color:var(--text-main)]/50 bg-[color:var(--bg-card)] text-[color:var(--text-main)]"
                        : "border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text-soft)] group-hover:border-[color:var(--accent-vermillion)]/40"
                  }`}
                >
                  {isRecharge ? (
                    <BatteryCharging className="h-4 w-4" aria-hidden />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  )}
                </span>
                <span className="text-center">
                  <span
                    className={`block text-[10px] font-semibold uppercase tracking-wide ${
                      isActive
                        ? isRecharge
                          ? "text-[color:var(--accent-vermillion)]"
                          : "text-[color:var(--text-main)]"
                        : "text-[color:var(--text-soft)]"
                    }`}
                  >
                    {step.kind}
                  </span>
                  <span
                    className={`mt-0.5 block text-xs font-semibold leading-tight ${
                      isActive ? "text-[color:var(--text-main)]" : "text-[color:var(--text-muted)]"
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl border px-4 py-3 ${
          activeStep.kind === "recharge"
            ? "border-[color:var(--accent-vermillion)]/25 bg-[color:var(--accent-vermillion)]/[0.04]"
            : "border-[color:var(--border)] bg-[color:var(--bg-card)]"
        }`}
      >
        <p className="text-sm font-semibold text-[color:var(--text-main)]">{activeStep.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-muted)]">
          {activeStep.detail}
        </p>
        <p className="mt-3 border-t border-[color:var(--border)] pt-3 text-sm italic text-[color:var(--text-main)]">
          {activeStep.prompt}
        </p>
      </div>
    </div>
  );
}
