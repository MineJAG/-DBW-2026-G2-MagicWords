"use strict";

import { useEffect, useRef } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useUser } from "../context/userContext.jsx";
import { socket } from "../lib/socket.js";

/**
 * Sync game-context fields (master word, timers, this player's score, words
 * already submitted) from the multiplayer room. Two effects:
 *
 * 1. On `roomData` change, hydrate every game-context field from the snapshot
 *    and — once per mount — restore the user's `foundWords` from their stats
 *    when local `submittedWords` is still empty. `foundWords` is match-scoped
 *    server-side, so this brings back every word the player has found this
 *    match after a mid-game refresh, regardless of master-word rotations.
 * 2. Subscribe to `room:word` so word rotations land in context immediately.
 *
 * No-ops when `mode !== "multiplayer"`.
 *
 * @param {"multiplayer" | "singleplayer" | string} mode
 * @returns {void}
 */
export function useWordSync(mode) {
  const { roomData } = useRoom();
  const { user } = useUser();
  const {
    setMasterWord,
    setTimeMax,
    setTimeStarted,
    setTimerEnd,
    setPlayerScore,
    submittedWords,
    setSubmittedWords,
  } = useGame();
  const restoredWords = useRef(false);

  useEffect(() => {
    if (mode !== "multiplayer" || !roomData) return;
    if (roomData.masterWord) setMasterWord(roomData.masterWord);
    if (roomData.timeLimit) setTimeMax(roomData.timeLimit);
    if (roomData.startedAt) setTimeStarted(roomData.startedAt);
    if (roomData.timerEnd) setTimerEnd(roomData.timerEnd);

    const me = roomData.players?.find((p) => p.socketId === socket.id);
    if (me && typeof me.score === "number") setPlayerScore(me.score);

    if (!restoredWords.current && user?.stats && roomData.masterWord) {
      restoredWords.current = true;
      if (submittedWords.length === 0 && user.stats.foundWords?.length) {
        setSubmittedWords(user.stats.foundWords);
      }
    }
  }, [mode, roomData, user, submittedWords, setMasterWord, setTimeMax, setTimeStarted, setTimerEnd, setPlayerScore, setSubmittedWords]);

  useEffect(() => {
    if (mode !== "multiplayer") return undefined;

    function applyMasterWord(payload) {
      if (payload?.masterWord) {
        setMasterWord(payload.masterWord);
      }
    }

    socket.on("room:word", applyMasterWord);

    return () => {
      socket.off("room:word", applyMasterWord);
    };
  }, [mode, setMasterWord]);
}
