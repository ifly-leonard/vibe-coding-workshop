export function encodeAttendeeName(name: string, rounds: number): string {
  let encoded = name;
  for (let i = 0; i < rounds; i++) {
    encoded = Buffer.from(encoded, "utf8").toString("base64");
  }
  return encoded;
}

export function decodeAttendeeName(encoded: string, rounds: number): string {
  let decoded = encoded.trim();
  for (let i = 0; i < rounds; i++) {
    decoded = Buffer.from(decoded, "base64").toString("utf8");
  }
  return decoded;
}

export function getAttendeeNameEncodingRounds(): number {
  const raw = process.env.ATTENDEE_NAME_ENCODING_ROUNDS?.trim();
  const rounds = raw ? Number.parseInt(raw, 10) : 12;
  return Number.isFinite(rounds) && rounds > 0 ? rounds : 12;
}
