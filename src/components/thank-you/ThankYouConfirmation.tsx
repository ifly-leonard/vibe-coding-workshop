import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export function ThankYouConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-3 py-4 sm:px-4 sm:py-5">
      <span className="font-mono text-2xl font-extrabold tabular-nums text-[color:var(--text-main)] sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--text-soft)] sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function EventCountdown() {
  const [parts, setParts] = useState<CountdownParts>(() => getCountdown(WORKSHOP_EVENT.startIso));

  useEffect(() => {
    const tick = () => setParts(getCountdown(WORKSHOP_EVENT.startIso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (parts.isPast) {
    return (
      <p className="text-base font-semibold text-[color:var(--text-main)]">
        Workshop day — see you at Paperflite!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      <CountdownUnit value={parts.days} label="Days" />
      <CountdownUnit value={parts.hours} label="Hours" />
      <CountdownUnit value={parts.minutes} label="Mins" />
      <CountdownUnit value={parts.seconds} label="Secs" />
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[24px] border border-[color:var(--border)] bg-[color:var(--bg-section)] p-6 md:p-7 ${className}`}
    >
      {children}
    </section>
  );
}

      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
        You&apos;re <span className="gradient-text">all set</span>.
      </h1>

      <div className="mx-auto mt-8 max-w-md rounded-[24px] border border-white/10 bg-white/[0.03] p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C88BEF]/15 text-[#C88BEF]">
          <Mail className="h-5 w-5" />
        </div>
        <p className="mt-5 text-base leading-relaxed text-[color:var(--text-muted)] md:text-lg">
          All details have been mailed to you.
        </p>
      </div>

      <Link href="/" className="btn-primary mt-10 inline-flex !px-6 !py-3 !text-sm">
        Back to homepage <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
