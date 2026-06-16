import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Clock,
  Coffee,
  Check,
  X,
  Sparkles,
  Target,
  Wrench,
  Rocket,
  Calendar,
  ArrowRight,
  Linkedin,
  Mic,
  IndianRupee,
} from "lucide-react";
import hameedPhoto from "@/assets/hameed.jpeg";
import hariPhoto from "@/assets/hari.png";
import leoPhoto from "@/assets/leo.jpeg";
import CardSwap, { Card, type CardSwapHandle } from "@/components/CardSwap";
import { ReservationProvider, ReserveSeatButton } from "@/components/ReservationWizard";
import { useIsMobile } from "@/hooks/use-mobile";

// Decode-reveal removed — render plain text
const D = ({ text }: { text: string; className?: string }) => <>{text}</>;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vibe Coding: The Right Way — AI Product Workshop, Chennai" },
      {
        name: "description",
        content:
          "A 4-hour hands-on workshop in Chennai with Hameed, Leo and Hari. Go from idea to product to customer using modern AI tools and proven startup thinking.",
      },
      { property: "og:title", content: "Vibe Coding: The Right Way" },
      {
        property: "og:description",
        content:
          "Build the right thing. Build it the right way. Take it to the right people. A 4-hour AI product workshop in Chennai.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VibeCodingPage,
});

function VibeCodingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Parallax background blobs
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.3");
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Fade-up reveals (fail-safe: final state guaranteed via fromTo)
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
          },
        );
      });

      // Staggered children
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((container) => {
        const children = container.querySelectorAll<HTMLElement>("[data-stagger-item]");
        gsap.fromTo(
          children,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: container, start: "top 95%", toggleActions: "play none none none" },
          },
        );
      });


      // Hero title layered parallax
      const heroTitle = document.querySelector("[data-hero-title]");
      if (heroTitle) {
        gsap.to(heroTitle.querySelectorAll("[data-hero-line]"), {
          yPercent: (i) => -10 - i * 8,
          ease: "none",
          scrollTrigger: {
            trigger: heroTitle,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Date card tilt parallax
      gsap.to("[data-date-card]", {
        yPercent: -20,
        rotate: -4,
        scrollTrigger: {
          trigger: "[data-date-card]",
          start: "top center",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Marquee
      gsap.to("[data-marquee-inner]", {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });

      // Big quote scale-in
      gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
          },
        );
      });
    }, rootRef);

    // Recalculate triggers after images/fonts settle.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1200);
    window.addEventListener("load", refresh);
    document.querySelectorAll("img").forEach((img) => {
      if (!(img as HTMLImageElement).complete) img.addEventListener("load", refresh, { once: true });
    });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);


  return (
    <ReservationProvider>
      <div ref={rootRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Nav />
        <Hero />
        <WhyMatters />
        <WhatYouLearn />
        <SpeakersCardSwap />
        <Audience />
        <Pricing />
        <EventDetails />
        <Footer />
      </div>
    </ReservationProvider>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
      <div className="vc-container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-bg" />
          <span className="font-bold tracking-tight">AI:BN</span>
        </div>
        <ReserveSeatButton className="btn-secondary !py-2.5 !px-5 !text-sm">
          Reserve Your Seat
        </ReserveSeatButton>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden pt-28 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div
        data-parallax="0.4"
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,139,239,0.35), transparent 70%)" }}
      />
      <div
        data-parallax="0.25"
        className="absolute top-40 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(189,238,255,0.25), transparent 70%)" }}
      />

      <div className="vc-container relative">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <span className="badge-orange mb-6" data-reveal>Offline Event · Chennai</span>
            <h1
              data-hero-title
              className="font-display uppercase tracking-tight font-extrabold leading-[0.88] text-[clamp(56px,9vw,120px)]"
            >
              <span data-hero-line className="block gradient-text"><D text="AI Vibe" /></span>
              <span data-hero-line className="block font-light text-[#EDEDF5]"><D text="Coding" /></span>
              <span data-hero-line className="block text-[0.42em] tracking-tight mt-4 text-white">
                <D text="THE " /><span className="underline-word"><D text="RIGHT" /></span><D text=" WAY" />
              </span>
            </h1>

            <p
              data-reveal
              className="mt-8 text-xl md:text-[22px] text-[color:var(--text-muted)] leading-relaxed max-w-2xl"
            >
              A <strong className="text-white font-extrabold">4-hour, hands-on workshop</strong> by{" "}
              <span className="gradient-text font-extrabold">Hameed</span>,{" "}
              <span className="gradient-text font-extrabold">Leo</span> and{" "}
              <span className="gradient-text font-extrabold">Hari</span>.
            </p>

            <div className="mt-8 flex items-center gap-5" data-reveal>
              <div className="flex">
                <div className="avatar-ring r1 overflow-hidden !p-0">
                  <img src={hameedPhoto} alt="Hameed" className="w-full h-full object-cover" />
                </div>
                <div className="avatar-ring r2 overflow-hidden !p-0">
                  <img src={leoPhoto} alt="Leo" className="w-full h-full object-cover" />
                </div>
                <div className="avatar-ring r3 overflow-hidden !p-0">
                  <img src={hariPhoto} alt="Hari" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[color:var(--text-soft)]">
                <MapPin className="h-5 w-5" />
                <span>Chennai, India</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4" data-reveal>
              <ReserveSeatButton>
                Reserve Your Seat <ArrowRight className="h-4 w-4" />
              </ReserveSeatButton>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end" data-date-card>
            <div className="date-card">
              <div className="text-[96px] leading-none font-black">27</div>
              <div className="text-2xl font-extrabold tracking-[0.08em] uppercase mt-1">June 2026</div>
              <div className="mt-3 text-xs font-bold tracking-[0.2em] uppercase opacity-70">
                Saturday · 4 Hours
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-20 overflow-hidden border-y border-white/10 py-5 bg-black/40">
        <div data-marquee-inner className="flex gap-12 whitespace-nowrap text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12 shrink-0">
              {["Build the right thing", "★", "Build it the right way", "★", "Take it to the right people", "★", "Chennai · 27 June 2026", "★"].map(
                (t, i) => (
                  <span key={i} className={i % 2 === 0 ? "gradient-text" : "text-white/40"}>
                    {t}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyMatters() {
  return (
    <section className="section-pad relative">
      <div className="vc-container">
        <div className="max-w-3xl" data-reveal>
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[color:var(--text-soft)]">
            Why this workshop
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            <D text="Everyone is building apps. " /><span className="gradient-text"><D text="Very few are building products people actually want." /></span>
          </h2>
          <div className="mt-8 space-y-5 text-lg text-[color:var(--text-muted)] leading-relaxed">
            <p>
              <strong className="text-white">Vibe Coding: The Right Way</strong> is a hands-on, 4-hour workshop that teaches you how to go from{" "}
              <span className="gradient-text font-bold">idea → product → customer</span> using modern AI tools and proven startup thinking.
            </p>
            <p>
              You won't watch someone build a to-do app in 15 minutes. You'll learn how to find real problems, validate them, ship with AI, and take your product to market.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatYouLearn() {
  const blocks = [
    { icon: Target, title: "Identify", desc: "Find real problems worth solving — not problems you invent to use a cool tool." },
    { icon: Sparkles, title: "Validate", desc: "Pressure-test customer pain points before you write a single prompt." },
    { icon: Wrench, title: "Build", desc: "Use AI tools to rapidly ship a Minimum Lovable Product — not just an MVP." },
    { icon: Rocket, title: "Launch", desc: "Position, price, and get your first real customers using a practical go-to-market plan." },
  ];
  return (
    <section className="section-pad bg-[color:var(--bg-section)] relative overflow-hidden">
      <div
        data-parallax="0.2"
        className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,139,239,0.12), transparent 70%)" }}
      />
      <div className="vc-container relative">
        <div className="text-center max-w-2xl mx-auto mb-14" data-reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <D text="What you'll " /><span className="gradient-text"><D text="walk away with" /></span>
          </h2>
          <p className="mt-4 text-[color:var(--text-muted)] text-lg">
            Four hours. One end-to-end product playbook.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" data-stagger>
          {blocks.map((b) => (
            <div key={b.title} className="glass-card p-7" data-stagger-item>
              <div className="h-11 w-11 rounded-xl gradient-bg flex items-center justify-center text-[#050505]">
                <b.icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 text-xl font-bold"><D text={b.title} /></h3>
              <p className="mt-2 text-[color:var(--text-soft)] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Speaker = {
  ring: "r1" | "r2" | "r3";
  photo: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  points: string[];
  podcast: string;
  linkedin: string;
};

const SPEAKERS: Speaker[] = [
  {
    ring: "r1",
    photo: hameedPhoto,
    name: "Hameed",
    role: "The Why",
    tagline: "Product Thinking Before Product Building",
    bio: "20+ years as a product builder with Silicon Valley experience. Gartner recognized.",
    points: [
      "How to identify real problems worth solving",
      "How to avoid building products nobody wants",
      "How to validate customer pain points",
    ],
    podcast: "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
    linkedin: "https://www.linkedin.com/in/hameedraha",
  },
  {
    ring: "r2",
    photo: leoPhoto,
    name: "Leo",
    role: "The How",
    tagline: "Building the Minimum Lovable Product",
    bio: "10+ years building world-class, process-driven products. 3x award winner for Innovation in Technology.",
    points: [
      "How to use AI tools to rapidly build products",
      "How to structure a vibe coding workflow",
      "How to ship launch-ready products with process",
    ],
    podcast: "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
    linkedin: "https://www.linkedin.com/in/leonardselvaraja/",
  },
  {
    ring: "r3",
    photo: hariPhoto,
    name: "Hari",
    role: "The Who",
    tagline: "Taking Your Product to Customers",
    bio: "12+ years of digital product marketing expertise.",
    points: [
      "How to identify the right customer segment",
      "How to position your product clearly",
      "How to get your first users or customers",
    ],
    podcast: "https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk",
    linkedin: "https://www.linkedin.com/in/imharikumaran/",
  },
];

function SpeakerSwapCardContent({ s, compact = true }: { s: Speaker; compact?: boolean }) {
  return (
    <div className={`flex h-full flex-col overflow-hidden ${compact ? "p-6" : "p-8"}`}>
      <div className="flex items-center gap-4">
        <div className={`avatar-ring ${s.ring} !ml-0 ${compact ? "!w-14 !h-14" : "!w-20 !h-20"} !p-0 overflow-hidden shrink-0`}>
          <img src={s.photo} alt={s.name} className="h-full w-full object-cover rounded-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`font-bold tracking-[0.2em] uppercase text-[color:var(--text-soft)] ${compact ? "text-[10px]" : "text-xs"}`}>
            {s.role}
          </div>
          <div className={`font-extrabold ${compact ? "truncate text-xl" : "text-3xl"}`}>{s.name}</div>
        </div>
        <a
          href={s.linkedin}
          target="_blank"
          rel="noreferrer"
          className={`flex shrink-0 items-center justify-center rounded-lg border border-white/15 hover:bg-white/10 transition ${compact ? "h-8 w-8" : "h-10 w-10"}`}
          aria-label={`${s.name} on LinkedIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <Linkedin className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </a>
      </div>

      <h3 className={`mt-4 font-bold gradient-text leading-snug ${compact ? "text-base" : "text-2xl"}`}>
        <D text={s.tagline} />
      </h3>
      <p className={`mt-2 leading-relaxed text-[color:var(--text-soft)] ${compact ? "text-xs" : "text-base"}`}>{s.bio}</p>

      <ul className={`space-y-2 ${compact ? "mt-4" : "mt-6 space-y-3"}`}>
        {s.points.map((p) => (
          <li key={p} className={`flex gap-2 text-[color:var(--text-muted)] ${compact ? "text-xs gap-2" : "text-sm gap-3"}`}>
            <Check className={`mt-0.5 shrink-0 text-[#BDEEFF] ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} strokeWidth={2.5} />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <div className={`mt-auto border-t border-white/10 ${compact ? "pt-4" : "pt-6"}`}>
        <div className={`mb-2 flex items-center gap-2 font-bold tracking-[0.2em] uppercase text-[color:var(--text-soft)] ${compact ? "text-[10px]" : "text-xs"}`}>
          <Mic className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} /> Listen to {s.name}
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <iframe
            src={s.podcast}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`${s.name} podcast`}
            className={compact ? "pointer-events-none" : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function SpeakerDetailModal({ speaker, onClose }: { speaker: Speaker | null; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!speaker || !overlayRef.current || !panelRef.current) return;

    closingRef.current = false;
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current!, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current!,
        { opacity: 0, scale: 0.9, y: 56 },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out" },
      );
    });

    return () => ctx.revert();
  }, [speaker]);

  const handleClose = useCallback(() => {
    if (closingRef.current || !speaker) return;

    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    closingRef.current = true;
    gsap
      .timeline({
        onComplete: onClose,
      })
      .to(panelRef.current, { opacity: 0, scale: 0.94, y: 32, duration: 0.38, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.32, ease: "power2.in" }, "-=0.18");
  }, [onClose, speaker]);

  useEffect(() => {
    if (!speaker) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [speaker, handleClose]);

  if (!speaker) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${speaker.name} — instructor details`}
        className={`speaker-modal-frame relative w-full max-w-lg shadow-[0_40px_120px_rgba(200,139,239,0.35)] card--${speaker.ring}`}
      >
        <div className="speaker-modal-inner max-h-[min(88vh,820px)]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <SpeakerSwapCardContent s={speaker} compact={false} />
        </div>
      </div>
    </div>
  );
}

function SpeakersCardSwap() {
  const cardSwapRef = useRef<CardSwapHandle>(null);
  const [modalSpeaker, setModalSpeaker] = useState<Speaker | null>(null);
  const isMobile = useIsMobile();

  const handleCardAction = useCallback((idx: number) => {
    const frontIdx = cardSwapRef.current?.getFrontIndex() ?? 0;
    if (idx === frontIdx) {
      cardSwapRef.current?.pause();
      setModalSpeaker(SPEAKERS[idx]);
      return;
    }
    cardSwapRef.current?.bringToFront(idx);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalSpeaker(null);
    cardSwapRef.current?.resume();
  }, []);

  return (
    <section className="section-pad relative border-t border-white/5">
      <div
        data-parallax="0.25"
        className="absolute bottom-0 -right-32 h-[600px] w-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,139,239,0.12), transparent 70%)" }}
      />
      <div className="vc-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <div className="max-w-xl" data-reveal>
            <span className="badge-orange mb-4">Meet the instructors</span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              <D text="Three builders. " />
              <span className="gradient-text">
                <D text="One complete playbook." />
              </span>
            </h2>
            <p className="mt-4 text-lg text-[color:var(--text-muted)]">
              Three instructors. One playbook — from problem to product to customer.
            </p>
          </div>

          <div
            className={`relative mx-auto w-full overflow-visible lg:mx-0 lg:ml-auto ${
              isMobile ? "h-[480px] max-w-[min(100%,340px)]" : "h-[620px] max-w-[520px]"
            }`}
            data-reveal
          >
            <CardSwap
              ref={cardSwapRef}
              width={isMobile ? 320 : 400}
              height={isMobile ? 440 : 520}
              cardDistance={isMobile ? 0 : 50}
              verticalDistance={isMobile ? 14 : 55}
              delay={5000}
              pauseOnHover
              skewAmount={isMobile ? 0 : 5}
              flat={isMobile}
              containerClassName="card-swap-container--centered"
            >
              {SPEAKERS.map((s, i) => (
                <Card
                  key={s.name}
                  className={`card--${s.ring} cursor-pointer shadow-[0_24px_80px_rgba(0,0,0,0.45)]`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a")) return;
                    handleCardAction(i);
                  }}
                >
                  <div className="card-inner">
                    <SpeakerSwapCardContent s={s} />
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>

      <SpeakerDetailModal speaker={modalSpeaker} onClose={handleModalClose} />
    </section>
  );
}

function Audience() {
  const yes = [
    "Founders", "Entrepreneurs", "Product Managers", "Developers",
    "Students", "Freelancers", "Consultants", "Business Owners",
    "Anyone turning ideas into products with AI",
  ];
  const no = [
    "You want passive theory without hands-on work",
    "You expect AI to magically build a business for you",
    "You don't want to think about customers or markets",
    "You're looking for a generic coding class",
  ];
  return (
    <section className="section-pad">
      <div className="vc-container">
        <div className="grid lg:grid-cols-2 gap-6" data-stagger>
          <div className="glass-card p-8" data-stagger-item>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🤩</span>
              <h3 className="text-2xl font-extrabold"><D text="Who should attend" /></h3>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {yes.map((y) => (
                <li key={y} className="flex items-center gap-2.5 text-[color:var(--text-muted)]">
                  <Check className="h-4 w-4 text-[#BDEEFF]" strokeWidth={3} />
                  <span>{y}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-8" data-stagger-item>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🤦‍♂️</span>
              <h3 className="text-2xl font-extrabold"><D text="Who should NOT attend" /></h3>
            </div>
            <ul className="space-y-3">
              {no.map((n) => (
                <li key={n} className="flex items-start gap-2.5 text-[color:var(--text-muted)]">
                  <X className="h-4 w-4 mt-1 text-[#FF7A1A] flex-shrink-0" strokeWidth={3} />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventDetails() {
  return (
    <section id="details" className="section-pad bg-[color:var(--bg-section)]">
      <div className="vc-container">
        <div className="text-center max-w-2xl mx-auto mb-14" data-reveal>
          <span className="badge-orange mb-4">Event Details</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            <D text="The " /><span className="gradient-text"><D text="essentials" /></span>
          </h2>
          <p className="mt-4 text-[color:var(--text-muted)]">
            Bring your laptop. Venue in Chennai will be shared with registered attendees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" data-stagger>
          {[
            { icon: Calendar, label: "Date", value: "27 June 2026" },
            { icon: Clock, label: "Duration", value: "4-Hour Intensive" },
            { icon: MapPin, label: "Location", value: "Chennai, India" },
            { icon: Coffee, label: "Included", value: "Light Snacks & Refreshments" },
          ].map((d) => (
            <div key={d.label} className="glass-card p-6" data-stagger-item>
              <d.icon className="h-6 w-6 text-[#BDEEFF]" strokeWidth={2} />
              <div className="mt-4 text-xs font-bold tracking-[0.2em] uppercase text-[color:var(--text-soft)]">
                {d.label}
              </div>
              <div className="mt-1 text-lg font-bold text-white">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="vc-container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[color:var(--text-soft)]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded gradient-bg" />
          <span className="font-bold text-white">Vibe Coding: The Right Way</span>
        </div>
        <div>© 2026 AI:BN · Chennai, India</div>
      </div>
    </footer>
  );
}

function Pricing() {
  const includes = [
    "4-hour intensive workshop with all 3 instructors",
    "Lovable Pro Subscription — 1 Month",
    "Prompt Library + Product Building Cheat Sheet",
    "Physical Certificate (online verifiable)",
    "Access to AI:BN builder community",
    "Light snacks & refreshments",
    "Bring your laptop — that's all you need",
  ];
  return (
    <section className="section-pad relative">
      <div
        data-parallax="0.3"
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,139,239,0.18), transparent 60%)" }}
      />
      <div className="vc-container relative">
        <div className="text-center max-w-2xl mx-auto mb-12" data-reveal>
          <span className="badge-orange mb-4">One ticket. Everything in.</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
            <D text="Worth it for " /><span className="gradient-text"><D text="one prompt" /></span><D text="." />
          </h2>
          <p className="mt-4 text-[color:var(--text-muted)] text-lg">
            We kept it simple. One price, one room, everything included.
          </p>
        </div>

        <div data-scale-in className="relative max-w-3xl mx-auto">
          <div className="absolute -inset-8 rounded-[44px] gradient-bg opacity-30 blur-3xl" />
          <div className="relative glass-card p-10 md:p-14 text-center rounded-[22px]">
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-[color:var(--text-soft)]">
              General Admission
            </div>
            <div className="mt-6 flex items-end justify-center gap-2">
              <IndianRupee className="h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-3" strokeWidth={2.5} />
              <span className="text-7xl md:text-9xl font-black tracking-tighter leading-none gradient-text">
                2,999
              </span>
            </div>
            <div className="mt-3 text-[color:var(--text-soft)] text-sm font-bold tracking-[0.2em] uppercase">
              Per Seat · All inclusive · GST extra
            </div>

            <ul className="mt-10 grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto" data-stagger>
              {includes.map((i) => (
                <li
                  key={i}
                  data-stagger-item
                  className="flex items-start gap-2.5 text-[color:var(--text-muted)] text-sm"
                >
                  <div className="mt-0.5 h-5 w-5 rounded-md gradient-bg flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-[#050505]" strokeWidth={4} />
                  </div>
                  <span>{i}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3">
              <ReserveSeatButton>
                Reserve Your Seat <ArrowRight className="h-4 w-4" />
              </ReserveSeatButton>
              <span className="text-xs text-[color:var(--text-soft)]">
                First come, first served · Limited seats
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
