"use strict";

import { useMemo } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { socket } from "../lib/socket.js";

export function useScoredRoomPlayers() {
  const { playerScore } = useGame();
  const { roomPlayers } = useRoom();

  return useMemo(
    () =>
      roomPlayers.map((player) =>
        player.socketId === socket.id ? { ...player, score: playerScore } : player
      ),
    [roomPlayers, playerScore]
  );
}
