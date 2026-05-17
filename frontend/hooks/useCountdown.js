"use strict";

import { useEffect, useState } from "react";
import { getTimeLeft } from "../lib/timeUtils.js";

/**
 * Tick once per second until `timerEnd` so callers re-render with a fresh
 * "seconds left". Returns the current seconds-left value. When `timerEnd` is
 * null/undefined, no interval is set and the function returns 0.
 *
 * The tick state is intentionally unread — its only job is to force a
 * re-render; the actual value is computed from `Date.now()` each render so
 * the math stays in {@link getTimeLeft}.
 *
 * @param {number | null | undefined} timerEnd - End timestamp in ms.
 * @returns {number} Seconds remaining (≥0).
 */
export function useCountdown(timerEnd) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (timerEnd == null) return undefined;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerEnd]);

  return getTimeLeft(timerEnd, Date.now());
}
