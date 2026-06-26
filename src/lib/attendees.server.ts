import { readFileSync } from "node:fs";
import path from "node:path";

import { decodeAttendeeName, getAttendeeNameEncodingRounds } from "./attendees.encoding";

export type Attendee = {
  id: string;
  name: string;
};

let attendeeCache: Map<string, string> | null = null;

function getAttendeesCsvPath(): string {
  const configured = process.env.ATTENDEES_CSV_PATH?.trim();
  if (configured) {
    return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
  }
  return path.join(process.cwd(), "data", "attendees.csv");
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }

  values.push(current);
  return values;
}

function loadAttendeeMap(): Map<string, string> {
  if (attendeeCache) {
    return attendeeCache;
  }

  const csvPath = getAttendeesCsvPath();
  const raw = readFileSync(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    attendeeCache = new Map();
    return attendeeCache;
  }

  const header = parseCsvLine(lines[0]!).map((value) => value.trim().toLowerCase());
  const idIndex = header.indexOf("attendee_id");
  const nameIndex = header.indexOf("name");

  if (idIndex === -1 || nameIndex === -1) {
    throw new Error('attendees.csv must include "attendee_id" and "name" columns');
  }

  const map = new Map<string, string>();
  for (const line of lines.slice(1)) {
    const columns = parseCsvLine(line);
    const id = columns[idIndex]?.trim();
    const encodedName = columns[nameIndex]?.trim();
    if (id && encodedName) {
      map.set(id, encodedName);
    }
  }

  attendeeCache = map;
  return attendeeCache;
}

export function getAttendeeById(id: string): Attendee | null {
  const encodedName = loadAttendeeMap().get(id.trim());
  if (!encodedName) {
    return null;
  }

  const rounds = getAttendeeNameEncodingRounds();
  try {
    const name = decodeAttendeeName(encodedName, rounds);
    if (!name) {
      return null;
    }
    return { id: id.trim(), name };
  } catch {
    return null;
  }
}
