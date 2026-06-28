import aibnLogo from "@/assets/aibn-logo.svg";

export function ThankYouFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] pt-14 pb-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={aibnLogo.src}
        alt="AI Builders Network"
        className="mx-auto h-10 w-auto opacity-90 sm:h-12"
      />
      <p className="mx-auto mt-8 max-w-3xl font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-[color:var(--text-main)]">
        The AI Builders Network will be back soon with their next event
      </p>
    </footer>
  );
}
