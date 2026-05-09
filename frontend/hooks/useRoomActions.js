"use strict";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";
import { useRoom } from "../context/roomContext.jsx";
import { useUser } from "../context/userContext.jsx";

function ensureConnected() {
  if (!socket.connected) socket.connect();
}

export function useRoomActions() {
  const { room, setRoom, setRoomPlayers, setLoading, setError } = useRoom();
  const { user } = useUser();
  const navigate = useNavigate();

  const createRoom = useCallback(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    ensureConnected();
    setLoading(true);
    setError(null);
    socket.emit("room:create", { name: user.name }, (res) => {
      setLoading(false);
      if (res?.ok) {
        navigate("/waitingroom");
      } else {
        setError(res?.error || "Could not create room.");
      }
    });
  }, [user, navigate, setLoading, setError]);

  const joinRoom = useCallback(
    (code) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      ensureConnected();
      setLoading(true);
      setError(null);
      socket.emit(
        "room:join",
        { code, name: user.name },
        (res) => {
          setLoading(false);
          if (res?.ok) {
            navigate("/waitingroom");
          } else {
            setError(res?.error || "Could not join room.");
          }
        }
      );
    },
    [user, navigate, setLoading, setError]
  );

  const leaveRoom = useCallback(() => {
    if (!room) return;
    socket.emit("room:leave", { code: room }, () => {
      setRoom(null);
      setRoomPlayers([]);
    });
  }, [room, setRoom, setRoomPlayers]);

  return { createRoom, joinRoom, leaveRoom };
}
