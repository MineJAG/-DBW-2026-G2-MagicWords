"use strict";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";

export function useMultiplayerTimerSync(link = "/leaderboard-multiplayer") {
  const navigate = useNavigate();

  useEffect(() => {
    function handleRoomFinished() {
      navigate(link, { replace: true });
    }

    socket.on("room:finished", handleRoomFinished);

    return () => {
      socket.off("room:finished", handleRoomFinished);
    };
  }, [navigate, link]);
}
