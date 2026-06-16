"use client";

import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function WhatToBring() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--bg-section)] border-t border-white/5">
      <div
        data-parallax="0.12"
        className="pointer-events-none absolute left-1/2 top-[30%] h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,139,239,0.18), transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(189,238,255,0.12), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-[380px] w-[380px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,139,239,0.1), transparent 70%)",
        }}
      />

      <div className="vc-container relative pt-14 pb-4 md:pt-20 md:pb-6">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--text-soft)]">
            Packing list
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
            What should I bring to this workshop?
          </h2>
        </div>
      </div>

      <MacbookScroll
        compact
        screen={
          <div className="flex h-full w-full flex-col items-center justify-center border border-white/20 bg-gradient-to-br from-[#0f2d3a] via-[#2a1545] to-[#151c38] px-10 text-center">
            <p className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
              Just bring your laptop.
            </p>
            <p className="mt-4 max-w-sm text-base font-medium leading-relaxed text-white/80 md:text-lg">
              Everything else will be provided at the workshop.
            </p>
          </div>
        }
        showGradient={false}
      />
    </section>
  );
}
