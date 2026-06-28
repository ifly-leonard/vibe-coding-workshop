import {
  Award,
  BookOpen,
  ExternalLink,
  KeyRound,
  MessageSquareHeart,
  MessageSquareShare,
  Users,
} from "lucide-react";

import { CarouselGenerator } from "@/components/post-event/CarouselGenerator";
import { ThankYouFaq } from "@/components/post-event/ThankYouFaq";
import { ThankYouFooter } from "@/components/post-event/ThankYouFooter";
// import { WorkshopTimeWizard } from "@/components/post-event/WorkshopTimeWizard";
import {
  FAVORITE_MOMENTS,
  INSTRUCTOR_MESSAGE,
  THANK_YOU_IMPORTANT_LINKS,
  type ThankYouLink,
} from "@/lib/thank-you-for-coming/constants";

const POLAROID_TILTS = [-5, 3.5, -2.5, 4, -3, 2, -4, 2.5, -1.5, 3, -2, 4.5];

const LINK_ICONS: Record<string, typeof ExternalLink> = {
  "Share feedback": MessageSquareHeart,
  "Certificate verification": Award,
  "Workshop prompts": KeyRound,
  "Join the community": Users,
  "Leo's ChatGPT session": MessageSquareShare,
  "Design repository": BookOpen,
};

function ImportantLinkCard({ link }: { link: ThankYouLink }) {
  const Icon = LINK_ICONS[link.label] ?? ExternalLink;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-[min(100%,16rem)] shrink-0 items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3.5 transition hover:border-[color:var(--accent-vermillion)]/40 hover:bg-[color:var(--bg-card)] sm:w-56"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          link.iconSrc
            ? "bg-white ring-1 ring-[color:var(--border)]"
            : "bg-[color:var(--accent-vermillion)]/10 text-[color:var(--accent-vermillion)]"
        }`}
      >
        {link.iconSrc ? (
          <img
            src={link.iconSrc}
            alt={link.iconAlt ?? ""}
            className="h-6 w-6 object-contain"
            loading="lazy"
          />
        ) : (
          <Icon className="h-5 w-5" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[color:var(--text-main)]">
          {link.label}
        </span>
        <span className="block truncate text-xs text-[color:var(--text-muted)]">
          {link.description}
        </span>
      </span>
      <ExternalLink
        className="h-4 w-4 shrink-0 text-[color:var(--text-soft)] transition group-hover:text-[color:var(--accent-vermillion)]"
        aria-hidden
      />
    </a>
  );
}

function ImportantLinksStrip() {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight text-[color:var(--text-main)] md:text-2xl">
        Important links
      </h2>
      <p className="mt-2 max-w-xl text-sm text-[color:var(--text-muted)]">
        Photos, feedback, certificate verification, prompts, and everything else from the day.
      </p>
      <div className="mt-5 -mx-1 flex gap-3 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {THANK_YOU_IMPORTANT_LINKS.map((link) => (
          <ImportantLinkCard key={link.label} link={link} />
        ))}
      </div>
    </section>
  );
}

type ThankYouForComingContentProps = {
  name: string;
  linkedInId: string;
};

function PolaroidPhoto({ src, alt, tilt }: { src: string; alt: string; tilt: number }) {
  return (
    <figure
      className="shrink-0 transition-transform duration-300 hover:scale-[1.03] hover:rotate-0"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="bg-white p-2.5 pb-9 shadow-[0_12px_32px_oklch(0.18_0.008_60/0.14)] ring-1 ring-[color:var(--border)]">
        <div className="aspect-[4/5] w-36 overflow-hidden bg-[color:var(--bg-section)] sm:w-40">
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </figure>
  );
}

export function ThankYouForComingContent({ name, linkedInId }: ThankYouForComingContentProps) {
  return (
    <div className="space-y-14 md:space-y-16">
      <header className="max-w-3xl">
        <p className="editorial-label text-[color:var(--accent-vermillion)]">After the workshop</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[color:var(--text-main)]">
          Thank you so much, {name}
        </h1>
      </header>

      <section className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
          A note from Hameed, Leo &amp; Hari
        </p>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-[color:var(--text-muted)] md:text-lg">
          {INSTRUCTOR_MESSAGE.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p
          className="font-handwriting mt-8 text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-none text-[color:var(--accent-vermillion)]"
          aria-label="Thank you, with love"
        >
          Thank you <span aria-hidden>❤️</span>
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold tracking-tight text-[color:var(--text-main)] md:text-2xl">
          Our favorite moments
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[color:var(--text-muted)]">
          A few snapshots from the room — the energy, the builds, and the laughs in between.
        </p>
        <div className="mt-6 -mx-1 flex gap-5 overflow-x-auto px-1 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FAVORITE_MOMENTS.map((moment, index) => (
            <PolaroidPhoto
              key={moment.src}
              src={moment.src}
              alt={moment.alt}
              tilt={POLAROID_TILTS[index % POLAROID_TILTS.length] ?? 0}
            />
          ))}
        </div>
      </section>

      <ImportantLinksStrip />

      <section className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-[0_16px_48px_oklch(0.18_0.008_60/0.08)]">
        {/* <WorkshopTimeWizard /> */}
        <CarouselGenerator initialName={name} initialLinkedInId={linkedInId} />
      </section>

      <ThankYouFaq />

      <ThankYouFooter />
    </div>
  );
}
