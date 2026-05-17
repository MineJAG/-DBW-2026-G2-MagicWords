"use strict";

/**
 * Format a number of seconds as `"MM:SS"` (zero-padded). Negative or
 * non-finite inputs clamp to zero.
 *
 * @param {number} timeLeft - Seconds remaining.
 * @returns {string}
 */
export function formatTimeLeft(timeLeft) {
  const time = Math.max(0, Math.floor(Number(timeLeft) || 0));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Compute the absolute end timestamp of a timer.
 *
 * @param {number} timeStarted - Start timestamp in ms (e.g. `Date.now()`).
 * @param {number} timeMax - Duration in seconds.
 * @returns {number} The end timestamp in ms.
 */
export function getTimerEnd(timeStarted, timeMax) {
  return timeStarted + timeMax * 1000;
}

/**
 * Seconds left until `timerEnd`, rounded up and clamped to ≥0. Returns `0`
 * if `timerEnd` is null/undefined. `currentTime` is injected so callers can
 * pass a frozen "now" for testing.
 *
 * @param {number | null | undefined} timerEnd - End timestamp in ms.
 * @param {number} [currentTime=Date.now()] - Reference time in ms.
 * @returns {number}
 */
export function getTimeLeft(timerEnd, currentTime = Date.now()) {
  if (timerEnd == null) return 0;
  return Math.max(0, Math.ceil((timerEnd - currentTime) / 1000));
}
