"use strict";

import { useMemo } from "react";

export default function sortScore(players) {
  const sortedPlayers = useMemo(() => {
    return [...(players ?? [])].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    );
  }, [players]);

  return sortedPlayers;
}
