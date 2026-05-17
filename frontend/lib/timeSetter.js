"use strict";

/**
 * Validate the waiting-room timer input. Rejects non-finite values and
 * anything `< 1`. Returns an empty string when valid so callers can render
 * the result directly as an error message.
 *
 * @param {string | number} minutes
 * @returns {string} Error message, or `""` when valid.
 */
export function validateWaitingRoomTimer(minutes) {
  const parsedMinutes = Number(minutes);

  if (!Number.isFinite(parsedMinutes) || parsedMinutes < 1) {
    return "Enter a number equal to or greater than 1.";
  }

  return "";
}

/**
 * Validate the host's timer input and, if valid, push it into the host's
 * React state. `setMinutes` receives the normalized string; `setTimeMax`
 * receives the duration in seconds (minutes × 60).
 *
 * @param {{
 *   minutes: string | number,
 *   setMinutes: (value: string) => void,
 *   setTimeMax: (seconds: number) => void,
 * }} params
 * @returns {string} Validation error, or `""` on success.
 */
export function setWaitingRoomTimer({ minutes, setMinutes, setTimeMax }) {
  const validationError = validateWaitingRoomTimer(minutes);
  if (validationError) return validationError;

  const nextMinutes = Number(minutes);
  const nextTime = nextMinutes * 60;

  setMinutes(String(nextMinutes));
  setTimeMax(nextTime);

  return "";
}
