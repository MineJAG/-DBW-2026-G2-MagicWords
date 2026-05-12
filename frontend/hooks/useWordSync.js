"use strict";

import { useEffect } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { socket } from "../lib/socket.js";

export function useWordSync(mode) {
  const { roomData } = useRoom();
  const {
    setMasterWord,
    setTimeMax,
    setTimeStarted,
    setTimerEnd,
    setPlayerScore,
    timerEnd,
  } = useGame();

  useEffect(() => {
    if (mode !== "multiplayer" || !roomData) return;
    if (roomData.masterWord) setMasterWord(roomData.masterWord);
    if (roomData.timeLimit) setTimeMax(roomData.timeLimit);
    if (roomData.startedAt) setTimeStarted(roomData.startedAt);
    if (roomData.timerEnd) setTimerEnd(roomData.timerEnd);

    const me = roomData.players?.find((p) => p.socketId === socket.id);
    if (me && typeof me.score === "number") setPlayerScore(me.score);
  }, [mode, roomData, setMasterWord, setTimeMax, setTimeStarted, setTimerEnd, setPlayerScore]);

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

  useEffect(() => {
    if (mode !== "singleplayer" || !timerEnd) return undefined;

    function applyMasterWord(payload) {
      if (payload?.masterWord) {
        setMasterWord(payload.masterWord);
      }
    }

    if (!socket.connected) socket.connect();
    socket.on("singleplayer:word", applyMasterWord);
    socket.emit("singleplayer:start", { timerEnd }, (res) => {
      applyMasterWord(res);
    });

    return () => {
      socket.emit("singleplayer:stop");
      socket.off("singleplayer:word", applyMasterWord);
    };
  }, [mode, setMasterWord, timerEnd]);
}
