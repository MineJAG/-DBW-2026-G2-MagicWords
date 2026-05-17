"use strict";

import { useMemo } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { socket } from "../lib/socket.js";

/**
 * Return the room's players with the local player's score overridden by the
 * client-side `playerScore` from `gameContext`. This avoids the brief lag
 * between the user submitting a word and the server-pushed `room:update`
 * arriving — their own row reflects the score immediately while everyone
 * else still uses the last server snapshot.
 *
 * @returns {object[]} The same shape as `roomPlayers` from `roomContext`.
 */
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
