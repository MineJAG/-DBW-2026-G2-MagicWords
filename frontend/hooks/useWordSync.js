"use strict";

import { useEffect } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { socket } from "../lib/socket.js";

export function useWordSync(mode) {
  const { roomData } = useRoom();
  const { setMasterWord, timerEnd } = useGame();

  useEffect(() => {
    if (mode === "multiplayer" && roomData?.masterWord) {
      setMasterWord(roomData.masterWord);
    }
  }, [mode, roomData?.masterWord, setMasterWord]);

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
