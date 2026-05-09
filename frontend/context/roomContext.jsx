import { createContext, useContext, useState } from "react";
import { useRoomSync } from "../hooks/useRoomSync.js";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useRoomSync({ setRoom, setRoomPlayers });

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        roomPlayers,
        setRoomPlayers,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => {
  return useContext(RoomContext);
};
