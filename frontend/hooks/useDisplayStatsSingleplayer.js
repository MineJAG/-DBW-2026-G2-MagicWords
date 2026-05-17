"use strict";

/**
 * Return the user's stats as `[key, value]` pairs ready to render in a list,
 * dropping `currentScore` (which the singleplayer leaderboard shows
 * separately and shouldn't appear twice).
 *
 * @param {Record<string, any> | null | undefined} stats
 * @returns {Array<[string, any]>}
 */
export function useDisplayStatsSingleplayer(stats) {
  return Object.entries(stats ?? {}).filter(([key]) => key !== "currentScore");
}
