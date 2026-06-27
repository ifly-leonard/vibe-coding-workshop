export async function ensureSwagFonts() {
  await Promise.all([
    document.fonts.load('800 140px "Bricolage Grotesque"'),
    document.fonts.load('800 96px "Bricolage Grotesque"'),
    document.fonts.load('700 52px "Bricolage Grotesque"'),
    document.fonts.load('700 36px "Inter Tight"'),
    document.fonts.load('600 30px "Inter Tight"'),
    document.fonts.load('700 22px "Inter Tight"'),
  ]);
}
