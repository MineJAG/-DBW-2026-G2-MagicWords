"use strict";

import { getTimeLeft } from "./timer.js";

export function resetChangeCount(changeCount) {
  changeCount.current = 0;
}

function syncWordChanges({
  timerEnd,
  timeMax,
  changeCount,
  changeWord,
}) {
  const elapsedTime = Math.max(0, timeMax - getTimeLeft(timerEnd, Date.now()));
  const expectedChanges = Math.floor(elapsedTime / 120);

  while (changeCount.current < expectedChanges) {
    changeCount.current += 1;
    changeWord(changeCount.current);
  }
}

export function startWordChangeInterval({
  timerEnd,
  timeMax,
  changeCount,
  changeWord,
}) {
  return setInterval(() => {
    syncWordChanges({
      timerEnd,
      timeMax,
      changeCount,
      changeWord,
    });
  }, 1000);
}
