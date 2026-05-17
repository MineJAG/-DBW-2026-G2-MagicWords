"use strict";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";
import { saveRoomSession, clearRoomSession } from "../lib/roomSession.js";
import { useGame } from "../context/gameContext.jsx";
import { useRoom } from "../context/roomContext.jsx";
import { useUser } from "../context/userContext.jsx";

/**
 * Module-level "currently dispatching a room action" flag. Prevents a
 * double-clicked button from firing two `room:*` emits before the first ack
 * arrives. Plain boolean (not state) on purpose so a re-render can't reset it.
 *
 * @type {boolean}
 */
let action = false;

/**
 * Open the shared socket if it isn't already. Safe to call repeatedly.
 *
 * @returns {void}
 */
function ensureConnected() {
  if (!socket.connected) socket.connect();
}

/**
 * Try to take the action lock. Returns `false` if another action is already
 * in flight, in which case the caller should bail out.
 *
 * @returns {boolean}
 */
function lockAction() {
  if (action) return false;
  action = true;
  return true;
}

/**
 * Release the action lock. Always paired with a {@link lockAction} that
 * returned `true`, including in ack/error paths.
 *
 * @returns {void}
 */
function unlockAction() {
  action = false;
}

/**
 * Every multiplayer-room action the UI can take, wrapped over the shared
 * socket. Each action:
 *
 * - bounces the user to `/signin` if they aren't logged in (where relevant),
 * - guards against double-fire via {@link lockAction},
 * - sets `loading` / `error` on the room context,
 * - updates room context state from the server's response,
 * - persists the room session so a refresh can rejoin.
 *
 * @returns {{
 *   createRoom: () => void,
 *   joinRoom: (code: string) => void,
 *   joinRandomRoom: () => void,
 *   leaveRoom: () => void,
 *   kickPlayer: (targetSocketId: string) => void,
 *   setVisibility: (isPublic: boolean) => void,
 *   startRoom: (options?: { timeLimit?: number }) => void,
 *   startSingleplayer: () => void,
 *   submitMultiplayerWord: (event: Event) => void,
 * }}
 */
export function useRoomActions() {
  const { room, setRoom, setRoomData, setRoomPlayers, setLoading, setError } = useRoom();
  const { handleSubmit, onValid, resetTimer } = useGame();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const createRoom = useCallback(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (!lockAction()) return;
    ensureConnected();
    setLoading(true);
    setError(null);
    socket.emit("room:create", { name: user.name }, (res) => {
      unlockAction();
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

  const joinRandomRoom = useCallback(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (!lockAction()) return;
    ensureConnected();
    setLoading(true);
    setError(null);
    socket.emit("room:joinRandom", { name: user.name }, (res) => {
      unlockAction();
      setLoading(false);
      if (res?.ok) {
        setRoom(res.room.code);
        setRoomData(res.room);
        setRoomPlayers(res.room.players ?? []);
        saveRoomSession({ code: res.room.code, name: user.name });
        navigate("/waitingroom");
      } else {
        setError(res?.error || "Could not join a room.");
      }
    });
  }, [user, navigate, setRoom, setRoomData, setRoomPlayers, setLoading, setError]);

  const joinRoom = useCallback(
    (code) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      if (!lockAction()) return;
      ensureConnected();
      setLoading(true);
      setError(null);
      socket.emit(
        "room:join",
        { code, name: user.name },
        (res) => {
          unlockAction();
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
    if (!lockAction()) return;
    socket.emit("room:leave", { code: room }, () => {
      unlockAction();
      setRoom(null);
      setRoomData(null);
      setRoomPlayers([]);
      clearRoomSession();
    });
  }, [room, setRoom, setRoomData, setRoomPlayers]);

  const kickPlayer = useCallback((targetSocketId) => {
    if (!room || !targetSocketId) return;
    if (!lockAction()) return;

    setLoading(true);
    setError(null);
    socket.emit("room:kick", { code: room, targetSocketId }, (res) => {
      unlockAction();
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
    if (!lockAction()) return;
    ensureConnected();
    setLoading(true);
    setError(null);
    socket.emit("room:create", { name: user.name, isSingleplayer: true }, (createRes) => {
      if (!createRes?.ok) {
        unlockAction();
        setLoading(false);
        setError(createRes?.error || "Could not start singleplayer.");
        return;
      }
      saveRoomSession({ code: createRes.room.code, name: user.name });
      socket.emit("room:start", { code: createRes.room.code }, (startRes) => {
        unlockAction();
        setLoading(false);
        if (!startRes?.ok) {
          setError(startRes?.error || "Could not start singleplayer.");
          return;
        }
        resetTimer();
        setUser((prev) =>
          prev?.stats?.foundWords?.length
            ? { ...prev, stats: { ...prev.stats, foundWords: [] } }
            : prev
        );
        setRoom(startRes.room.code);
        setRoomData(startRes.room);
        setRoomPlayers(startRes.room.players ?? []);
        navigate("/singleplayer");
      });
    });
  }, [user, setUser, navigate, resetTimer, setRoom, setRoomData, setRoomPlayers, setLoading, setError]);

  const setVisibility = useCallback((isPublic) => {
    if (!room) return;
    if (!lockAction()) return;
    setError(null);
    socket.emit("room:setVisibility", { code: room, isPublic }, (res) => {
      unlockAction();
      if (res?.ok) {
        setRoomData(res.room);
      } else {
        setError(res?.error || "Could not change visibility.");
      }
    });
  }, [room, setRoomData, setError]);

  const startRoom = useCallback(({ timeLimit } = {}) => {
    if (!room) {
      setError("Create or join a room before starting.");
      return;
    }
    if (!lockAction()) return;

    setLoading(true);
    setError(null);
    socket.emit("room:start", { code: room, timeLimit }, (res) => {
      unlockAction();
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
    joinRandomRoom,
    leaveRoom,
    kickPlayer,
    setVisibility,
    startRoom,
    startSingleplayer,
    submitMultiplayerWord,
  };
}
