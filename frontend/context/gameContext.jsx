import { createContext, useContext, useState, useCallback } from "react";
import { useWordValidation } from "../hooks/wordValidation.js";
import { useRoom } from "./roomContext.jsx";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { room: roomCode, roomPlayers: players, setRoomPlayers: setPlayers } = useRoom();
  const [masterWord, setMasterWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [isPublic, setIsPublic] = useState(null); // true = public, false = private
  const [submittedWords, setSubmittedWords] = useState([]);

  const activeMasterWord = "WORD";

  const { word: input, setWord, errors, handleSubmit } = useWordValidation(activeMasterWord);

  const submitWord = useCallback((word) => {
    if (!word) return;
    const normalized = word.trim().toUpperCase();
    if (!normalized) return;

    // TODO: backend goes here

    setSubmittedWords((prev) =>
      prev.includes(normalized) ? prev : [...prev, normalized]
    );
  }, []);

  const onValid = useCallback((validWord) => {
    submitWord(validWord);
    setWord("");
  }, [submitWord, setWord]);

  return (
    <GameContext.Provider
      value={{
        roomCode,
        players,
        setPlayers,
        masterWord,
        setMasterWord,
        activeMasterWord,
        timeLeft,
        setTimeLeft,
        gameStatus,
        setGameStatus,
        winner,
        setWinner,
        isPublic,
        setIsPublic,
        submittedWords,
        setSubmittedWords,
        submitWord,
        input,
        setWord,
        errors,
        handleSubmit,
        onValid,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
