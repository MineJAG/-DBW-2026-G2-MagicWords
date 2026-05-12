"use strict";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";
import { saveRoomSession, clearRoomSession } from "../lib/roomSession.js";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useUser } from "../context/userContext.jsx";

function ensureConnected() {
  if (!socket.connected) socket.connect();
}

export function useRoomActions() {
  const { room, setRoom, setRoomData, setRoomPlayers, setLoading, setError } = useRoom();
  const { handleSubmit, onValid } = useGame();
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
        saveRoomSession({ code: res.room.code, name: user.name });
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
            saveRoomSession({ code: res.room.code, name: user.name });
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
      clearRoomSession();
    });
  }, [room, setRoom, setRoomData, setRoomPlayers]);

  const kickPlayer = useCallback((targetSocketId) => {
    if (!room || !targetSocketId) return;

    setLoading(true);
    setError(null);
    socket.emit("room:kick", { code: room, targetSocketId }, (res) => {
      setLoading(false);
      if (res?.ok) {
        setRoomData(res.room);
        setRoomPlayers(res.room.players ?? []);
      } else {
        setError(res?.error || "Could not kick player.");
      }
    });
  }, [room, setRoomData, setRoomPlayers, setLoading, setError]);

  const startSingleplayer = useCallback(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    ensureConnected();
    setLoading(true);
    setError(null);
    socket.emit("room:create", { name: user.name }, (createRes) => {
      if (!createRes?.ok) {
        setLoading(false);
        setError(createRes?.error || "Could not start singleplayer.");
        return;
      }
      saveRoomSession({ code: createRes.room.code, name: user.name });
      socket.emit("room:start", { code: createRes.room.code }, (startRes) => {
        setLoading(false);
        if (!startRes?.ok) {
          setError(startRes?.error || "Could not start singleplayer.");
          return;
        }
        setRoom(startRes.room.code);
        setRoomData(startRes.room);
        setRoomPlayers(startRes.room.players ?? []);
        navigate("/singleplayer");
      });
    });
  }, [user, navigate, setRoom, setRoomData, setRoomPlayers, setLoading, setError]);

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

  const submitMultiplayerWord = useCallback((event) => {
    handleSubmit(event, onValid, { room });
  }, [handleSubmit, onValid, room]);

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    kickPlayer,
    startRoom,
    startSingleplayer,
    submitMultiplayerWord,
  };
}
