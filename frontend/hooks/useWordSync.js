"use strict";

import { useEffect, useRef } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useUser } from "../context/userContext.jsx";
import { socket } from "../lib/socket.js";

export function useWordSync(mode) {
  const { roomData } = useRoom();
  const { user } = useUser();
  const {
    setMasterWord,
    setTimeMax,
    setTimeStarted,
    setTimerEnd,
    setPlayerScore,
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
      if (user.stats.lastMasterWord === roomData.masterWord) {
        setSubmittedWords(user.stats.foundWords ?? []);
      }
    }
  }, [mode, roomData, user, setMasterWord, setTimeMax, setTimeStarted, setTimerEnd, setPlayerScore, setSubmittedWords]);

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
