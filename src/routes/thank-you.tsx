import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { z } from "zod";

const thankYouSearchSchema = z.object({
  name: z.string().optional(),
  ref: z.string().optional(),
});

export const Route = createFileRoute("/thank-you")({
  validateSearch: thankYouSearchSchema,
  head: () => ({
    meta: [
      { title: "Thank you — Vibe Coding: The Right Way" },
      {
        name: "description",
        content: "Your workshop registration has been received. We will confirm your seat after verifying payment.",
      },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { name, ref } = Route.useSearch();
  const firstName = name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,139,239,0.15), transparent 65%)" }}
      />

      <div className="vc-container relative flex min-h-screen items-center justify-center py-24">
        <div className="glass-card w-full max-w-xl rounded-[28px] p-10 text-center md:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-bg">
            <CheckCircle2 className="h-8 w-8 text-[#050505]" strokeWidth={2.5} />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
            Thank you, {firstName}!
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[color:var(--text-muted)]">
            Your payment was successful. We've received your registration and will send a confirmation email shortly.
          </p>

          <div className="mt-6 rounded-2xl border border-[#C88BEF]/25 bg-[#C88BEF]/10 px-5 py-4 text-left text-sm leading-relaxed text-[color:var(--text-muted)]">
            <strong className="text-white">Remember:</strong> seats are strictly first come, first served. Right of
            admission is reserved until payment is verified.
          </div>

          {ref && (
            <p className="mt-4 text-sm text-[color:var(--text-soft)]">
              Reference: <span className="font-mono text-white">{ref}</span>
            </p>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[color:var(--text-soft)]">
            <Mail className="h-4 w-4" />
            Check your inbox for a confirmation email shortly.
          </div>

          <Link to="/" className="btn-primary mt-10 inline-flex">
            Back to homepage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
