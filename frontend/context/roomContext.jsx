import { createContext, useContext, useState } from "react";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(1234);
  const [roomPlayers, setRoomPlayers] = useState([
    { id: 1, name: "player1", score: 1234, avatar: null },
    { id: 2, name: "player2", score: 1180, avatar: null },
    { id: 3, name: "player3", score: 1102, avatar: null },
    { id: 4, name: "player4", score: 945, avatar: null },
    { id: 5, name: "player5", score: 880, avatar: null },
    { id: 6, name: "player6", score: 810, avatar: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setError
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => {
  return useContext(RoomContext);
};
