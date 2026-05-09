"use strict";

import { useEffect, useState } from "react";
import { getTimeLeft } from "../lib/timeUtils.js";

export function useCountdown(timerEnd) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(timerEnd));

  useEffect(() => {
    setTimeLeft(getTimeLeft(timerEnd, Date.now()));

    if (timerEnd == null) return undefined;

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(timerEnd, Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnd]);

  return timeLeft;
}
