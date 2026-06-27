import loc1 from "@/assets/location/loc-1.jpeg";
import loc2 from "@/assets/location/loc-2.jpeg";
import loc3 from "@/assets/location/loc-3.jpeg";
import loc4 from "@/assets/location/loc-4.jpeg";
import loc5 from "@/assets/location/loc-5.jpeg";
import loc6 from "@/assets/location/loc-6.jpeg";

export const THANK_YOU_GOOGLE_DRIVE_URL =
  "https://drive.google.com/drive/folders/placeholder-workshop-photos";

export const THANK_YOU_FEEDBACK_URL = "https://forms.gle/placeholder-feedback";

export const THANK_YOU_DEFAULT_NAME = "Manick Basha";
export const THANK_YOU_DEFAULT_LINKEDIN_ID = "bashabhi";

export type ThankYouAttendeeParams = {
  name: string;
  linkedInId: string;
};

export function parseThankYouSearchParams(params: {
  name?: string;
  linkedin?: string;
  linkedIn?: string;
  li?: string;
}): ThankYouAttendeeParams {
  const name = params.name?.trim() || THANK_YOU_DEFAULT_NAME;
  const rawLinkedIn = params.linkedin?.trim() || params.linkedIn?.trim() || params.li?.trim();
  const linkedInId = rawLinkedIn ? rawLinkedIn.replace(/^@+/, "") : THANK_YOU_DEFAULT_LINKEDIN_ID;

  return { name, linkedInId };
}

export type RecapRechargeStep = {
  id: string;
  kind: "recap" | "recharge";
  label: string;
  detail: string;
  prompt: string;
};

export const RECAP_RECHARGE_STEPS: RecapRechargeStep[] = [
  {
    id: "replay",
    kind: "recap",
    label: "Pause & replay",
    detail:
      "Before you post anything, let the day settle. Picture the room, your build, the messy middle.",
    prompt: "What's the one moment you'd replay if you could?",
  },
  {
    id: "learned",
    kind: "recap",
    label: "What you learned",
    detail:
      "Problem-first thinking from Hameed, hands-on building with Leo, reaching people with Hari — what actually landed for you?",
    prompt: "Finish this: “Today I finally understood…”",
  },
  {
    id: "felt",
    kind: "recap",
    label: "What you felt",
    detail:
      "The funny mishap, the surprise win, the thing that made you lean in. Recap isn't only takeaways — it's how it felt.",
    prompt: "What made you laugh, wince, or high-five someone?",
  },
  {
    id: "recharge",
    kind: "recharge",
    label: "Recharge",
    detail:
      "You're not done — you're warmed up. Use the links above: community, prompts, Leo's ChatGPT thread, design repo.",
    prompt: "What's the one thing you'll ship this week?",
  },
  {
    id: "share",
    kind: "recharge",
    label: "Share your story",
    detail:
      "Turn the recap into something public. Use the carousel builder below — voice ramble with AI if that helps.",
    prompt: "Your LinkedIn crowd should hear about this.",
  },
];

export type ThankYouFaqItem = {
  question: string;
  answer: string;
};

export const THANK_YOU_FAQ_ITEMS: ThankYouFaqItem[] = [
  {
    question: "When is the next event?",
    answer:
      "Soon — we're lining up the next Chennai edition now. Join the community link above to hear about it first.",
  },
  {
    question: "Can I get more Lovable credits?",
    answer:
      "Additional Lovable credits are paid only and not included with the workshop. Reach out in the community if you need more.",
  },
];

export type ThankYouLink = {
  label: string;
  description: string;
  href: string;
};

/** Swap href values when final URLs are confirmed. */
export const THANK_YOU_IMPORTANT_LINKS: ThankYouLink[] = [
  {
    label: "Workshop photos",
    description: "Google Drive",
    href: THANK_YOU_GOOGLE_DRIVE_URL,
  },
  {
    label: "Share feedback",
    description: "Tell us how we did",
    href: THANK_YOU_FEEDBACK_URL,
  },
  {
    label: "Certificate verification",
    description: "Verify your workshop credential",
    href: "https://aibuildersnetwork.in/certificate",
  },
  {
    label: "Workshop prompts",
    description: "OTP unlock for session materials",
    href: "https://aibuildersnetwork.in/workshop/",
  },
  {
    label: "Join the community",
    description: "Free for attendees — Telegram group",
    href: "https://aibuildersnetwork.in/community/",
  },
  {
    label: "Leo's ChatGPT session",
    description: "Shared conversation from the workshop",
    href: "https://chatgpt.com/share/6a403f12-195c-83e8-a849-758a90516ce9",
  },
  {
    label: "Design repository",
    description: "Workshop design system & references",
    href: "https://aibuildersnetwork.in/design-repository/",
  },
];

export const FAVORITE_MOMENTS = [
  { src: loc1.src, alt: "Builders at work during the workshop" },
  { src: loc2.src, alt: "Hands-on session at Paperflite" },
  { src: loc3.src, alt: "Group energy in the room" },
  { src: loc4.src, alt: "Collaborating on product ideas" },
  { src: loc5.src, alt: "Workshop in full swing" },
  { src: loc6.src, alt: "Another favorite moment from the day" },
] as const;

export const INSTRUCTOR_MESSAGE = [
  "What a day. Watching you go from ideas to working products — with real customer thinking in the mix — is exactly why we do this.",
  "You showed up curious, built with intent, and pushed through the messy middle. That energy is what makes these workshops special.",
  "Keep shipping. Keep talking to users. And keep building the right thing, the right way.",
] as const;
