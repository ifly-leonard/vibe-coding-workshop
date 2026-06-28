export const CAROUSEL_HASHTAGS = ["#AIBNWorkshop", "#Paperflite", "#VibeCoding"] as const;

export const CAROUSEL_TAG_ACCOUNTS = [
  "@hameedraha",
  "@leonardselvaraja",
  "@imharikumaran",
] as const;

export function carouselHashtagsText() {
  return CAROUSEL_HASHTAGS.join(" ");
}

export function carouselTagAccountsText() {
  return CAROUSEL_TAG_ACCOUNTS.join(" ");
}

export function carouselShareCopyText() {
  return `${carouselHashtagsText()} ${carouselTagAccountsText()}`;
}
