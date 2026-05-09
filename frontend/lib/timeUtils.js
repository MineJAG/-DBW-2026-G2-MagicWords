"use strict";

export function formatTimeLeft(timeLeft) {
  const time = Math.max(0, Math.floor(Number(timeLeft) || 0));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getTimerEnd(timeStarted, timeMax) {
  return timeStarted + timeMax * 1000;
}

export function getTimeLeft(timerEnd, currentTime = Date.now()) {
  if (timerEnd == null) return 0;
  return Math.max(0, Math.ceil((timerEnd - currentTime) / 1000));
}
