import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useWordValidation } from "../hooks/wordValidation.js";
import { calculateWordScore } from "../hooks/scoring.js";
import { getTimeLeft, getTimerEnd } from "../hooks/timer.js";
import { useRoom } from "./roomContext.jsx";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { room: roomCode, roomPlayers: players, setRoomPlayers: setPlayers } = useRoom();
  const [masterWord, setMasterWord] = useState("");
  const [timeMax, setTimeMax] = useState(600);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timerEnd, setTimerEnd] = useState(null);
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, playing, finished
  const [winner, setWinner] = useState(null);
  const [isPublic, setIsPublic] = useState(null); // true = public, false = private
  const [submittedWords, setSubmittedWords] = useState([]);
  const input = useRef(null);

  const { word, setWord, errors, handleSubmit } = useWordValidation(masterWord);

  const submitWord = useCallback((word) => {
    if (!word) return;
    const normalized = word.trim().toUpperCase();
    if (!normalized) return;

    // Skip duplicates without awarding points
    let isDuplicate = false;
    setSubmittedWords((prev) => {
      if (prev.includes(normalized)) {
        isDuplicate = true;
        return prev;
      }
      return [...prev, normalized];
    });
    if (isDuplicate) return;

    const points = calculateWordScore(
      normalized,
      getTimeLeft(timerEnd),
      { totalTime: timeMax }
    );

    setPlayers((prev) =>
      prev.map((player) =>
        player.isHost
          ? { ...player, score: (player.score ?? 0) + points }
          : player
      )
    );
  }, [timeMax, timerEnd, setPlayers]);

  const onValid = useCallback((validWord) => {
    submitWord(validWord);
    setWord("");
  }, [submitWord, setWord]);

  function startTimer(duration = timeMax) {
    const nextTimeStarted = Date.now();
    const nextTimerEnd = getTimerEnd(nextTimeStarted, duration);

    setTimeStarted(nextTimeStarted);
    setTimerEnd(nextTimerEnd);
  }

  function resetTimer() {
    setTimeStarted(null);
    setTimerEnd(null);
    setMasterWord("");
  }

  function changeWord(changeCount = 1) {
    const nextWordNumber = Math.max(1, changeCount);
    setMasterWord(`WORD${nextWordNumber}`);
  }

  return (
    <GameContext.Provider
      value={{
        roomCode,
        players,
        setPlayers,
        masterWord,
        timeMax,
        setTimeMax,
        timeStarted,
        setTimeStarted,
        timerEnd,
        setTimerEnd,
        startTimer,
        resetTimer,
        changeWord,
        gameStatus,
        setGameStatus,
        winner,
        setWinner,
        isPublic,
        setIsPublic,
        submittedWords,
        setSubmittedWords,
        submitWord,
        word,
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
