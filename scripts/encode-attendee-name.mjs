#!/usr/bin/env node
/**
 * Encode an attendee name for attendees.csv
 *
 * Usage:
 *   node scripts/encode-attendee-name.mjs "Jane Doe" [rounds]
 *
 * Default rounds: ATTENDEE_NAME_ENCODING_ROUNDS env or 12
 */

const name = process.argv[2];
const rounds = Number.parseInt(process.argv[3] ?? process.env.ATTENDEE_NAME_ENCODING_ROUNDS ?? "12", 10);

if (!name) {
  console.error('Usage: node scripts/encode-attendee-name.mjs "Jane Doe" [rounds]');
  process.exit(1);
}

let encoded = name;
for (let i = 0; i < rounds; i++) {
  encoded = Buffer.from(encoded, "utf8").toString("base64");
}

console.log(encoded);
