"use strict";

export function useDisplayStatsSingleplayer(stats) {
  return Object.entries(stats ?? {}).filter(([key]) => key !== "currentScore");
}
