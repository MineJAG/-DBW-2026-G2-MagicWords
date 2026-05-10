"use strict";

import { useEffect } from "react";
import { socket } from "../lib/socket.js";

export function useRoomSync({ setRoom, setRoomData, setRoomPlayers }) {
  useEffect(() => {
    if (!socket.connected) socket.connect();

    function handleUpdate(room) {
      setRoom(room.code);
      setRoomData(room);
      setRoomPlayers(room.players);
    }

    socket.on("room:update", handleUpdate);

    return () => {
      socket.off("room:update", handleUpdate);
    };
  }, [setRoom, setRoomData, setRoomPlayers]);
}
