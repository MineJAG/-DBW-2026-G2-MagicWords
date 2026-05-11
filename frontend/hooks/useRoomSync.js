"use strict";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../lib/socket.js";

export function useRoomSync({ setRoom, setRoomData, setRoomPlayers }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) socket.connect();

    function handleUpdate(room) {
      setRoom(room.code);
      setRoomData(room);
      setRoomPlayers(room.players);
    }

    function handleKicked() {
      setRoom(null);
      setRoomData(null);
      setRoomPlayers([]);
      navigate("/home");
    }

    socket.on("room:update", handleUpdate);
    socket.on("room:kicked", handleKicked);

    return () => {
      socket.off("room:update", handleUpdate);
      socket.off("room:kicked", handleKicked);
    };
  }, [navigate, setRoom, setRoomData, setRoomPlayers]);
}
