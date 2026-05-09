"use strict";

import { useEffect, useRef } from "react";
import { resetChangeCount, startWordChangeInterval } from "../lib/wordChange.js";

export function useWordRotation({ timerEnd, timeMax, changeWord }) {
  const changeCount = useRef(0);

  useEffect(() => {
    if (timerEnd == null) {
      resetChangeCount(changeCount);
      return undefined;
    }

    const interval = startWordChangeInterval({
      timerEnd,
      timeMax,
      changeCount,
      changeWord,
    });

    return () => {
      clearInterval(interval);
      resetChangeCount(changeCount);
    };
  }, [timerEnd, timeMax, changeWord]);
}
