"use client";

import { Car, Clock, Laptop, Lightbulb } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/landing/motion";
import { EVENT_PREPARATION, WORKSHOP_EVENT } from "@/lib/event.constants";

export const PREP_ITEMS = [
  {
    icon: Clock,
    label: "Arrival",
    title: "When to arrive",
    description: `Reach by ${EVENT_PREPARATION.arriveBy}. Workshop runs ${WORKSHOP_EVENT.displayWhen}.`,
  },
  {
    icon: Car,
    label: "Parking",
    title: "Limited parking",
    description: EVENT_PREPARATION.parking,
  },
  {
    icon: Laptop,
    label: "Essentials",
    title: "Laptop & charger",
    description: EVENT_PREPARATION.bring[0],
  },
  {
    icon: Lightbulb,
    label: "Mindset",
    title: "Bring an idea",
    description: EVENT_PREPARATION.bring[1],
  },
] as const;

export function PreparationInstructions() {
  return (
    <section className="section-pad border-t border-[color:var(--border)] bg-[color:var(--bg-section)]">
      <div className="vc-container">
        <Reveal>
          <div className="editorial-label text-[color:var(--accent-vermillion)]">Checklist</div>
          <h2 className="mt-3 font-display text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.02em] max-w-2xl">
            Before you <span className="accent-text">arrive</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[color:var(--text-muted)]">
            Walk in ready to build — parking, gear, and the one idea you&apos;ve been sitting on.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 md:grid-cols-2">
          {PREP_ITEMS.map((item, idx) => (
            <StaggerItem key={item.title} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-card)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--accent-vermillion)]/30 hover:shadow-[0_20px_48px_oklch(0.18_0.008_60/0.1)]">
                <div className="absolute top-0 left-0 h-1 w-0 bg-[color:var(--accent-vermillion)] transition-all duration-500 group-hover:w-full" />
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] accent-text transition-colors group-hover:border-[color:var(--accent-vermillion)] group-hover:bg-[color:var(--accent-vermillion)] group-hover:text-[color:var(--bg-card)]">
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="font-display text-3xl font-extrabold tracking-tighter text-[color:var(--border)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 editorial-label">{item.label}</div>
                <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight text-[color:var(--text-main)]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--text-muted)]">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
