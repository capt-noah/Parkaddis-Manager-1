const OVERLAP_MINS = 0;

export interface ClerkShiftProfile {
  shiftStartTime?: string | null;
  shiftEndTime?: string | null;
}

export interface ClerkGateProfile extends ClerkShiftProfile {
  status?: string | null;
}

export type ClerkGateBlockReason = "inactive" | "shift";

export function checkClerkAccountActive(
  profile: Pick<ClerkGateProfile, "status">,
): { ok: true } | { ok: false; reason: "inactive"; message: string } {
  const status = profile.status?.toUpperCase();
  if (!status || status !== "ACTIVE") {
    return {
      ok: false,
      reason: "inactive",
      message:
        "Your clerk account is inactive. Gate actions are disabled until your supervisor reactivates your account.",
    };
  }
  return { ok: true };
}

export function checkClerkGateAccess(
  profile: ClerkGateProfile,
):
  | { ok: true }
  | { ok: false; reason: ClerkGateBlockReason; message: string } {
  const accountCheck = checkClerkAccountActive(profile);
  if (!accountCheck.ok) {
    return accountCheck;
  }

  const shiftCheck = checkClerkShift(profile);
  if (!shiftCheck.ok) {
    return { ok: false, reason: "shift", message: shiftCheck.message };
  }

  return { ok: true };
}

export function checkClerkShift(
  profile: ClerkShiftProfile,
): { ok: true } | { ok: false; message: string } {
  if (!profile.shiftStartTime || !profile.shiftEndTime) {
    return { ok: false, message: "No shift hours assigned to your account." };
  }

  const now = new Date();
  const utcHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  
  // Force Addis Ababa time (UTC+3) regardless of simulator/device timezone setting
  let currentHour = utcHour + 3;
  if (currentHour >= 24) currentHour -= 24;

  // Helper to extract hours and minutes robustly from either "HH:MM" or "2026-06-22T08:00:00Z"
  const parseTime = (timeStr: string): [number, number] => {
    // If it's an ISO string, try parsing it as a Date to get local time, 
    // or extract the time part if we want to treat the literal string as local time.
    // The previous logic assumed the literal string's hour was the local hour.
    let h = NaN;
    let m = NaN;
    
    if (timeStr.includes("T")) {
      // It's an ISO string like 1970-01-01T08:00:00.000Z
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        return [d.getHours(), d.getMinutes()];
      }
    }
    
    // Fallback: extract the first two numbers separated by a colon
    const match = timeStr.match(/(\d+):(\d+)/);
    if (match) {
      h = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
    }
    return [h, m];
  };

  const [startH, startM] = parseTime(profile.shiftStartTime);
  const [endH, endM] = parseTime(profile.shiftEndTime);

  if (isNaN(startH) || isNaN(endH)) {
    // Default to strict fail if we can't parse
    return { ok: false, message: "Invalid shift hours format." };
  }

  const shiftStartMins = startH * 60 + startM;
  let shiftEndMins = endH * 60 + endM;

  if (shiftEndMins < shiftStartMins) {
    shiftEndMins += 24 * 60;
  }

  let currentMins = currentHour * 60 + currentMinute;
  if (shiftEndMins >= 24 * 60 && currentMins < shiftStartMins) {
    currentMins += 24 * 60;
  }

  if (
    currentMins < shiftStartMins - OVERLAP_MINS ||
    currentMins > shiftEndMins + OVERLAP_MINS
  ) {
    return {
      ok: false,
      message: "You are outside your working hours.",
    };
  }

  return { ok: true };
}

export function formatShiftTime(time?: string | null): string {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatShiftRange(
  start?: string | null,
  end?: string | null,
): string {
  return `${formatShiftTime(start)} – ${formatShiftTime(end)}`;
}
