"use client";

import { useState } from "react";
import { Navigation } from "lucide-react";

import { AddToCalendarButton } from "@/components/event-preparations/AddToCalendarButton";
import { SocialImageGenerator } from "@/components/event-preparations/SocialImageGenerator";
import { EVENT_PREPARATION, WORKSHOP_EVENT } from "@/lib/event.constants";

type TabId = "prepare" | "logistics" | "swag";

const TABS: { id: TabId; label: string }[] = [
  { id: "prepare", label: "Prepare" },
  { id: "logistics", label: "When & where" },
  { id: "swag", label: "Generate Swag" },
];

type PrepHeroCardProps = {
  attendeeName: string;
  organisation: string;
};

export function PrepHeroCard({ attendeeName, organisation }: PrepHeroCardProps) {
  const [active, setActive] = useState<TabId>("prepare");

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-card)]">
      <div
        className="flex gap-1 overflow-x-auto border-b border-[color:var(--border)] p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Event preparation"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={
              active === tab.id
                ? "shrink-0 rounded-lg bg-[color:var(--accent-vermillion)] px-4 py-2.5 text-sm font-semibold text-[color:var(--bg-card)]"
                : "shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-section)] hover:text-[color:var(--text-main)]"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        {active === "prepare" ? (
          <div
            role="tabpanel"
            className="space-y-4 text-sm leading-relaxed text-[color:var(--text-muted)] md:text-base"
          >
            <p>
              Arrive by{" "}
              <span className="font-semibold text-[color:var(--text-main)]">
                {EVENT_PREPARATION.arriveBy}
              </span>
              . The workshop runs {WORKSHOP_EVENT.displayWhen}.
            </p>
            <p>Parking is {EVENT_PREPARATION.parking.toLowerCase()}.</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>{EVENT_PREPARATION.bring[0]}</li>
              <li>{EVENT_PREPARATION.bring[1]}</li>
            </ul>
          </div>
        ) : null}

        {active === "logistics" ? (
          <div
            role="tabpanel"
            className="space-y-5 text-sm leading-relaxed text-[color:var(--text-muted)] md:text-base"
          >
            <div>
              <p className="font-semibold text-[color:var(--text-main)]">When</p>
              <p className="mt-1">{WORKSHOP_EVENT.displayWhen}</p>
            </div>
            <div>
              <p className="font-semibold text-[color:var(--text-main)]">Where</p>
              <p className="mt-1">{WORKSHOP_EVENT.displayWhere}</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <AddToCalendarButton attendeeName={attendeeName} organisation={organisation} />
              <a
                href={EVENT_PREPARATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 !px-5 !py-3 !text-sm"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </a>
            </div>
          </div>
        ) : null}

        {active === "swag" ? (
          <div role="tabpanel">
            <p className="mb-5 text-sm leading-relaxed text-[color:var(--text-muted)] md:text-base">
              Upload a photo and download a poster for LinkedIn or Instagram. Your photo stays on
              your device.
            </p>
            <SocialImageGenerator
              attendeeName={attendeeName}
              organisation={organisation}
              embedded
            />
            <p className="mt-5 text-sm text-[color:var(--text-muted)]">
              Need a multi-slide carousel?{" "}
              <a
                href="/thank-you-for-coming"
                className="font-semibold text-[color:var(--accent-vermillion)] underline-offset-2 hover:underline"
              >
                Open the carousel generator
              </a>
              .
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
