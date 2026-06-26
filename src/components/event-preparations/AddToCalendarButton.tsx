"use client";

import { CalendarPlus } from "lucide-react";

import { buildAttendeeReference } from "@/lib/attendee-reference";
import { downloadWorkshopIcs } from "@/lib/ics";

type AddToCalendarButtonProps = {
  attendeeName: string;
  organisation: string;
  variant?: "primary" | "secondary";
};

export function AddToCalendarButton({
  attendeeName,
  organisation,
  variant = "primary",
}: AddToCalendarButtonProps) {
  const className =
    variant === "secondary"
      ? "btn-secondary inline-flex items-center gap-2 !px-6 !py-3 !text-sm"
      : "btn-primary inline-flex items-center gap-2 !px-6 !py-3 !text-sm";

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        downloadWorkshopIcs({
          attendeeName,
          referenceId: buildAttendeeReference(attendeeName, organisation),
        })
      }
    >
      <CalendarPlus className="h-4 w-4" />
      Add to calendar
    </button>
  );
}
