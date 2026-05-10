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
  const { room, setRoom, setRoomData, setRoomPlayers, setLoading, setError } = useRoom();
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
        setRoom(res.room.code);
        setRoomData(res.room);
        setRoomPlayers(res.room.players ?? []);
        navigate("/waitingroom");
      } else {
        setError(res?.error || "Could not create room.");
      }
    });
  }, [user, navigate, setRoom, setRoomData, setRoomPlayers, setLoading, setError]);

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
            setRoom(res.room.code);
            setRoomData(res.room);
            setRoomPlayers(res.room.players ?? []);
            navigate("/waitingroom");
          } else {
            setError(res?.error || "Could not join room.");
          }
        }
      );
    },
    [user, navigate, setRoom, setRoomData, setRoomPlayers, setLoading, setError]
  );

  const leaveRoom = useCallback(() => {
    if (!room) return;
    socket.emit("room:leave", { code: room }, () => {
      setRoom(null);
      setRoomData(null);
      setRoomPlayers([]);
    });
  }, [room, setRoom, setRoomData, setRoomPlayers]);

  const startRoom = useCallback(({ timeLimit } = {}) => {
    if (!room) {
      setError("Create or join a room before starting.");
      return;
    }

    setLoading(true);
    setError(null);
    socket.emit("room:start", { code: room, timeLimit }, (res) => {
      setLoading(false);
      if (res?.ok) {
        setRoomData(res.room);
      } else {
        setError(res?.error || "Could not start room.");
      }
    });
  }, [room, setRoomData, setLoading, setError]);

  return { createRoom, joinRoom, leaveRoom, startRoom };
}
