import { createContext, useContext, useState } from "react";
import { useRoomSync } from "../hooks/useRoomSync.js";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useRoomSync({ setRoom, setRoomData, setRoomPlayers });

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        roomData,
        setRoomData,
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
