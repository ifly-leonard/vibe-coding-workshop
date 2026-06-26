"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { PrepHeroCard } from "@/components/event-preparations/PrepHeroCard";
import { WORKSHOP_EVENT } from "@/lib/event.constants";

const Lanyard = dynamic(() => import("@/components/Lanyard/Lanyard"), { ssr: false });

const LANYARD_PROPS = {
  frontImage: "/event-preparations/lanyard-card-front.png",
  imageFit: "cover" as const,
  gravity: [0, -40, 0] as [number, number, number],
};

type LanyardView = {
  position: [number, number, number];
  fov: number;
  lanyardWidth?: number;
};

const MOBILE_LANYARD_VIEW: LanyardView = { position: [0, 0.5, 18], fov: 14, lanyardWidth: 1 };
const DESKTOP_LANYARD_VIEW: LanyardView = { position: [-2.5, 0, 26], fov: 14 };

function useLanyardLayout() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return {
    isDesktop,
    lanyardView: isDesktop ? DESKTOP_LANYARD_VIEW : MOBILE_LANYARD_VIEW,
  };
}

type EventPreparationsPageProps = {
  attendeeName: string;
  organisation: string;
};

export function EventPreparationsPage({ attendeeName, organisation }: EventPreparationsPageProps) {
  const firstName = attendeeName.trim().split(/\s+/)[0] ?? attendeeName;
  const { isDesktop, lanyardView } = useLanyardLayout();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="paper-grain" aria-hidden />

      {isDesktop ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[8]">
          <div className="vc-container relative min-h-[36rem] lg:min-h-[40rem]">
            <div className="pointer-events-auto absolute inset-y-0 left-[38%] right-0">
              <div className="lanyard-hero h-full w-full">
                <Lanyard {...LANYARD_PROPS} {...lanyardView} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <main className="relative z-[20] md:pointer-events-none">
        <section className="relative overflow-hidden pb-10 pt-8 md:min-h-[38rem] md:pb-14 md:pt-12 lg:min-h-[42rem]">
          <div className="vc-container">
            <div className="relative max-w-xl min-w-0 md:pointer-events-auto">
              <h1 className="font-display text-[clamp(1.625rem,4.5vw,2.375rem)] font-bold leading-tight tracking-tight text-[color:var(--text-main)]">
                Hey {firstName}, you&apos;re all set.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-muted)] sm:text-base">
                {organisation} · {WORKSHOP_EVENT.displayWhen}
              </p>

              <div className="mt-6">
                <PrepHeroCard attendeeName={attendeeName} organisation={organisation} />
              </div>
            </div>

            {!isDesktop ? (
              <div className="mt-8">
                <div className="lanyard-below overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-section)]">
                  <Lanyard {...LANYARD_PROPS} {...MOBILE_LANYARD_VIEW} />
                </div>
                <p className="mt-2 text-center text-xs text-[color:var(--text-soft)]">
                  Drag the badge to interact
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
