import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { roomCode } = useParams();

  const [players, setPlayers] = useState([]);
  const [masterWord, setMasterWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [isPublic, setIsPublic] = useState(null); // true = public, false = private

  return (
    <GameContext.Provider
      value={{
        roomCode,
        players,
        setPlayers,
        masterWord,
        setMasterWord,
        timeLeft,
        setTimeLeft,
        gameStatus,
        setGameStatus,
        winner,
        setWinner,
        isPublic,
        setIsPublic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}