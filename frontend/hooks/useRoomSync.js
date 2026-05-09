"use strict";

import { useEffect } from "react";
import { socket } from "../lib/socket.js";

export function useRoomSync({ setRoom, setRoomPlayers }) {
  useEffect(() => {
    if (!socket.connected) socket.connect();

    function handleUpdate(room) {
      setRoom(room.code);
      setRoomPlayers(room.players);
    }

    socket.on("room:update", handleUpdate);

    return () => {
      socket.off("room:update", handleUpdate);
    };
  }, [setRoom, setRoomPlayers]);
}
