import { createContext, useContext, useState } from "react";
import { useRoomSync } from "../hooks/useRoomSync.js";

const RoomContext = createContext(null);

/**
 * Keeps track of the room you're in: the code, the players, and a few flags.
 *
 * It also starts `useRoomSync`, which listens to the server for room updates
 * and kicks while the provider is mounted.
 *
 * @param {{ children: import("react").ReactNode }}
 * @returns {JSX.Element}
 */
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

/**
 * Hook to read the room state from any component.
 *
 * @returns {{
 *   room: string | null,   // room code, or null if not in one
 *   setRoom: (code: string | null) => void,
 *   roomData: object | null,   // full room info from the server
 *   setRoomData: (data: object | null) => void,
 *   roomPlayers: Array<{ socketId: string, name: string, score?: number }>,    // players in the room
 *   setRoomPlayers: (players: Array<object>) => void,
 *   loading: boolean,    // true while waiting on the server
 *   setLoading: (v: boolean) => void,
 *   error: string | null,    // last error message, if any
 *   setError: (v: string | null) => void,
 * }}
 */
export const useRoom = () => {
  return useContext(RoomContext);
};
