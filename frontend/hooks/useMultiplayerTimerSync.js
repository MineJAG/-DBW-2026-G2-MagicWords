"use strict";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";

/**
 * Navigate to the leaderboard route when the server announces the match is
 * over (`room:finished`). Source of truth is the server's timer, not the
 * client's countdown.
 *
 * @param {string} [link="/leaderboard-multiplayer"] - Route to redirect to.
 * @returns {void}
 */
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
