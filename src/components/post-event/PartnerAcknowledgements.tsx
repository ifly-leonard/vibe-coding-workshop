import { SPONSORS } from "@/components/landing/data";
import { SponsorTileContent } from "@/components/landing/SponsorTileContent";

export function PartnerAcknowledgements() {
  return (
    <section className="border-t border-[color:var(--border)] pt-12 pb-4">
      <div className="max-w-2xl">
        <h2 className="font-display text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] leading-[1.08] text-[color:var(--text-main)]">
          Partner acknowledgements
        </h2>
        <p className="mt-3 text-base text-[color:var(--text-muted)]">
          The ecosystem behind this workshop: tools, communities, and builders who ship.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SPONSORS.map((sponsor) => {
          const content = <SponsorTileContent sponsor={sponsor} />;
          const tileClass = "sponsor-tile group";

          if (sponsor.href) {
            return (
              <a
                key={sponsor.name}
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className={tileClass}
                title={sponsor.name}
              >
                {content}
              </a>
            );
          }

          return (
            <div key={sponsor.name} className={tileClass}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
