export function PrepDateStamp({ className = "" }: { className?: string }) {
  return (
    <div className={`date-stamp w-full max-w-[280px] p-8 text-center ${className}`}>
      <div className="date-stamp__corner" />
      <div className="editorial-label text-[color:var(--accent-vermillion)]">Save the date</div>
      <div className="mt-4 font-display text-[88px] leading-none font-extrabold tracking-tighter text-[color:var(--text-main)]">
        27
      </div>
      <div className="mt-1 font-display text-2xl font-bold tracking-tight text-[color:var(--text-main)]">
        June 2026
      </div>
      <div className="mt-4 border-t border-[color:var(--border)] pt-4 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
        Saturday · 2–6 PM
      </div>
    </div>
  );
}
