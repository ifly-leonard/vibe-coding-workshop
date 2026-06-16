export const TICKET_PRICE_INR = 3499;

export const VIBE_EXPERIENCE_OPTIONS = [
  { value: "curious", label: "I want to, but don't know how to" },
  { value: "tried", label: "I tried, once or twice" },
  { value: "pro", label: "I'm a vibe coder pro max" },
] as const;

export type VibeExperience = (typeof VIBE_EXPERIENCE_OPTIONS)[number]["value"];

export const PAYMENT_NOTE = `₹${TICKET_PRICE_INR.toLocaleString("en-IN")} per seat — full workshop access and builder perks included.`;

export const TERMS_AND_CONDITIONS = `
1. Right of admission is strictly reserved by the organisers. A completed payment alone does not guarantee entry if seats are full or if registration details cannot be verified.

2. Seats are allocated on a strictly first come, first served basis. Your seat is confirmed only after successful Razorpay payment confirmation.

3. You must provide accurate contact information. We will reach out via email or phone to confirm your registration.

4. The ticket price is ₹${TICKET_PRICE_INR.toLocaleString("en-IN")} per seat. Payment must be completed in full via Razorpay before the event.

5. Refunds are not available except where the event is cancelled by the organisers. In case of cancellation, refunds will be processed within 14 business days.

6. By registering, you consent to being photographed or recorded during the workshop for promotional use.

7. The organisers reserve the right to refuse entry or remove attendees who violate venue rules or disrupt the session.

8. Workshop materials, subscriptions, and perks are subject to availability and may be updated without prior notice.
`.trim();
