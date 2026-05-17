"use strict";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useRoomActions } from "./useRoomActions.js";
import { socket } from "../lib/socket.js";
import { getTimerEnd } from "../lib/timeUtils.js";
import { setWaitingRoomTimer } from "../lib/timeSetter.js";

/**
 * State for the waiting-room screen. Tracks the host-controlled timer input
 * (and its validation message), exposes whether the current socket is the
 * host, and toggles public/private visibility. Listens for `room:started`
 * to seed game-context timer fields and navigate every player to
 * `/multiplayer` together.
 *
 * @returns {{
 *   timeMax: number,
 *   setTimeMax: (seconds: number) => void,
 *   minutes: string,
 *   setMinutes: (value: string) => void,
 *   timerError: string,
 *   setTimerError: (value: string) => void,
 *   hostSocketId: string | undefined,
 *   currentSocketIsHost: boolean,
 *   isPublic: boolean,
 *   handleToggleVisibility: () => void,
 *   handleMinutesChange: (event: import("react").ChangeEvent<HTMLInputElement>) => void,
 *   handleSetTimer: () => void,
 *   handleStartRoom: () => void,
 *   kickPlayer: (socketId: string) => void,
 * }}
 */
export function useWaitingRoom() {
  const navigate = useNavigate();
  const { timeMax, setTimeMax, resetTimer, setTimeStarted, setTimerEnd } = useGame();
  const { roomData } = useRoom();
  const { setVisibility, startRoom, kickPlayer } = useRoomActions();
  const [minutes, setMinutes] = useState(String(Math.round(timeMax / 60)));
  const [timerError, setTimerError] = useState("");
  const hostSocketId = roomData?.host?.socketId;
  const currentSocketIsHost = hostSocketId === socket.id;
  const isPublic = roomData?.isPublic !== false;

  const handleToggleVisibility = useCallback(() => {
    setVisibility(!isPublic);
  }, [setVisibility, isPublic]);

  const handleMinutesChange = useCallback((event) => {
    setMinutes(event.target.value.replace(/\D/g, ""));
    setTimerError("");
  }, []);

  const handleSetTimer = useCallback(() => {
    const error = setWaitingRoomTimer({ minutes, setMinutes, setTimeMax });
    setTimerError(error);
  }, [minutes, setTimeMax]);

  const handleStartRoom = useCallback(() => {
    setTimerError("");
    const error = setWaitingRoomTimer({ minutes, setMinutes, setTimeMax });
    if (error) {
      setTimerError(error);
      return;
    }
    startRoom({ timeLimit: Number(minutes) * 60 });
  }, [minutes, setTimeMax, startRoom]);

  useEffect(() => {
    setMinutes(String(Math.round(timeMax / 60)));
  }, [timeMax]);

  useEffect(() => {
    resetTimer();
  }, []);

  useEffect(() => {
    function handleRoomStarted(nextRoom) {
      const nextTimeMax = nextRoom?.timeLimit ?? timeMax;
      const nextTimeStarted = nextRoom?.startedAt ?? Date.now();
      const nextTimerEnd =
        nextRoom?.timerEnd ?? getTimerEnd(nextTimeStarted, nextTimeMax);

      resetTimer();
      setTimeMax(nextTimeMax);
      setTimeStarted(nextTimeStarted);
      setTimerEnd(nextTimerEnd);
      navigate("/multiplayer");
    }

    socket.on("room:started", handleRoomStarted);

    return () => {
      socket.off("room:started", handleRoomStarted);
    };
  }, [timeMax, navigate, setTimeMax, resetTimer, setTimeStarted, setTimerEnd]);

  return {
    timeMax,
    setTimeMax,
    minutes,
    setMinutes,
    timerError,
    setTimerError,
    hostSocketId,
    currentSocketIsHost,
    isPublic,
    handleToggleVisibility,
    handleMinutesChange,
    handleSetTimer,
    handleStartRoom,
    kickPlayer,
  };
}
