// Date and countdown utilities with server-time verification and timezone support
import { CONFIG } from "@/config/surpriseConfig";

/**
 * Cached time offset (ms) between authoritative server time and Date.now().
 * getAuthoritativeTime() = Date.now() + timeOffset
 */
let timeOffset = 0;
let hasSyncedWithServer = false;
let resyncTimer = null;

/** Set a 5-minute re-sync timer */
function scheduleResync() {
  if (resyncTimer) clearTimeout(resyncTimer);
  resyncTimer = setTimeout(() => {
    syncServerTime();
  }, 5 * 60 * 1000);
}

// Re-sync when the browser tab becomes visible again
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncServerTime();
    }
  });
}

/**
 * Fetches server UTC time to prevent device-clock tampering.
 * 1. Tries GET /api/time  → { now: "<ISO string>" }
 * 2. Falls back to HEAD / and reads the Date response header
 * 3. Falls back to device clock
 */
export async function syncServerTime() {
  // Try 1: /api/time
  try {
    const t0 = performance.now();
    const res = await fetch("/api/time", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const rtt = performance.now() - t0;
      if (data && data.now) {
        const serverMs = new Date(data.now).getTime() + Math.round(rtt / 2);
        timeOffset = serverMs - Date.now();
        hasSyncedWithServer = true;
        scheduleResync();
        return { timestampMs: Date.now() + timeOffset, isServer: true };
      }
    }
  } catch (_) {
    // fall through
  }

  // Try 2: HEAD / — read Date header
  try {
    const t0 = performance.now();
    const res = await fetch("/", { method: "HEAD", cache: "no-store" });
    const dateHdr = res.headers.get("Date");
    if (dateHdr) {
      const rtt = performance.now() - t0;
      const serverMs = new Date(dateHdr).getTime() + Math.round(rtt / 2);
      timeOffset = serverMs - Date.now();
      scheduleResync();
      return { timestampMs: Date.now() + timeOffset, isServer: true };
    }
  } catch (_) {
    // fall through
  }

  // Fallback: device clock
  scheduleResync();
  return { timestampMs: Date.now(), isServer: false };
}

/**
 * Returns authoritative current timestamp (adjusted by server offset).
 */
export function getAuthoritativeTime() {
  return Date.now() + timeOffset;
}

/**
 * Checks if the site is currently unlocked based on unlockAt timestamp.
 * Respects CONFIG.testUnlockAt if set.
 */
export function checkIsUnlocked(unlockAtStr) {
  const target = CONFIG.testUnlockAt ? CONFIG.testUnlockAt : unlockAtStr;
  const targetTime = new Date(target).getTime();
  const now = getAuthoritativeTime();
  return now >= targetTime;
}

/**
 * Live countdown to the unlock date.
 * Respects CONFIG.testUnlockAt — if set, that becomes the countdown target.
 */
export function getLockCountdown(unlockAtStr) {
  const target = CONFIG.testUnlockAt ? CONFIG.testUnlockAt : unlockAtStr;
  const targetTime = new Date(target).getTime();
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
