"use strict";

import { useMemo } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useUser } from "../context/userContext.jsx";

export function useSingleplayerPlayers() {
  const { playerScore } = useGame();
  const { user } = useUser();

  return useMemo(
    () => [
      {
        id: user?.name ?? "singleplayer-player",
        name: user?.name ?? "You",
        score: playerScore,
        avatar: user?.picture ?? null,
      },
    ],
    [user, playerScore]
  );
}
