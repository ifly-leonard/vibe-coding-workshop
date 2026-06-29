export const THANK_YOU_GOOGLE_DRIVE_URL =
  "https://drive.google.com/drive/folders/1HHZUFpeIvx6qYUljZdVOYayRhpVfQXDr";

export const THANK_YOU_FEEDBACK_URL = "https://canyou.sayabout.us/f/NH7ZgtyW";

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
    question: "When will I get the photos?",
    answer:
      "They're in the Important links section above. Download your images ASAP — the link will be decommissioned after some time.",
  },
  {
    question: "How do I activate my 300 Lovable credits?",
    answer:
      "Check the email address you used to register for the workshop. You should have received an activation link there.",
  },
  {
    question: "How long are the credits valid?",
    answer: "One year from the date of activation.",
  },
  {
    question: "I didn't come to the event — can I still get credits?",
    answer: "Yeppudi bro. Won't be possible.",
  },
  {
    question: "What if I run out of credits?",
    answer:
      "You can buy more. AIBN is in the process of becoming an official partner of Lovable — members will get access to credits at a very subsidized rate. Butttt, hopefully you won't run out: the whole session was about optimization.",
  },
  {
    question: "When is the next event?",
    answer:
      "When it's happening, we'll post in the AIBN group first before LinkedIn. Join there for exclusive access and early-bird discounts.",
  },
  {
    question: "What if I have doubts?",
    answer: "Ask on the AIBN group directly.",
  },
];

export type ThankYouLink = {
  label: string;
  description: string;
  href: string;
  iconSrc?: string;
  iconAlt?: string;
};

/** Swap href values when final URLs are confirmed. */
export const THANK_YOU_IMPORTANT_LINKS: ThankYouLink[] = [
  {
    label: "Workshop photos",
    description: "Google Drive",
    href: THANK_YOU_GOOGLE_DRIVE_URL,
    iconSrc: "/icons/google-drive.svg",
    iconAlt: "Google Drive",
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
  { src: "/photos/059A2611.jpg", alt: "Workshop moment at Paperflite" },
  { src: "/photos/059A2728.jpg", alt: "Builders collaborating during the session" },
  { src: "/photos/059A2764.jpg", alt: "Hands-on vibe coding in the room" },
  { src: "/photos/059A2992.jpg", alt: "Attendees focused on their builds" },
  { src: "/photos/059A3153.jpg", alt: "Energy in the workshop space" },
  { src: "/photos/059A3167.jpg", alt: "Group working through product ideas" },
  { src: "/photos/059A3202.jpg", alt: "Instructors and attendees in conversation" },
  { src: "/photos/059A3257.jpg", alt: "Another favorite moment from the day" },
  { src: "/photos/059A3259.jpg", alt: "Workshop in full swing" },
  { src: "/photos/059A3295.jpg", alt: "Builders at work during the workshop" },
  { src: "/photos/059A3364.jpg", alt: "Collaborating on product ideas" },
  { src: "/photos/059A3548.jpg", alt: "Snapshots from AI Vibe Coding Chennai" },
] as const;

export const INSTRUCTOR_MESSAGE = [
  "What a day. Watching you go from ideas to working products — with real customer thinking in the mix — is exactly why we do this.",
  "You showed up curious, built with intent, and pushed through the messy middle. That energy is what makes these workshops special.",
  "Keep shipping. Keep talking to users. And keep building the right thing, the right way.",
] as const;
