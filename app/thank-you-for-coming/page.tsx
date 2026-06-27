import type { Metadata } from "next";

import { ThankYouForComingContent } from "@/components/post-event/ThankYouForComingContent";
import { parseThankYouSearchParams } from "@/lib/thank-you-for-coming/constants";

export const metadata: Metadata = {
  title: "Thank you for coming — Vibe Coding",
  description: "Workshop photos, feedback, and your carousel recap from AI Vibe Coding.",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    name?: string;
    linkedin?: string;
    linkedIn?: string;
    li?: string;
  }>;
};

export default async function ThankYouForComingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { name, linkedInId } = parseThankYouSearchParams(params);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="paper-grain" aria-hidden />
      <main className="vc-container py-8 md:py-12">
        <ThankYouForComingContent name={name} linkedInId={linkedInId} />
      </main>
    </div>
  );
}
