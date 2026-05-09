"use strict";

import { useMemo } from "react";

export function useSortedScore(players) {
  return useMemo(
    () => [...(players ?? [])].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [players]
  );
}
