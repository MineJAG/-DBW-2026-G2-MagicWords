"use strict";

import { useEffect, useState } from "react";
import { getTimeLeft } from "../lib/timeUtils.js";

export function useCountdown(timerEnd) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (timerEnd == null) return undefined;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerEnd]);

  return getTimeLeft(timerEnd, Date.now());
}
