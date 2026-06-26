export function buildAttendeeReference(name: string, organisation: string) {
  return `${name}-${organisation}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
