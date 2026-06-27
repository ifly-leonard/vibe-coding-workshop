import { ChevronDown } from "lucide-react";

import { THANK_YOU_FAQ_ITEMS } from "@/lib/thank-you-for-coming/constants";

export function ThankYouFaq() {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight text-[color:var(--text-main)] md:text-2xl">
        FAQ
      </h2>
      <p className="mt-2 max-w-xl text-sm text-[color:var(--text-muted)]">
        Quick answers while you&apos;re still riding the workshop high.
      </p>
      <div className="mt-5 grid gap-3">
        {THANK_YOU_FAQ_ITEMS.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-card)] transition-colors hover:border-[color:var(--accent-vermillion)]/30"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-bold text-[color:var(--text-main)]">
              {faq.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-[color:var(--text-soft)] transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-[color:var(--text-muted)]">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
