"use strict";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";
import {
  loadRoomSession,
  clearRoomSession,
} from "../lib/roomSession.js";

export function useRoomSync({ setRoom, setRoomData, setRoomPlayers }) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleUpdate(room) {
      setRoom(room.code);
      setRoomData(room);
      setRoomPlayers(room.players);
    }

    function handleKicked() {
      clearRoomSession();
      setRoom(null);
      setRoomData(null);
      setRoomPlayers([]);
      navigate("/home");
    }

    function attemptRejoin() {
      const session = loadRoomSession();
      if (!session) return;
      socket.emit("room:rejoin", session, (res) => {
        if (res?.ok) {
          setRoom(res.room.code);
          setRoomData(res.room);
          setRoomPlayers(res.room.players ?? []);
        } else {
          clearRoomSession();
          navigate("/home");
        }
      });
    }

    socket.on("room:update", handleUpdate);
    socket.on("room:kicked", handleKicked);
    socket.on("connect", attemptRejoin);

    if (!socket.connected) socket.connect();
    else attemptRejoin();

    return () => {
      socket.off("room:update", handleUpdate);
      socket.off("room:kicked", handleKicked);
      socket.off("connect", attemptRejoin);
    };
  }, [navigate, setRoom, setRoomData, setRoomPlayers]);
}
