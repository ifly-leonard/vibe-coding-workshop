"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ExternalLink, Loader2 } from "lucide-react";

import { FloatingReserveButton } from "@/components/FloatingReserveButton";
import { useScrollSpyInView } from "@/hooks/use-scroll-spy-in-view";
import { getRazorpayPaymentPageUrl } from "@/lib/reservation.constants";

type ReservationContextValue = {
  openReservation: () => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

const PRICING_SECTION_ID = "pricing";
const REDIRECT_DELAY_MS = 1200;

function FloatingReserveGate({
  reservationOpen,
  onOpen,
}: {
  reservationOpen: boolean;
  onOpen: () => void;
}) {
  const pricingInView = useScrollSpyInView(PRICING_SECTION_ID);

  return <FloatingReserveButton visible={!reservationOpen && !pricingInView} onClick={onOpen} />;
}

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openReservation = useCallback(() => setOpen(true), []);

  return (
    <ReservationContext.Provider value={{ openReservation }}>
      {children}
      <FloatingReserveGate reservationOpen={open} onOpen={openReservation} />
      <ReservationRedirectModal open={open} onOpenChange={setOpen} />
    </ReservationContext.Provider>
  );
}

export function useOpenReservation() {
  const ctx = useContext(ReservationContext);
  if (!ctx) {
    throw new Error("useOpenReservation must be used within ReservationProvider");
  }
  return ctx;
}

type ReserveSeatButtonProps = {
  className?: string;
  children: ReactNode;
};

export function ReserveSeatButton({ className = "btn-primary", children }: ReserveSeatButtonProps) {
  const { openReservation } = useOpenReservation();

  return (
    <button type="button" onClick={openReservation} className={className}>
      {children}
    </button>
  );
}

type ReservationRedirectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ReservationRedirectModal({ open, onOpenChange }: ReservationRedirectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const paymentPageUrl = getRazorpayPaymentPageUrl();

  useEffect(() => {
    if (!open || !overlayRef.current || !panelRef.current || !paymentPageUrl) return;

    document.body.style.overflow = "hidden";

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { opacity: 0, y: 36, scale: 0.94 });

    const ctx = gsap.context(() => {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(panelRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        delay: 0.05,
      });
    });

    const redirectTimer = window.setTimeout(() => {
      window.location.assign(paymentPageUrl);
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(redirectTimer);
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, [open, paymentPageUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[color:var(--text-main)]/55 backdrop-blur-md"
        onClick={() => !submitting && handleClose()}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-title"
        className={`relative z-10 flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] border bg-[color:var(--bg-card)] shadow-[0_40px_120px_oklch(0.18_0.008_60/0.25)] transition-[border-color,box-shadow] duration-300 sm:rounded-[28px] ${
          errorHighlight ? "reservation-panel--error" : "border-[color:var(--border)]"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border)] px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--text-soft)]">
              Step {step} of 2
            </p>
            <h2 id="reservation-title" className="mt-1 text-2xl font-extrabold tracking-tight">
              {step === 1 ? "Reserve your seat" : "Payment & confirmation"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--text-muted)] transition hover:bg-[color:var(--bg-section)] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={stepContentRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {step === 1 ? (
            <form id="reservation-step-one" onSubmit={handleStepOneSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="res-name">Full name</Label>
                <input
                  id="res-name"
                  value={stepOne.name}
                  onChange={(e) => {
                    clearError();
                    setStepOne((s) => ({ ...s, name: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 text-sm outline-none transition focus:border-[color:var(--accent-vermillion)]/50"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="res-email">Email</Label>
                <input
                  id="res-email"
                  type="email"
                  value={stepOne.email}
                  onChange={(e) => {
                    clearError();
                    setStepOne((s) => ({ ...s, email: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 text-sm outline-none transition focus:border-[color:var(--accent-vermillion)]/50"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="res-phone">Phone number</Label>
                <input
                  id="res-phone"
                  type="tel"
                  value={stepOne.phone}
                  onChange={(e) => {
                    clearError();
                    setStepOne((s) => ({ ...s, phone: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 text-sm outline-none transition focus:border-[color:var(--accent-vermillion)]/50"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="res-linkedin">LinkedIn profile</Label>
                <input
                  id="res-linkedin"
                  type="url"
                  value={stepOne.linkedin}
                  onChange={(e) => {
                    clearError();
                    setStepOne((s) => ({ ...s, linkedin: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 text-sm outline-none transition focus:border-[color:var(--accent-vermillion)]/50"
                  placeholder="https://linkedin.com/in/you"
                  autoComplete="url"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="res-experience">Vibe coding experience</Label>
                <Select
                  value={stepOne.experience || undefined}
                  onValueChange={(value) => {
                    clearError();
                    setStepOne((s) => ({ ...s, experience: value as VibeExperience }));
                  }}
                >
                  <SelectTrigger
                    id="res-experience"
                    className="h-auto w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3 text-sm shadow-none outline-none transition focus:border-[color:var(--accent-vermillion)]/50 focus:ring-0 data-[placeholder]:text-[color:var(--text-soft)]"
                  >
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent className="z-[250] border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text-main)]">
                    {VIBE_EXPERIENCE_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-[color:var(--text-muted)]"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          ) : (
            <form id="reservation-step-two" onSubmit={handlePayWithRazorpay} className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-section)]">
                <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-section)] px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    Order summary
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-[color:var(--text-main)]">
                        Vibe Coding: The Right Way
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                        27 June 2026 · Paperflite, Chennai
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <IndianRupee className="h-5 w-5 text-[color:var(--accent-vermillion)]" />
                        <span className="text-3xl font-black tracking-tight gradient-text">
                          {TICKET_PRICE_INR.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[color:var(--text-soft)]">per seat</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-5 py-4 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] pb-3">
                    <span className="text-[color:var(--text-soft)]">Attendee</span>
                    <span className="font-medium text-[color:var(--text-main)]">
                      {stepOne.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] pb-3">
                    <span className="text-[color:var(--text-soft)]">Email</span>
                    <span className="truncate font-medium text-[color:var(--text-main)]">
                      {stepOne.email}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-[color:var(--text-muted)]">
                    <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent-vermillion)]" />
                    <span>
                      Pay securely with{" "}
                      <strong className="text-[color:var(--text-main)]">Razorpay</strong> — UPI,
                      cards, netbanking, and wallets.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
                  Seats are{" "}
                  <strong className="text-[color:var(--text-main)]">
                    first come, first served
                  </strong>
                  . Your spot is confirmed only after successful payment.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                    Terms &amp; conditions
                  </p>
                  <span className="text-xs text-[color:var(--text-soft)]">
                    Required to continue
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-[color:var(--text-muted)]">
                    {TERMS_AND_CONDITIONS}
                  </p>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-section)] px-4 py-3.5 transition hover:bg-[color:var(--bg-section)]">
                  <Checkbox
                    checked={acceptedTerms}
                    onCheckedChange={(v) => {
                      clearError();
                      setAcceptedTerms(v === true);
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed text-[color:var(--text-muted)]">
                    I have read and agree to the terms and conditions.
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>

        <div className="shrink-0 border-t border-[color:var(--border)] px-6 py-5">
          {error ? (
            <p
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              Continue to payment
              <ExternalLink className="h-4 w-4" />
            </a>
          </>
        ) : (
          <>
            <h2 id="reservation-title" className="text-2xl font-extrabold tracking-tight">
              Payment link unavailable
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-muted)]">
              Set <code className="text-white">NEXT_PUBLIC_RAZORPAY_PAYMENT_PAGE_URL</code> in your
              environment and try again.
            </p>
          </>
        )}

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-6 text-xs text-[color:var(--text-soft)] transition hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
