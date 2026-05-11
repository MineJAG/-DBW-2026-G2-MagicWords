"use strict";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { socket } from "../lib/socket.js";

export function useWaitingRoom() {
  const navigate = useNavigate();
  const { timeMax, setTimeMax, resetTimer, startTimer } = useGame();
  const { roomData } = useRoom();
  const [minutes, setMinutes] = useState(String(Math.round(timeMax / 60)));
  const [timerError, setTimerError] = useState("");
  const hostSocketId = roomData?.host?.socketId;
  const currentSocketIsHost = hostSocketId === socket.id;

  useEffect(() => {
    setMinutes(String(Math.round(timeMax / 60)));
  }, [timeMax]);

  useEffect(() => {
    resetTimer();
  }, []);

  useEffect(() => {
    function handleRoomStarted(nextRoom) {
      const nextTimeMax = nextRoom?.timeLimit ?? timeMax;

      setTimeMax(nextTimeMax);
      resetTimer();
      startTimer(nextTimeMax);
      navigate("/multiplayer");
    }

    socket.on("room:started", handleRoomStarted);

    return () => {
      socket.off("room:started", handleRoomStarted);
    };
  }, [timeMax, navigate, setTimeMax, resetTimer, startTimer]);

  return {
    timeMax,
    setTimeMax,
    minutes,
    setMinutes,
    timerError,
    setTimerError,
    hostSocketId,
    currentSocketIsHost,
  };
}
