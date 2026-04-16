import { createContext, useContext, useState, useCallback } from "react";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        players,
        setPlayers,
        loading,
        setLoading,
        error,
        setError
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => {
  return useContext(RoomContext);;
};