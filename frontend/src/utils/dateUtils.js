// Date and countdown utilities with server-time verification and timezone support

/**
 * Fetches server UTC time from backend to prevent device clock tampering.
 * Falls back gracefully to local device clock if server call fails.
 */
let timeOffset = 0;
let hasSyncedWithServer = false;

export async function syncServerTime() {
  try {
    const startFetch = performance.now();
    const res = await fetch("/api/time", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP status " + res.status);
    const data = await res.json();
    const roundTrip = performance.now() - startFetch;
    
    if (data && typeof data.timestamp_ms === "number") {
      // Offset = (serverTimestamp + roundTrip/2) - Date.now()
      const serverEstNow = data.timestamp_ms + Math.round(roundTrip / 2);
      timeOffset = serverEstNow - Date.now();
      hasSyncedWithServer = true;
      return { timestampMs: serverEstNow, isServer: true };
    }
  } catch (err) {
    // Graceful fallback to client device clock
  }
  return { timestampMs: Date.now(), isServer: false };
}

/**
 * Returns authoritative current timestamp (adjusted by server offset)
 */
export function getAuthoritativeTime() {
  return Date.now() + timeOffset;
}

/**
 * Checks if the site is currently unlocked based on unlockAt timestamp.
 */
export function checkIsUnlocked(unlockAtStr) {
  const targetTime = new Date(unlockAtStr).getTime();
  const now = getAuthoritativeTime();
  return now >= targetTime;
}

/**
 * Live countdown to the unlock date (00:00 IST on 3 Nov 2026)
 */
export function getLockCountdown(unlockAtStr) {
  const targetTime = new Date(unlockAtStr).getTime();
  const now = getAuthoritativeTime();
  const diff = targetTime - now;

  if (diff <= 0) {
    return {
      isUnlocked: true,
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      totalSecondsLeft: 0,
    };
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return {
    isUnlocked: false,
    days,
    hours,
    mins,
    secs,
    totalSecondsLeft: Math.floor(diff / 1000),
  };
}

/**
 * "Since we met" live counter from metOn date (e.g. 2025-11-03)
 */
export function getSinceMetCounter(metOnStr) {
  const now = getAuthoritativeTime();
  // Assume metOn is in IST (+05:30)
  const start = new Date(`${metOnStr}T00:00:00+05:30`).getTime();
  const diff = Math.max(0, now - start);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    mins,
    secs,
    startDate: new Date(start),
  };
}

/**
 * Birthday status for 3 Nov in Asia/Kolkata
 */
export function getMiruBirthdayStatus(birthdayStr, unlockAtStr) {
  const now = getAuthoritativeTime();
  const unlockTarget = new Date(unlockAtStr).getTime();

  // In Asia/Kolkata, check if current date is 3 Nov
  const istDateStr = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(now));

  const [day, month, year] = istDateStr.split("/").map(Number);
  const isBirthdayToday = day === 3 && month === 11;
  const isPastUnlock = now >= unlockTarget;

  // Countdown to next 3 Nov
  let targetYear = year;
  let targetDate = new Date(`${targetYear}-11-03T00:00:00+05:30`);
  if (now > targetDate.getTime() && !isBirthdayToday) {
    targetYear += 1;
    targetDate = new Date(`${targetYear}-11-03T00:00:00+05:30`);
  }

  const msLeft = Math.max(0, targetDate.getTime() - now);
  const daysUntil = isBirthdayToday ? 0 : Math.ceil(msLeft / 86400000);

  return {
    isBirthdayToday,
    isPastUnlock,
    daysUntil,
  };
}
