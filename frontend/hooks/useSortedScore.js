"use strict";

import { useMemo } from "react";

/**
 * Return the players array sorted descending by `score` (missing scores
 * treated as 0). Returns a new array each time `players` changes, so it is
 * safe to render directly without mutating the input.
 *
 * @param {Array<{ score?: number } & object> | null | undefined} players
 * @returns {Array<object>}
 */
export function useSortedScore(players) {
  return useMemo(
    () => [...(players ?? [])].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [players]
  );
}
