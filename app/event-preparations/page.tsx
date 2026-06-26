import type { Metadata } from "next";

import { EventPreparationsPage } from "@/components/event-preparations/EventPreparationsPage";

export const metadata: Metadata = {
  title: "Event preparations — Vibe Coding",
  description: "Your personalized checklist, calendar file, and share image for the workshop.",
  robots: {
    index: false,
    follow: false,
  },
};

const DEFAULT_NAME = "Leonard Selvaraja";
const DEFAULT_ORGANISATION = "icrewsystems software engineering";

type PageProps = {
  searchParams: Promise<{ name?: string; organisation?: string; org?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = params.name?.trim() || DEFAULT_NAME;
  const organisation = params.organisation?.trim() || params.org?.trim() || DEFAULT_ORGANISATION;

  return <EventPreparationsPage attendeeName={name} organisation={organisation} />;
}
